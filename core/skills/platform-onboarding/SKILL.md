---
name: platform-onboarding
description: How to take a committed recipe repo to a running managed runtime on Introspection and run it — docs discovery, auth, the .introspection manifest, GitHub integration, runtime bootstrap via the introspection CLI, bindings, and task execution. Use for the deploy/connect/run steps.
---

# Onboarding a recipe onto the Introspection platform

## Docs are the source of truth

The platform documentation lives at **https://docs.introspection.dev/** and
serves a machine-readable index at **https://docs.introspection.dev/llms.txt**.
Fetch the index and follow its links whenever you need platform specifics —
this skill cites the pages it is grounded in, and when this skill and the
docs disagree, **the docs win**. The integrations section is the authority on
which apps a recipe can connect to; check it before promising any integration
in an interview.

Key pages for this flow: `/concepts/deploying`, `/workflows/connecting-an-agent`,
`/integrations/github`, `/concepts/bindings`, `/sdk/authentication`, `/sdk/cli`.

## Tooling and auth preflight

Two CLIs are involved, with different jobs:

- **`recipes`** (`@introspection-ai/pi-recipes`) — authoring: create, check,
  install, publish recipe packages.
- **`introspection`** (`@introspection-ai/cli`) — the platform operator CLI:
  runtime bootstrap, staging, bindings, tasks. Runtime bootstrap is
  **CLI-only** (docs: /workflows/connecting-an-agent).

Preflight:

```bash
npm install -g @introspection-ai/pi-recipes @introspection-ai/cli
introspection login     # OAuth device flow, browser-approved member session
introspection whoami    # must identify the intended project + runtime/task scopes
```

Separately, the plugin's bundled MCP server (for in-host `task_run`) reads
`INTROSPECTION_MCP_URL` and `INTROSPECTION_TOKEN` (an environment-scoped API
key, `ik_...`, sent as a Bearer token — docs: /sdk/authentication). API keys
are shown once at creation and scoped to one environment; never ask the user
to paste one into the chat — it belongs in their environment.

## The manifest (docs: /concepts/deploying)

`.introspection/<name>.yaml` connects the recipe package to its runtime
defaults. **The filename stem and `name` must match** — the filename is the
stable runtime-group slug, and a mismatch fails validation with
`filename-mismatch`.

```yaml
# .introspection/support-agent.yaml
name: support-agent
description: One line on what the agent does.
path: .                 # sub-path to the recipe package; default repo root
runtime:
  llm_mode: managed     # platform-supplied model creds (default); byok = your own via bindings
```

Other supported keys: `slug` (defaults to `name`), `runtime_name`,
`includes` (extra file globs), `runtime.resources` (advisory sandbox sizing),
`strict`. Validate offline before deploying:

```bash
introspection recipes validate --profile publish
```

## GitHub integration (docs: /integrations/github, /concepts/deploying)

Deployment is Git-native: the platform pins commits from repositories it can
read through the **organization's GitHub integration** — the Introspection
GitHub App, installed **once per organization** by an admin/owner from the
**organization integrations page** in the app, selecting which repositories
it can access. A repo the integration can't see cannot be pinned:
`runtimes create` fails with `Active GitHub integration not found` or
`Recipe repository has no GitHub integration`.

Getting the published recipe repo under the integration:

- **If the org has no Introspection App installation yet**: an admin/owner
  must install it from the organization integrations page — that first
  install is GitHub's own consent screen and happens in the browser.
- **If the installation exists**, grant it access to the new repo either
  from the integration's repository selection (GitHub App settings /
  organization integrations page), or hands-free via an authenticated `gh`:

  ```bash
  gh api /user/installations --jq '.installations[] | {id, app_slug, account: .account.login}'
  # pick the Introspection app's installation (confirm with the user if ambiguous)
  gh api repos/<owner>/<name> --jq .id
  gh api -X PUT /user/installations/<installation_id>/repositories/<repo_id>
  ```

