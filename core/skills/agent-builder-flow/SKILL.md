---
name: agent-builder-flow
description: The host-neutral new-agent flow — interview, scaffold a Pi recipe, validate, commit, publish, wire up to Introspection, first run. Use whenever building a custom agent from a user prompt (the new-agent command/prompt in any host).
---

# Building a custom agent from a prompt

The deliverable of this flow is a **Pi recipe git repository the user owns
and commits**, wired up to Introspection as a managed runtime. Follow the
`recipe-authoring` skill for file formats and the `platform-onboarding` skill
for auth, wire-up, and running.

Hosts with subagents (Claude Code) delegate steps 2–4 to the `builder`
agent; hosts without them run the same steps inline.

## The flow

1. **Preflight.** Check `recipes --version` works (if not: tell the user to
   run `npm install -g @introspection-ai/pi-recipes` and stop). For the
   managed steps, also check the `introspection` CLI
   (`npm install -g @introspection-ai/cli`, then `introspection login` +
   `introspection whoami`) and whether the Introspection MCP `task_run` tool
   is available. If neither is set up, say up front that steps 6–7 will be
   guided-only; the user still gets a working local recipe.

2. **Interview.** At most 2–4 questions, and only where the prompt
   underdetermines the recipe: voice/audience, integrations, cadence
   (interactive vs. scheduled variant), boundaries (never-do rules). Skip
   anything derivable from the prompt; never ask about models or infra
   unprompted. Before offering or confirming integrations, check what the
   platform actually supports via the docs index
   (https://docs.introspection.dev/llms.txt — see `platform-onboarding`);
   never promise an integration the docs don't list.

3. **Scaffold.** `recipes create ./<kebab-name>`, then edit
   `agents/agent.yaml`, `SYSTEM.md`, and add `skills/**/SKILL.md` per the
   interview and the `recipe-authoring` skill. Scheduled behavior becomes a
   named variant agent (`from: agent`), not a second recipe. Offer to lift
   the user's existing agent skills into the recipe — same `SKILL.md` format.

4. **Validate.** `recipes check ./<name>` is a hard gate: fix findings and
   re-run until clean. Never continue with a failing check.

5. **Review + commit.** Show the user the full generated file tree and key
   file contents. Offer a local test-drive (`recipes install` +
   `pi --recipe <name>`) where the `pi` CLI exists. Then help them commit:
   the repo is theirs, so the commit happens with their confirmation after
   they've seen the diff. **Nothing leaves the machine without explicit
   approval** — recipes can contain executable extensions.

6. **Publish + wire up.** `recipes publish ./<name> --github <owner>/<name>
   --visibility private` (ask for the owner; public only on explicit
   request), then follow the `platform-onboarding` skill: write the
   `.introspection/<name>.yaml` manifest (filename stem must equal `name`),
   get the repo under the organization's GitHub integration (the `gh`-driven
   grant when available, the org integrations page otherwise), confirm a
   clean checkout of pushed `main`, validate with
   `introspection recipes validate --profile publish`, and bootstrap with
   `introspection runtimes create --manifest .introspection/<name>.yaml`.
   Connect any declared bindings for `staging`.

7. **First run.** Target `staging`: `task_run` with a representative prompt
   and `runtime: <name>` (or `introspection tasks create`); poll to a
   terminal state and show the result — the hello-world moment. Success is
   `idle` or `completed`.

8. **Wrap up.** Summarize what now exists (repo URL, runtime name, how to run
   it) and offer to set up a routine if the interview surfaced a schedule.

## Hard rules

- **Never write credentials into the recipe** — no tokens, keys, or passwords
  in any generated file. Integrations use `${NAME}` credential references
  (see `recipe-authoring`).
- **Never publish, push, or register without explicit user confirmation**
  after showing the diff (step 5).
- **Never fabricate platform state.** If an MCP call or `gh` call fails,
  report exactly what happened and where the user can look.
