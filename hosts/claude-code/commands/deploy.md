---
description: Publish the current Pi recipe repo and connect it as a managed Introspection runtime
argument-hint: [path to recipe, defaults to current directory]
---

Publish and connect the recipe at `$ARGUMENTS` (default: the current
directory) as a managed Introspection runtime.

1. **Locate + validate.** Confirm the target is a Pi recipe (a `package.json`
   with a `pi` block). Run `recipes check <path>` — a failing check stops the
   deploy.
2. **Publish.** If the recipe has no GitHub remote yet, run
   `recipes publish <path> --github <owner>/<name> --visibility private`
   (ask for the owner if unknown; public only on explicit request). If it is
   already published, commit and push pending changes instead — show the diff
   and get user confirmation before pushing.
3. **Manifest.** Ensure the `.introspection/<name>.yaml` manifest exists per
   the `platform-onboarding` skill; create it if missing.
4. **Connect.** Wire the repo up via the staged GitHub path in the
   `platform-onboarding` skill: `gh`-driven app approval when `gh` is
   authenticated, product-UI walkthrough as the fallback.
5. **Verify.** Once the user reports the runtime is connected, verify with a
   smoke `mcp__introspection__task_run` (`prompt: "Reply with the single word: ready"`,
   `runtime: <name>`) and report the outcome.
