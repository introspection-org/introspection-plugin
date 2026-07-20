---
name: introspection
description: Deploy, run, observe, judge, compare, and promote agent recipes through the Introspection CLI. Use for platform onboarding, production evidence, recurring patterns, semantic judges, release comparisons, or live experiments.
---

# Introspection

Use the CLI as the only platform interface. Keep recipe design in `$recipes`, evaluation reasoning in `$evals`, and structured optimization in `$autoresearch`.

## Route through current documentation

1. Fetch `https://docs.introspection.dev/llms.txt`.
2. Select only the workflow matching the request: connect, deploy, run, observe, judge, experiment, or ship.
3. Read the linked page before acting.
4. Confirm exact flags and payloads with `introspection <group> --help`.

Current docs and installed CLI output are authoritative. Do not repeat schemas or command catalogs in this skill. Do not configure host-side servers, host tools, or direct endpoints. Speak in terms of integrations, bindings, capabilities, recipes, runtimes, tasks, conversations, observations, patterns, judges, and experiments.

If a required platform operation is not available in the current CLI, report the gap and stop at the last supported step. Do not substitute another interface.

## Connect and deploy

- Validate the recipe locally first.
- Confirm the intended Git state is committed and pushed.
- Create or update the runtime and required bindings through the CLI.
- Start a representative task and follow it to completion.
- Inspect the resulting conversation and evidence, not only the task status.

A successful deployment is a proven user workflow, not merely a created runtime.

## Learn from production

Navigate from recurring patterns to supporting observations and then to the underlying conversations. Sample normal traffic alongside failures. A zero count from asynchronous analysis is not proof that no issue exists; verify analysis status and raw evidence.

Use the basic improvement loop:

1. Inspect the recurring pattern, supporting observations, source conversations, and random controls.
2. Find the earliest failure and classify it as environment/access, deterministic implementation, agent judgment, or disputed policy.
3. Treat feedback as evidence of a possible eval gap, not as a direct edit instruction.
4. Draft representative cases from traces, remove irrelevant sensitive details, and get domain-owner approval.
5. Use `$evals` to add the smallest trustworthy check and establish the unchanged baseline.
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
