---
name: migrate
description: Convert an existing agent into a locally proven Introspection recipe while preserving its approved behavior. Use when the user asks to migrate, port, or package an existing agent for Pi and Introspection.
---

# Migrate

Translate an existing agent into a portable, locally proven recipe in one coherent pass. Preserve approved behavior, not accidental implementation shape. Leave deployment to `$introspection:deploy`.

## Load capabilities

Load only the local capability modules the migration reaches:

- [Recipes](../../capabilities/recipes.md) for the portable package contract, scaffolding, checks, and capability declarations.
- [Pi](../../capabilities/pi.md) for harness, extension, provider, settings, and local execution behavior.
- [Evals](../../capabilities/evals.md) when parity must be established by measurement rather than by inspecting representative runs.
- [Introspection](../../capabilities/introspection.md) only when the source agent is already deployed and its platform identity or production evidence is the material being migrated.
- [Harbor](../../capabilities/harbor.md) only when the Evals capability selects an environment-level suite as the parity evidence.

When one module routes to another, load the named module before acting at that boundary. Resolve each CLI only when an approved migration step first needs it.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Think in behavior, not files

The source architecture is evidence, not the target design. Preserve the outcomes, judgment, side effects, and failure boundaries users rely on. Do not preserve known bugs, dead abstractions, hidden global state, or complexity that exists only because of the old host. Keep every intentional difference explicit and prove that it is acceptable.

Prefer the smallest faithful translation. Recipes are not valuable merely because every source component has a counterpart.

## Understand the source

Locate the real instructions, tools, skills, model configuration, runtime assumptions, authentication, side effects, tests, traces, and representative inputs. Use safe existing evidence and run the source during discovery only when doing so is read-only and cannot trigger an external side effect.

Determine the migration boundary: behavior that must remain equivalent, bugs that should not survive, intentional improvements, unsupported dependencies, and evidence that would demonstrate acceptable parity. Resolve any provider or model choice that is not preserved by the source. Let the Recipes capability resolve the portable package contract and the Pi capability resolve harness, extension, provider, and local execution behavior. Defer tool installation, upgrades, setup, and authentication until an approved execution step actually needs them.

## Align with the user

Share your understanding of the source behavior, the proposed recipe, the important preservation and change decisions, and how parity will be judged. Make uncertainty or unsupported dependencies visible. Choose the clearest natural presentation for this migration rather than forcing a standard brief.

Ask the user to confirm before changing project files or configuration. Treat approval as permission to complete the agreed migration and local proof without routine stops. Pause only if a newly discovered dependency, side effect, provider choice, or behavior difference requires a material decision.

## Translate and prove

Resolve the real package root and use the Introspection CLI to scaffold and check it. Translate durable judgment into skills, deterministic operations into scripts and tests, and external access into explicit capabilities or bindings. Default to one agent.

Build a small varied parity set from real usage. Where practical, run the same inputs through the source and fresh Pi recipe sessions. Retain prompts, configuration, outputs, tool evidence, and meaningful differences. Investigate the earliest divergence; do not paper over a translation error with broader prompting. Iterate until the approved behavior is faithfully reproduced or a concrete blocker remains. Then offer the user an interactive Pi TUI run. A `.introspection` manifest is not required for local migration readiness.

## Hand off

Explain what was preserved, what intentionally changed, the parity evidence, known limits, and the resolved package path and agent name. Give the actual local command and the appropriate deploy invocation for the current host:

```text
Try locally:
introspection local --agent <agent>

Deploy:
<host invocation for introspection:deploy> <resolved-package-path>
```

Give the local command as the CLI's run verb, matching `$introspection:create`. Scaffolding writes the manifest the verb resolves, and the verb preflights Pi and the recipe instead of surfacing a missing Recipes extension as a bare Pi argument error. Fall back to a direct Pi invocation only when the package deliberately has no manifest, and say why.

Use `/introspection:deploy` in Claude Code and `$introspection:deploy` in Codex. Omit `--agent` only for one unambiguous default agent. Invite the user to request another iteration.

## Firm boundaries

- Do not edit project files or configuration before confirmation.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not silently switch providers, models, package managers, installation methods, or authentication.
- Do not read or expose credentials.
- Do not preserve known defects merely to claim parity.
- Do not commit, push, open a pull request, register a runtime, change bindings, or deploy in this workflow.
