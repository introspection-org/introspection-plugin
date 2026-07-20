---
name: evals
description: Discover agent failure modes and design trustworthy evaluation suites from unit checks, Harbor tasks, semantic judges, and human review. Use for regressions, production error analysis, judge design, score interpretation, or deciding which evaluation layer a behavior needs.
---

# Evals

Turn observed failures into the cheapest trustworthy signal. This skill chooses the evaluation layer; use `$harbor` to author Harbor tasks and `$introspection` for deployed traces, patterns, and judges.

## Establish readiness

State the current level and what evidence is missing:

- **Prototype-ready:** stable vertical contract, observable success, explicit boundaries, and a small varied acceptance set approved by the domain owner.
- **Deployment-ready:** representative coverage, deterministic hard checks, environment tasks where needed, calibrated subjective grading, an unchanged baseline, and staging proof.
- **Optimization-ready:** stable and reproducible measurement with known noise, meaningful headroom, immutable gates, held-out promotion coverage, and a justified research budget.

Do not block a prototype on optimization-grade coverage. Do not call an agent deployment-ready because a few happy-path examples pass.

## Audit before adding

Inspect the current suite, recent traces, known incidents, and score history. For each failure, identify the first observable thing that went wrong rather than the final bad outcome. Let categories emerge from evidence; do not begin with a generic taxonomy.

Sample both:

- targeted failures that motivated the work
- random controls from normal traffic, including successes

Separate environment and access failures from deterministic code defects, agent judgment failures, and product-policy disagreements.

## Choose the lowest sufficient layer

Use this order:

1. deterministic unit or integration check for exact logic, schemas, parsing, or invariants
2. Harbor task only when no deterministic lower seam is faithful and environment-level agent behavior is itself the capability under test
3. semantic judge when correctness is meaning-dependent across varied traces
4. human review when the policy is disputed, rare, or not yet calibratable

A regression case preserves a known failure. A capability suite estimates general ability. Keep both; do not mistake a handful of regressions for capability measurement.

## Build the signal

1. Elicit quality in domain language by comparing concrete good and bad outputs; ask what specifically matters.
2. Save the failing case before fixing it, including its source and evidence.
3. Require explicit domain-owner approval before a subjective case becomes measurement.
4. Define observable success and the unacceptable shortcuts.
5. Make deterministic checks primary wherever possible.
6. Establish a baseline on the unchanged agent.
7. Split examples used to design the change from a held-out promotion set.
8. Calibrate model-based judges against labeled positive and negative examples before trusting aggregate scores.
9. Treat judge or verifier failure as invalid measurement, never as agent failure.
10. Pair score movement with qualitative trace review and real nonzero failure gates.
11. Record agent and model version, evaluation version, run configuration, environment version, raw trace, and verifier output; track quality separately from latency and cost.

Leave an evaluation brief even when implementation is deferred. Read [eval-design.md](references/eval-design.md) for the brief, readiness checks, failure analysis, judge validation, suite health, and repeated-run metrics.

## Route the next step

- Load `$harbor` for environment-level tasks.
- Load `$introspection` to export production evidence, deploy judges, or compare releases.
- Load `$autoresearch` only when the user explicitly requests repeated optimization and the readiness checks in [eval-design.md](references/eval-design.md) pass.

Never improve a score by weakening the task, verifier, judge, or acceptance policy.
