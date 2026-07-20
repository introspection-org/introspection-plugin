---
name: evals
description: Analyze agent behavior, discover and prioritize failure modes, and turn domain judgment into trustworthy measurements using deterministic checks, Harbor tasks, calibrated judges, production monitoring, and human review. Use for trace review, error analysis, evaluation design, labeling, judge validation, regressions, score interpretation, product-quality investigations, or deciding what is worth evaluating.
---

# Evals

Treat evals as the systematic practice of understanding, measuring, and improving an agent—not as a test suite assembled before looking at behavior. Follow the loop:

**observe → analyze → measure → improve → monitor → repeat**

The aim is actionable product improvement. A large suite, polished dashboard, or rising score is not success by itself.

## Start with evidence, not evaluators

Instrument the complete behavior before choosing metrics. Gather representative traces with inputs, context, capability calls, outputs, errors, latency, user feedback, and downstream outcomes. Use `$introspection` for deployed evidence.

Review both targeted failures and random controls from normal traffic. Include important cohorts and rare high-risk paths. Synthetic cases may extend coverage after real behavior establishes the failure modes; they cannot invent the product's definition of quality.

If the current risk is low and an obvious localized fix resolves the observed problem, make and verify the fix. Evals are not free, and not every defect deserves a permanent evaluator.

## Analyze errors before measuring them

Put the responsible domain expert closest to the data. Prefer one clearly accountable quality owner who can resolve ambiguity; use multiple reviewers to expose unclear policy, not to replace ownership with endless consensus.

Perform open coding:

1. Inspect one trace in context.
2. Record the earliest meaningful divergence from the desired behavior.
3. Write a concrete note describing what happened and why it matters; do not force it into a predefined rubric yet.
4. Move on, then revisit earlier traces as new patterns emerge.
5. Continue until additional review stops producing materially new failure modes.

Use AI to reduce review friction: render traces clearly, propose representative samples, organize notes, and find more examples of a human-accepted pattern. Do not ask AI to infer the product's taste, invent the final taxonomy, or prioritize issues without human judgment.

After open coding, cluster related notes into specific, actionable failure modes. Let AI propose groupings, then have the quality owner refine them and preserve a `none of the above` path. Count prevalence, but prioritize with severity, business importance, reach, and tractability as well; a rare catastrophic failure can outrank a common cosmetic one.

## Measure only what earns measurement

For each selected failure mode, choose the cheapest faithful evaluator:

1. deterministic code for exact invariants, schemas, calculations, and known outcomes
2. `$harbor` when environment-level agent behavior is the capability under test
3. a narrowly scoped semantic judge when correctness depends on meaning
4. human review when policy is disputed, rare, or not yet expressible reliably

Make one judge answer one specific question. Prefer an operational pass/fail decision over an ambiguous rating scale. A judge is another fallible model and must earn trust against human-labeled examples before it gates changes or monitors production.

Build balanced development examples with positives, negatives, hard boundaries, and written rationales. Keep prompt-development, validation, and held-out test data separate. Diagnose true-positive and true-negative behavior, false positives, and false negatives separately; aggregate agreement can hide a judge that always predicts the majority class.

Read [eval-design.md](references/eval-design.md) for the complete error-analysis protocol, dataset design, judge calibration, collaboration model, and operationalization checks.

## Improve and close the loop

Establish the unchanged baseline before editing the agent. Freeze evaluation cases, evaluators, judge model, thresholds, and run configuration during comparison. Change one coherent mechanism, rerun the relevant suite, inspect traces behind score changes, and check held-out and non-regression gates.

Reuse trustworthy evaluators in two places:

- development and CI, to prevent known regressions and compare candidates
- sampled production traffic, to detect prevalence changes, drift, and new cohorts

Choose production samples for coverage and statistical stability, not an arbitrary percentage. Track evaluator results beside human labels and business outcomes. When they disagree, investigate the measurement contract: a better proxy score with a worse user outcome is evidence of a missing or invalid eval, not proof that the product improved.

New complaints, product changes, cohorts, and recurring patterns restart error analysis. Quality criteria drift as people see more behavior; version the taxonomy, labels, evaluators, and approval decisions instead of pretending the first rubric is permanent.

## Establish readiness

State the current level and what evidence is missing:

- **Prototype-ready:** stable vertical contract, observable success, explicit boundaries, and a small varied acceptance set approved by the domain owner.
- **Deployment-ready:** representative coverage, deterministic hard checks, environment tasks where needed, calibrated subjective grading, an unchanged baseline, and staging proof.
- **Optimization-ready:** stable and reproducible measurement with known noise, meaningful headroom, immutable gates, held-out promotion coverage, and a justified research budget.

Do not block a prototype on optimization-grade coverage. Do not call an agent deployment-ready because a few happy-path examples pass.

## Route the next step

- Load `$harbor` for environment-level tasks. Its normal path is the official `create-task` skill; `rewardkit` is conditional, and `harbor-exec` is only for loose-input map or map-reduce work.
- Load `$introspection` to inspect production evidence, deploy calibrated judges, sample live behavior, or compare releases.
- Load `$autoresearch` only when the user explicitly requests repeated optimization and the suite is already representative, reproducible, frozen, and worth optimizing.

Never improve a score by weakening the task, labels, evaluator, judge, or acceptance policy. Treat evaluator failures as invalid measurement, never as agent failures.
