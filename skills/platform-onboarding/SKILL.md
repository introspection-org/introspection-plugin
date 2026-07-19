---
name: platform-onboarding
description: How to connect a published recipe to Introspection as a managed runtime and run it — auth setup, the .introspection manifest, UI repo-connect walkthrough, and task_run usage. Use for the deploy/connect/run steps.
---

# Onboarding a recipe onto the Introspection platform

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

## Connect (guided, UI)

Walk the user through, concretely:

1. Open the Introspection project → **Settings → Repositories → Connect**.
2. Select the GitHub repo the recipe was published to (install the GitHub app
   for the org if prompted).
3. The platform picks up the manifest and creates the runtime; wait for the
   runtime deployment to reach **ready** (visible on the Runtimes page).

Report-back checkpoint: ask the user to confirm the runtime shows ready
before moving on. Do not claim the runtime exists until they confirm or a
`task_run` proves it.

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
