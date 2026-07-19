---
description: Publish the current Pi recipe repo and bootstrap it as a managed Introspection runtime
argument-hint: [path to recipe, defaults to current directory]
---

Publish and bootstrap the recipe at `$ARGUMENTS` (default: the current
directory) as a managed Introspection runtime, following the
`platform-onboarding` skill throughout.

1. **Locate + validate.** Confirm the target is a Pi recipe (a `package.json`
   with a `pi` block). Run `recipes check <path>` and
   `introspection recipes validate --profile publish` — a failing check stops
   the deploy.
2. **Publish.** If the recipe has no GitHub remote yet, run
   `recipes publish <path> --github <owner>/<name> --visibility private`
   (ask for the owner if unknown; public only on explicit request). If it is
   already published, help the user commit and push pending changes — show
   the diff and get confirmation before pushing.
3. **Manifest.** Ensure `.introspection/<name>.yaml` exists (filename stem
   must equal `name`); create it per the `platform-onboarding` skill if
   missing, commit, and push.
4. **GitHub integration.** Get the repo under the organization's GitHub
   integration: `gh`-driven grant to the Introspection App installation when
   `gh` is authenticated, otherwise the org integrations page (admin/owner).
5. **Bootstrap.** Confirm a clean checkout of pushed `main`
   (`git status --short` empty, `HEAD` == `origin/main`), then bootstrap per
   the `platform-onboarding` skill: prefer `mcp__introspection__runtime_create`
   (name, repository, pushed HEAD sha; 409 = already bootstrapped, find it via
   `list_runtimes`), falling back to
   `introspection runtimes create --manifest .introspection/<name>.yaml`.
   Connect any declared bindings for `staging` and check
   `introspection bindings mcp list` for required-but-missing entries.
6. **Verify.** Smoke-test with `mcp__introspection__task_run`
   (`prompt: "Reply with the single word: ready"`, `runtime: <name>`) or
   `introspection tasks create --environment staging`, and report the
   outcome. Success is a task ending `idle` or `completed`.