Bootstrap also requires a clean checkout of pushed `main`: `HEAD` must equal
`origin/main` and `git status --short` must be empty — otherwise the pin
would reference a commit the integration can't see.

## Bootstrap the runtime (docs: /workflows/connecting-an-agent)

Two equivalent paths. Prefer the in-host MCP tool when it is available;
the CLI is the fallback and the reference semantics.

**In-host MCP:** after confirming the clean pushed-`main` checkout, call the
`runtime_create` tool with `name` (the manifest name), `repository`
(`owner/name`), and `git_commit_sha` (the pushed HEAD sha; `git_ref`
defaults to `main`, `sub_path`/`description` optional). It pins the commit
as a recipe and creates the first runtime version in one call, returning the
runtime identity. A 409 means the runtime was already bootstrapped — use
`list_runtimes` to find it; that is normal, not a failure. Requires a
member-identity token (OAuth sign-in); plain API keys are rejected.

**CLI:**

```bash
introspection runtimes create --manifest .introspection/<name>.yaml
```

This creates the immutable recipe pin and the first runtime version; note
the returned `id`, `recipe_id`, and `runtime_group_id`. The image builds
asynchronously (`introspection runtimes get <runtime-id>` shows
`image_status`), but a `pending` version can already serve — the sandbox
builds on demand. Environments: `staging` tracks new versions automatically;
**production moves by merge to `main`** (there is no CLI promote);
`development` is the `introspection dev` lane.

## Bindings (docs: /concepts/bindings, /workflows/connecting-an-agent)

Bindings supply environment-specific config without putting secrets in the
recipe. Skip when the recipe uses the managed model and declares nothing
external. For a declared MCP server, connect credential + endpoint per
environment, scoped to the runtime group slug:

```bash
introspection bindings credentials create \
  --name LINEAR_TOKEN --from-env LINEAR_TOKEN \
  --runtime-group <slug> --environment staging

introspection bindings mcp connect \
  --recipe <recipe-id> --mcp-server-id linear --name Linear \
  --endpoint-url https://mcp.example.com/mcp \
  --header 'Authorization=Bearer ${LINEAR_TOKEN}' \
  --runtime-group <slug> --environment staging
```

Required MCP servers are **not** validated at `runtimes create` — the gap
surfaces as a missing-binding error on the first task. Run
`introspection bindings mcp list --recipe <recipe-id> --runtime-group <slug>
--environment staging` and connect anything reported required-but-missing
before sending work.

## Run

Two equivalent paths for the first run (target `staging`):

- **In-host MCP** (the plugin's bundled server): when unsure which runtimes
  exist, call the `list_runtimes` tool first (optional `runtime` filter) — it
  returns each runtime's name, id, and `image_status`, and its output feeds
  `task_run`'s selector directly. The `task_run` tool takes
  `prompt` and `runtime` (the runtime-group slug; the server resolves the
  latest ready deployment). It returns a task handle — poll `tasks/get` to a
  terminal state (`completed`/`failed`/`cancelled`), then fetch
  `tasks/result`; a retryable not-ready right after completion is normal.
  `input_required` means the agent awaits a follow-up turn.
- **CLI**:

  ```bash
  introspection tasks create --runtime-id <runtime-id> --environment staging \
    --subject onboarding-smoke-1 --prompt "Reply with the word ready."
  introspection tasks follow <task-id> --run <run-id> --since 0
  introspection tasks get <task-id>   # idle or completed = success
  ```

Smoke prompt after bootstrap: `"Reply with the single word: ready"`. Do not
claim the runtime works until a task ends `idle`/`completed`.

## What is deliberately NOT possible from here

Creating projects or GitHub integrations from the CLI (docs list these as
outside CLI scope), programmatic automation ("routine") creation, and any
MCP tools beyond `task_run` — guide the user through the product UI for
those and say plainly that the step is manual today. Never invent an
endpoint, page path, or tool name; when unsure, fetch the docs index and
check.
