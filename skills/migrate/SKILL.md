---
name: migrate
description: Convert an existing agent into an agent recipe tested locally with representative cases while preserving its approved behavior. Use when the user asks to migrate, port, or package an existing agent for Pi and Introspection, or points at an agent implementation built on another framework or host and wants it to run here. An outcome with no existing implementation is create; an agent that is already an agent recipe and needs to behave differently is improve; deploying the result is deploy.
---

# Migrate

Translate an existing agent into a portable agent recipe tested locally with representative cases in one coherent pass. Preserve approved behavior, not accidental implementation shape. Leave deployment to `deploy`.

## Standing rules

Read the [standing boundaries](../../BOUNDARIES.md) and the [reference loading contract](../../CONTRACT.md) before acting. Boundaries hold in every workflow; the contract governs how the index is fetched, how a step id resolves to the content that step needs, how `degradation` is honored when a fetch fails, and the version floor below which this plugin must stop.

Sections below name a step id. Look it up in the index's `steps` map on entering the step and load what it lists. Before the first CLI command, whichever section reaches it first, that step is `*/setup`. The index also carries entries no step routes; match `load_when` against the work rather than assuming the set is what this skill mentions.

## Think in behavior, not files

The source architecture is evidence, not the target design. Preserve the outcomes, judgment, side effects, and failure boundaries users rely on. Do not preserve known bugs, dead abstractions, hidden global state, or complexity that exists only because of the old host. Keep every intentional difference explicit and prove that it is acceptable.

Prefer the smallest faithful translation. Recipes are not valuable merely because every source component has a counterpart.

Confirm there is a migration to perform before translating anything. An agent that is already an agent recipe has nothing to port, so a request to change how it behaves is `improve`; an outcome the user describes with no implementation behind it is `create`. Preserved behavior is the test — when the user cannot point at something whose behavior must survive, this is not the workflow.

## Understand the source

Step `migrate/translate`, and `*/capability-set` when deciding what the ported agent may reach.

Locate the real instructions, tools, skills, model configuration, runtime assumptions, authentication, side effects, tests, traces, and representative inputs. Use safe existing evidence and run the source during discovery only when doing so is read-only and cannot trigger an external side effect.

Determine the migration boundary: behavior that must remain equivalent, bugs that should not survive, intentional improvements, unsupported dependencies, and evidence that would demonstrate acceptable parity. Resolve any provider or model choice that is not preserved by the source. Let this step's references resolve the portable package contract and this step's references resolve harness, extension, provider, and local execution behavior. Defer tool installation, upgrades, setup, and authentication until an approved execution step actually needs them.

## Align with the user

Share your understanding of the source behavior, the proposed recipe, the important preservation and change decisions, and how parity will be judged. Make uncertainty or unsupported dependencies visible. Choose the clearest natural presentation for this migration rather than forcing a standard brief.

Ask the user to confirm before changing project files or configuration. Treat approval as permission to complete the agreed migration and local proof without routine stops. Pause only if a newly discovered dependency, side effect, provider choice, or behavior difference requires a material decision.

## Translate and prove

Step `migrate/prove`.

Resolve the real package root and use the Introspection CLI to scaffold and check it. Translate durable judgment into skills, deterministic operations into scripts and tests, and external access into explicit capabilities or bindings. Default to one agent.

Build a small varied parity set from real usage. Where practical, run the same inputs through the source and fresh agent recipe sessions in Pi. Retain prompts, configuration, outputs, tool evidence, and meaningful differences. Use the index's local evaluation guidance only when preserving an existing eval or when the approved parity contract requires a persistent runner; otherwise keep the proof in fresh one-shot Pi sessions. Use `introspection local -p` when the package has a `.introspection` manifest, and fall back to the resolved direct Pi invocation when it deliberately does not. When an eval is warranted, preserve the source suite and execute the Recipe through its selected Evalite or Harbor runner instead of inventing a new wrapper. Investigate the earliest divergence; do not paper over a translation error with broader prompting. Iterate until the approved behavior is faithfully reproduced or a concrete blocker remains. Then offer the user an interactive Pi TUI run. A `.introspection` manifest is not required for local migration readiness.

## Hand off

Explain what was preserved, what intentionally changed, the parity evidence, known limits, and the resolved package path and agent name. Give the actual local command:

```text
Try locally:
introspection local
```

Give the local command as the CLI's run verb, matching `create`. Scaffolding writes the manifest the verb resolves, and the verb preflights Pi and the recipe instead of surfacing a missing Recipes extension as a bare Pi argument error. Fall back to a direct Pi invocation only when the package deliberately has no manifest, and say why.

Use the deploy skill to deploy it. Invite the user to request another iteration.

## Firm boundaries

- Do not edit project files or configuration before confirmation.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not silently switch providers, models, package managers, installation methods, or authentication.
- Do not read or expose credentials.
- Do not preserve known defects merely to claim parity.
- Do not commit, push, open a pull request, register a runtime, change bindings, or deploy in this workflow.
