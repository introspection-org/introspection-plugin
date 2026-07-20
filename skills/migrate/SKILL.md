---
name: migrate
description: Convert an existing agent into a locally proven Introspection recipe while preserving its approved behavior. Use when the user asks to migrate, port, or package an existing agent for Pi and Introspection.
---

# Migrate

Translate an existing agent into a portable, locally proven recipe in one coherent pass. Preserve approved behavior, not accidental implementation shape. Leave deployment to `$introspection:deploy`.

Load and follow `$introspection:recipes` and `$introspection:evals`.

## Think in behavior, not files

The source architecture is evidence, not the target design. Preserve the outcomes, judgment, side effects, and failure boundaries users rely on. Do not preserve known bugs, dead abstractions, hidden global state, or complexity that exists only because of the old host. Keep every intentional difference explicit and prove that it is acceptable.

Prefer the smallest faithful translation. Recipes are not valuable merely because every source component has a counterpart.

## Understand the source

Locate the real instructions, tools, skills, model configuration, runtime assumptions, authentication, side effects, tests, traces, and representative inputs. Use safe existing evidence and run the source during discovery only when doing so is read-only and cannot trigger an external side effect.

Determine the migration boundary: behavior that must remain equivalent, bugs that should not survive, intentional improvements, unsupported dependencies, and evidence that would demonstrate acceptable parity. Let `$introspection:recipes` perform the current-toolchain, extension, provider, and capability preflight and follow its credential and configuration safety rules.

## Align with the user

Share your understanding of the source behavior, the proposed recipe, the important preservation and change decisions, and how parity will be judged. Mention toolchain upgrades already completed and make uncertainty or unsupported dependencies visible. Choose the clearest natural presentation for this migration rather than forcing a standard brief.

Ask the user to confirm before changing project files or configuration. The recognized Pi and Pi Recipes freshness check is the only allowed pre-confirmation mutation. Treat approval as permission to complete the agreed migration and local proof without routine stops. Pause only if a newly discovered dependency, side effect, provider choice, or behavior difference requires a material decision.

## Translate and prove

Resolve the real package root and use current recipe tooling to scaffold and check it. Translate durable judgment into skills, deterministic operations into scripts and tests, and external access into explicit capabilities or bindings. Default to one agent and avoid global registration unless the user explicitly requests it.

Build a small varied parity set from real usage. Where practical, run the same inputs through the source and fresh Pi recipe sessions. Retain prompts, configuration, outputs, tool evidence, and meaningful differences. Investigate the earliest divergence; do not paper over a translation error with broader prompting. Iterate until the approved behavior is faithfully reproduced or a concrete blocker remains. Then offer the user an interactive Pi TUI run. A `.introspection` manifest is not required for local migration readiness.

## Hand off

Explain what was preserved, what intentionally changed, the parity evidence, known limits, and the resolved package path and agent name. Give the actual local command and the appropriate deploy invocation for the current host:

```text
Try locally:
pi --recipe <resolved-package-path> --agent <agent>

Deploy:
<host invocation for introspection:deploy> <resolved-package-path>
```

Use `/introspection:deploy` in Claude Code and `$introspection:deploy` in Codex. Omit `--agent` only for one unambiguous default agent. Invite the user to request another iteration.

## Firm boundaries

- Do not edit project files or configuration before confirmation, apart from the recognized-toolchain refresh.
- Do not silently switch providers, models, package managers, installation methods, or authentication.
- Do not read or expose credentials.
- Do not preserve known defects merely to claim parity.
- Do not commit, push, open a pull request, register a runtime, change bindings, or deploy in this workflow.
