---
name: introspection
description: Provide supporting expertise for narrowly scoped Introspection CLI operations, production-evidence reads, judges, and release verification inside another workflow. Route end-to-end creation, migration, production improvement, and deployment requests to the corresponding public Introspection workflow.
license: Apache-2.0
---

# Introspection

Use the CLI as the only platform interface. Never use the dashboard, a browser, or browser automation to operate Introspection. Keep recipe design in `$introspection:recipes`, evaluation reasoning in `$introspection:evals`, and production diagnosis and fixes in `$introspection:improve`.

## Route through current documentation

1. Select only the workflow matching the request: connect, deploy, run, observe, judge, experiment, or ship.
2. Fetch `https://docs.introspection.dev/llms.txt` and read only the linked CLI workflow and concepts required for that operation.
3. Inspect repository and task context and prepare the execution brief before installing, upgrading, authenticating, or configuring the CLI.
4. Immediately before the first platform command the workflow needs, confirm `introspection` exists and inspect focused help for the exact operation.
5. Use the installed CLI when it supports the required command and flags. Install it only when missing; upgrade a recognized installation only when an actual incompatibility blocks the operation. Use the documented command for its detected installation method, verify in a fresh process, and retry the blocked operation.

Current docs and compatible installed CLI output are authoritative. Do not repeat schemas or command catalogs in this skill. Do not configure host-side servers, host tools, or direct endpoints. Speak in terms of integrations, bindings, capabilities, recipes, runtimes, tasks, conversations, observations, patterns, judges, and experiments.

If current docs and installed help disagree, verify command resolution and whether the required operation is incompatible before upgrading. Do not guess at flags from another source checkout.

If a required platform operation is not available in the current CLI, report the gap and stop at the last supported step. Do not substitute another interface.

## Develop through the platform

After a runtime exists, use `introspection dev` when the user wants to exercise uncommitted recipe changes through the platform's development chat. This complements local Pi proof; it does not replace it and does not create a deployable runtime version.

Authenticate, validate the local recipe, and run from its Git worktree. Prefer an explicit runtime slug when repository-based resolution is ambiguous, and check required bindings before opening the preview when the recipe depends on external capabilities. Keep the command attached while testing: it refreshes the development recipe as files change and prints a runtime preview URL that works only for the attached session.

Prove the loop with a visible recipe-specific change in a development conversation. Stopping the command ends the preview attachment; publishing still follows the normal Git and deployment flow.

## Connect and deploy

- Validate the recipe locally first.
- Confirm the intended Git state and whether this is a first bootstrap or a later candidate version.
- Bootstrap the first runtime only through the documented manifest flow. For later versions, use the immutable version created from the pull-request head; do not create another runtime group.
- Configure required bindings and select the candidate for staging through the CLI.
- Start a representative task through staging runtime-group resolution, follow it to completion, and confirm which exact version answered.
- Retrieve the conversation associated with that task and inspect its complete evidence bundle, not only task status.
- Join the resolved runtime to its recipe pin and verify the intended Git commit.

A successful deployment is a proven user workflow, not merely a created runtime.

Judge definition calibration and judgement reads are supported by the CLI. Live judge enablement and production sampling may not be; report that boundary when encountered and do not silently switch interfaces.

## Learn from production

Navigate from recurring patterns to supporting observations and then to the underlying conversations. Sample normal traffic alongside failures. A zero count from asynchronous analysis is not proof that no issue exists; verify analysis status and raw evidence.

Use the basic improvement loop:

1. Inspect the recurring pattern, supporting observations, source conversations, and random controls.
2. Find the earliest failure and classify it as environment/access, deterministic implementation, agent judgment, or disputed policy.
3. Treat feedback as evidence of a possible eval gap, not as a direct edit instruction.
4. Draft representative cases from traces, remove irrelevant sensitive details, and get domain-owner approval.
5. Use `$introspection:evals` to add the smallest trustworthy check and establish the unchanged baseline.
6. Make one focused improvement and validate it locally and in staging.
7. Promote through the normal Git release path.
8. Verify the active commit with a fresh task, full conversation inspection, and judgement trend.

Treat business outcomes as pressure on eval coverage, not as a reward to chase directly. Form a behavior hypothesis, represent it in approved cases, and validate it offline before considering a production comparison.

## Judge and compare

- Export representative fixtures, including positives, negatives, edge cases, and random controls.
- Calibrate a judge on labeled development data and verify it on held-out data.
- Add the calibrated judge to the recipe, promote it through the normal Git release path, and inspect both aggregate movement and individual disagreements.
- Prefer sequential release comparison when traffic is comparable.
- Use a live experiment only when simultaneous traffic allocation is necessary for a bounded question.

Ending an experiment does not ship its winner. Promotion happens through the repository's normal main-branch release path. After promotion, verify the active commit with a fresh task, conversation inspection, and judgement trend.
