---
description: Build a custom managed agent from a prompt — interview, scaffold a Pi recipe, validate, publish, and connect it to Introspection
argument-hint: <describe the agent you want, e.g. "an email agent that drafts replies and sends me a morning priorities summary">
---

Build a custom agent for the user from this prompt:

> $ARGUMENTS

Follow the `recipe-authoring` and `platform-onboarding` skills throughout.
Delegate the interview and scaffolding to the `builder` agent; you own the
publish/connect/first-run steps and all user confirmations.

## Flow

1. **Preflight.** Check `recipes --version` works (if not, tell the user to
   run `npm install -g @introspection-ai/pi-recipes` and stop). Check whether
   the `mcp__introspection__task_run` tool is available — if not, the managed
   steps (6–7) will be skipped and you should say so up front: the user still
   gets a working local recipe.

2. **Interview** (builder agent). At most 2–4 questions, and only where the
   prompt underdetermines the recipe: audience/voice, integrations needed,
   schedule, delivery target. Skip anything already derivable from the prompt.
   Never ask generic questions for the sake of it.

3. **Scaffold** (builder agent). `recipes create ./<kebab-name>`, then edit
   `agents/agent.yaml`, `SYSTEM.md`, and add `skills/**/SKILL.md` per the
   interview and the `recipe-authoring` skill. If the described behavior has a
   scheduled/background variant (e.g. a daily brief), add it as a named
   variant agent (`from: agent`) rather than a second recipe. If the user has
   existing Claude Code skills relevant to the task, offer to copy them into
   the recipe — recipe skills use the same `SKILL.md` format.

4. **Validate.** Run `recipes check ./<name>`. Fix findings and re-run until
   clean. This is a hard gate: never continue with a failing check.

5. **Review + test-drive.** Show the user the full generated file tree and the
   key file contents (`agents/*.yaml`, `SYSTEM.md`, skill names). If the `pi`
   CLI is available, offer `recipes install ./<name>` + `pi --recipe <name>`
   for a local test-drive. **Get explicit confirmation before anything leaves
   the machine** — recipes can contain executable extensions, so nothing is
   published or registered without the user approving what they saw.

6. **Publish.** `recipes publish ./<name> --github <owner>/<name> --visibility private`
   (private is the default; public only if the user asks). Ask which GitHub
   owner/org to publish under if not obvious.

7. **Connect + first run.** Follow the `platform-onboarding` skill: write the
   `.introspection/<name>.yaml` manifest, walk the user through connecting the
   repo as a managed runtime in the Introspection UI, then run the hello-world
   moment: `mcp__introspection__task_run` with a representative prompt and
   `runtime: <name>`. Poll the task to completion and show the result.

8. **Wrap up.** Summarize what now exists (repo URL, runtime name, how to run
   it), and offer `/introspection:routine` if the interview surfaced a
   schedule.

## Hard rules

- **Never write credentials into the recipe** — no tokens, API keys, or
  passwords in any generated file. Integrations reference platform-held
  credentials as `${NAME}` placeholders (see the `recipe-authoring` skill).
- **Never publish or register without explicit user confirmation** after
  showing the diff (step 5).
- **Never fabricate platform state.** If an MCP call fails or the runtime
  isn't ready, report exactly what happened and where the user can look.
