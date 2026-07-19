# End-to-end smoke test: prompt → managed agent → routine

Manual walkthrough validating the full onboarding flow against a real
deployment. Run it top to bottom after any change to the plugin, the MCP
mount, or the bootstrap path. Each step lists the expected result — stop at
the first mismatch and file what you saw.

## Prerequisites

| Requirement | Check |
| --- | --- |
| A deployment with `MCP_TASKS_SERVER_ENABLED=true` (staging) | `curl -s -o /dev/null -w '%{http_code}' https://<dp-host>/v1/mcp` → `401` (challenge) or `405`, **not** `404` |
| Member account on a project in that org | can log into the product UI |
| CLIs installed | `recipes --version`, `introspection --version`, `gh --version` |
| CLI session | `introspection login` then `introspection whoami` shows the intended project |
| A GitHub org/user you can create a repo in | `gh auth status` succeeds |

## 1. Connect the host to the platform

- **OAuth (preferred):** `claude mcp add --transport http introspection https://<dp-host>/v1/mcp` with no credentials → first use triggers browser sign-in.
- **Bearer fallback:** set `INTROSPECTION_MCP_URL` and `INTROSPECTION_TOKEN` (environment-scoped API key) and use the plugin's `.mcp.json`.

**Expect:** the host lists `mcp__introspection__task_run` and `mcp__introspection__list_runtimes`. A `list_runtimes` call returns rows (or "no runtimes") — never an auth error.

## 2. Scaffold and validate a recipe

Run `/introspection:new-agent a demo agent that replies helpfully` (or by
hand: `recipes create ./smoke-agent`, edit, `recipes check ./smoke-agent`).

**Expect:** interview ≤4 questions; a recipe directory with `package.json`
(`pi` block), `SYSTEM.md`, `agents/agent.yaml`; `recipes check` exits 0; no
credential values anywhere in the tree; nothing committed/pushed without an
explicit confirmation prompt.

## 3. Publish

`recipes publish ./smoke-agent --github <owner>/smoke-agent --visibility private`

**Expect:** repo exists on GitHub with the recipe at `main`.

## 4. GitHub wire-up (the step with known unverified paths)

Add the manifest first: `.introspection/smoke-agent.yaml` with
`name: smoke-agent` (filename stem must equal `name`), commit, push.

- **Org has no Introspection App yet:** connect from the org integrations
  page; on GitHub's consent screen select `smoke-agent`. **Expect:** the
  integration shows active in the UI.
- **App already installed — `gh` path (⚠️ unverified for org installations,
  this is the test):**

  ```bash
  gh api /user/installations --jq '.installations[] | {id, app_slug, account: .account.login}'
  gh api repos/<owner>/smoke-agent --jq .id
  gh api -X PUT /user/installations/<installation_id>/repositories/<repo_id>
  ```

  **Expect:** HTTP 204. If it 403s on an org installation, record that —
  the skill's fallback (GitHub App settings → Repository access) must then
  be the documented primary.

## 5. Bootstrap the runtime (public API via CLI)

```bash
git status --short          # must be empty
git rev-parse HEAD origin/main   # must match
introspection recipes validate --profile publish
introspection runtimes create --manifest .introspection/smoke-agent.yaml
```

**Expect:** exit 0 and a runtime id/group. Re-running **expects a 409 /
"already bootstrapped"** message — that is correct behavior, not a failure.
`mcp__introspection__list_runtimes` (filter `smoke-agent`) now shows the
runtime; `image_status` moves `pending → ready` (pending can already serve).

**Known failure modes:** `Active GitHub integration not found` → step 4 was
skipped; image later `failed` on clone → the App can't see the repo (the
create-time visibility fail-fast is a tracked follow-up on the public path).

## 6. First run

`task_run` with `prompt: "Reply with the single word: ready"`,
`runtime: smoke-agent` (or `/introspection:run smoke-agent: ...`).

**Expect:** a task handle; polling reaches `completed` (a not-ready retry
right after completion is normal); the result contains `ready`. The task and
its conversation appear in the product UI.

## 7. Routine (public /v1/automations)

With a member credential carrying `automations:write` (get the runtime group
id from step 5 / `list_runtimes`):

```bash
curl -sf -X POST 'https://<cp-host>/v1/automations?project=<slug>' \
  -H 'Authorization: Bearer <member-token>' -H 'Content-Type: application/json' \
  -d '{"name":"smoke-brief","trigger_type":"cron","cron_schedule":"0 7 * * 1-5",
       "prompt":"Reply with the single word: ready",
       "metadata":{"runtime_group_id":"<group-id>"}}'
```

**Expect:** 201 with a sane `next_trigger_at`; the routine shows on the
project's Automations page. Clean up: `DELETE /v1/automations/<id>` (or the
UI) → subsequent GET no longer lists it.

## 8. Teardown

Delete the runtime and recipe repo (or keep them as the demo). Note total
wall-clock for steps 1–6 — the phase-1 success metric is **under 15 minutes
with no human help beyond the GitHub consent click**.
