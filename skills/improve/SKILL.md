---
name: improve
description: Improve an existing agent with human approval, using production evidence by default or adapting to a user-directed prompt, skill, tool, configuration, eval, failure pattern, runtime, or goal. Fix supported problems, publish focused pull requests, add evals only for durable behavioral risk, and propose experiments only when trustworthy offline evidence cannot decide.
---

# Improve

Improve the right layer of an existing agent with a human in the loop. Start from production evidence unless the user directs the investigation toward a prompt, skill, tool, configuration, eval, failure pattern, runtime, or goal. Treat that direction as scope or a hypothesis, not proof of the cause or permission for a predetermined edit.

Load and follow `$introspection:introspection`, `$introspection:evals`, and `$introspection:recipes`. Leave deployment to `$introspection:deploy`.

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

Explain the evidence, diagnosis, changes, proof, pull requests, remaining risks, and any justified eval or experiment proposal in the format that best helps the user decide what happens next. Include the resolved package path and agent name, then give the actual local and deploy invocations for the current host.

## Firm boundaries

- Do not edit project files or configuration before confirmation.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not fabricate or simulate production evidence, trace findings, counts, baselines, or test results when access is unavailable. State what remains unverified and what evidence you would gather.
- Do not treat a user hypothesis, aggregate score, or pattern label as root-cause proof.
- Do not create evals or experiments by default; make them earn their permanent cost.
- Do not silently switch providers, models, authentication, or target identity.
- Do not mutate runtimes, bindings, judges, experiments, or deployments in this workflow.
