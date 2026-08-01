---
name: improve
description: Improve a deployed or local Introspection agent with human approval, using production evidence by default or adapting to a user-directed prompt, skill, tool, configuration, eval, failure pattern, runtime, or goal. Use when the user asks to fix, change, or investigate why an Introspection agent behaves as it does and the remedy is expected to land as a change to the recipe. Fix supported problems, publish focused pull requests, add evals only for durable behavioral risk, and propose experiments only when trustworthy offline evidence cannot decide. To read live platform state, explain a task or completion reason, or change a judge, experiment, binding, or credential, use operate instead.
---

# Improve

Improve the right layer of an existing agent with a human in the loop. Start from production evidence unless the user directs the investigation toward a prompt, skill, tool, configuration, eval, failure pattern, runtime, or goal. Treat that direction as scope or a hypothesis, not proof of the cause or permission for a predetermined edit.

## Load capabilities

Load only the local capability modules the investigation reaches:

- [Introspection](../../capabilities/introspection.md) for deployed identity, production evidence, observations, judges, comparisons, or release verification.
- [Evals](../../capabilities/evals.md) for trace analysis, measurement design, suite audits, case approval, judge calibration, or regression interpretation.
- [Pi](../../capabilities/pi.md) for harness, extension, provider, settings, skill, package, or local-execution behavior.
- [Recipes](../../capabilities/recipes.md) for package composition, checks, capability declarations, or durable eval and judge resources.
- [Harbor](../../capabilities/harbor.md) only when the Evals capability selects a new environment-level evaluation or existing Harbor evidence must be interpreted.

For a focused supporting question about an existing agent, load and follow the matching module without forcing an end-to-end production investigation. When one module routes to another, load the named module before acting at that boundary. Leave deployment to `deploy`.

This workflow ends in a change to the recipe. Two neighbors own what it does not, and reaching either is an ordinary handoff rather than a refusal:

- `deploy` moves what an environment resolves to. When live traffic is affected and the remedy is repinning, withdrawing, or restoring a version, hand recovery over first and continue the investigation afterward.
- `operate` reads and changes live platform state that leaves the recipe alone — task and conversation inspection, aggregate telemetry, judge enablement and sampling, experiments, bindings, and credentials.

Name the workflow you are handing to. Never stop at this skill's mutation boundary without one.

Load the `common-failures` reference before starting: it lists, by lifecycle stage, the mistakes that are actually made here — including which edits reach an open chat and which need a new one.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Think from evidence to ownership

Find the earliest meaningful divergence between the intended and observed behavior. Diagnose whether the owner is the environment, access, data, tool implementation, runtime configuration, agent judgment, or product policy before choosing a remedy.

Speak only from evidence actually inspected in the current run. If evidence access is unavailable or the user asks for a dry run, stop at that boundary: state what remains unknown and describe the evidence you would gather next. Never simulate a completed investigation, write “I inspected” for hypothetical work, or fill a diagnosis with invented or placeholder counts, traces, files, causes, confidence, or results.

Gather safe read-only evidence before the human confirmation gate; do not ask permission merely to inspect accessible context. Confirmation belongs after diagnosis and covers the proposed edits and pull-request work. When a dry run forbids discovery, explain that sequence without presenting the evidence plan itself as something awaiting approval.

Fix deterministic failures deterministically. Use an ordinary test when it faithfully protects the behavior. Add an eval only for recurring, important behavioral risk that ordinary tests cannot measure. Propose an experiment only when credible alternatives remain and trustworthy offline evidence cannot answer a bounded question. Do not turn every failure into prompt text, an eval, or an experiment.

## Resolve the target and evidence

For a deployed agent, use the current Introspection CLI and documentation to resolve the project, runtime group, active version, recipe repository, and deployed Git commit. For a local agent, resolve the package root, selected agent, worktree, and available tests or evals. Confirm that the evidence and local code describe the same target before drawing conclusions.

Adapt the evidence plan to the focus:

- With no narrower direction, start from recurring `introspection.pattern` events, then inspect supporting observations and the exact conversations. Include relevant feedback and judgement events and a control sample of ordinary conversations. A zero pattern count is not proof that no issue exists; verify analysis status and raw evidence.
- For prompts or skills, inspect loading, precedence, representative traces, tests or evals, and adjacent instructions that may conflict.
- For tools, scripts, capabilities, or configuration, inspect contracts, permissions, runtime resolution, deterministic failures, and the narrowest faithful tests.
- For evals or judges, inspect provenance, labels, validity, calibration, variance, and whether the measure represents the intended behavior.
- For a stated failure or goal, seek evidence that can falsify as well as support the user's hypothesis, and include controls for displaced failures.

Use production evidence when relevant and available, but do not force it onto a local or deterministic target. Parallelize independent evidence review only when it improves the investigation; decide the shape from evidence volume, coupling, access, cost, and rate limits. Give parallel work the same resolved target and boundaries, ask for evidence and earliest divergence rather than independent solutions, and keep synthesis with the main agent.

Open-code the evidence before imposing a taxonomy. Separate prevalence from severity and business importance. Ask the human to resolve disputed product behavior rather than encoding an agent guess.

## Align with the user

Explain what you inspected, the strongest evidence, the likely owning layer, the change you recommend, and how you will know it worked. Include confidence, meaningful risks, and the proposed pull-request boundary. Mention eval or experiment work only when the evidence justifies it. Use the clearest natural format for this case, not a fixed report shape.

Ask for confirmation before editing project files, changing configuration, or opening pull requests. Approval covers the proposed local changes and focused pull requests, not runtime changes, judge enablement, experiments, or deployment. Pause if the target, side effects, product decision, or pull-request scope changes materially.

## Improve and prove

Establish the unchanged baseline before editing whenever behavioral measurement is warranted. Change one coherent mechanism at a time, then run affected cases, tests, and non-regression controls in fresh Pi sessions with frozen configuration where comparison matters. Inspect the traces behind score changes and iterate until the approved change is proven or a concrete blocker remains.

Parallelize independent reproduction or validation when it materially speeds proof, but do not allow competing edits to the same implementation or scope drift. Keep the result as one coherent change and focused pull request unless the approved plan explicitly separates independent fixes. Preserve unrelated work.

Add an approved eval alongside or before the fix so baseline and candidate comparisons remain trustworthy. If only an experiment is justified, describe the hypothesis, candidates, success measure, guardrails, traffic assumptions, and stopping rule; do not launch it.

## Hand off

Explain the evidence, diagnosis, changes, proof, pull requests, remaining risks, and any justified eval or experiment proposal in the format that best helps the user decide what happens next. Include the resolved package path and agent name, then give the actual local invocation and say to use the deploy skill to ship it.

## Firm boundaries

- Do not edit project files or configuration before confirmation.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not fabricate or simulate production evidence, trace findings, counts, baselines, or test results when access is unavailable. State what remains unverified and what evidence you would gather.
- Do not treat a user hypothesis, aggregate score, or pattern label as root-cause proof.
- Do not create evals or experiments by default; make them earn their permanent cost.
- Do not silently switch providers, models, authentication, or target identity.
- Do not mutate runtimes, bindings, judges, experiments, or deployments in this workflow. Hand version and environment changes to `deploy` and other live-state changes to `operate`; do not report them as unsupported.
