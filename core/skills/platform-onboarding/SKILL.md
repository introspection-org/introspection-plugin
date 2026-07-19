---
name: platform-onboarding
description: How to connect a published recipe to Introspection as a managed runtime and run it — auth setup, the .introspection manifest, UI repo-connect walkthrough, and task_run usage. Use for the deploy/connect/run steps.
---

# Onboarding a recipe onto the Introspection platform

## Docs are the source of truth

The platform documentation lives at **https://docs.introspection.dev/** and
serves a machine-readable index at **https://docs.introspection.dev/llms.txt**.
Fetch the index first and follow its links whenever you need to know what the
platform offers — available integrations, getting-started steps, platform
concepts, workflows, and the API (OpenAPI spec) — rather than guessing from
memory. In particular, the integrations section is the authority on which
apps a recipe can connect to; check it before promising any integration in
an interview.

The managed path takes a published recipe repo and turns it into a runtime:
sandboxed execution, telemetry, observations, and evals with no infrastructure
on the user's side. In the current phase, publishing and running are
automated; the connect step is guided through the product UI.

## Auth preflight

The plugin's MCP server needs two environment variables (see the plugin
README): `INTROSPECTION_MCP_URL` (the project's data-plane `/v1/mcp` endpoint)
and `INTROSPECTION_API_TOKEN` (a project-scoped token, created in the product
UI). If `mcp__introspection__task_run` is not among the available tools, auth
isn't set up — send the user to the README's Auth section rather than
improvising. Never ask the user to paste a token into the chat; it belongs in
their environment.

## The manifest

The repo-connect flow reads a manifest at `.introspection/<recipe-name>.yaml`
in the recipe repo, following the platform's `pi-agent` template contract
(recipe name + optional description; the runtime takes the recipe's name).
Create it before connecting:

```yaml
# .introspection/<recipe-name>.yaml
name: <recipe-name>
description: <one line, optional>
```

If the platform rejects the manifest on connect, prefer regenerating from the
current `pi-agent` template over guessing fields — the template is the source
of truth, not this skill.

## Connect (staged: `gh` first, UI fallback)

The platform's GitHub App must be granted access to the published recipe repo
before the connect flow can create the runtime.

**Path A — `gh`-driven app approval (preferred when available).**
If `gh auth status` succeeds:

1. Find the Introspection app installation:
   `gh api /user/installations --jq '.installations[] | {id, app_slug, account: .account.login}'`
   and pick the Introspection app's entry (confirm with the user if the slug
   is ambiguous or several accounts match). If no Introspection installation
   exists at all, the org hasn't installed the app yet — that first install
   is GitHub's own consent screen and must happen in the browser; fall back
   to Path B.
2. Get the repo id: `gh api repos/<owner>/<name> --jq .id`.
3. Grant access:
   `gh api -X PUT /user/installations/<installation_id>/repositories/<repo_id>`.
4. Tell the user the repo is now visible to the platform, and have them
   finish the connect on the project's **Settings → Repositories** page (the
   platform picks up the manifest and creates the runtime).

**Path B — product UI (always works).**

1. Open the Introspection project → **Settings → Repositories → Connect**.
2. Select the GitHub repo the recipe was published to (install/approve the
   GitHub App for the org if prompted).
3. The platform picks up the manifest and creates the runtime.

**Both paths:** wait for the runtime deployment to reach **ready** (visible
on the Runtimes page). Report-back checkpoint: ask the user to confirm the
runtime shows ready before moving on. Do not claim the runtime exists until
they confirm or a `task_run` proves it. (A push-triggered OIDC
self-registration Action is planned platform work; do not simulate it —
until it ships, wiring up is these two paths.)

## Run

`mcp__introspection__task_run` is the single action the platform MCP exposes:

- Arguments: `prompt` (what to do) and `runtime` (the runtime name/slug — the
  server resolves it to the latest ready deployment; there is no way to pin a
  specific deployment id, and the run always uses the recipe's default
  `agents/agent.yaml`).
- It returns a **task handle**, not a result. Poll `tasks/get` until the task
  reaches a terminal state (`completed`/`failed`/`cancelled`), then fetch
  `tasks/result`. A "result not ready" retryable error right after completion
  is normal — poll again briefly.
- `input_required` status means the agent is waiting for a follow-up turn.

Smoke test after connect: `prompt: "Reply with the single word: ready"`,
`runtime: <name>`.

## What is deliberately NOT possible yet

Creating runtimes, automations (routines), or credentials via MCP/API from
here — those are phase-2 platform work. When a flow needs them, guide the
user through the product UI and say plainly that this step is manual today.
Never invent an endpoint or tool name.
