---
name: autoresearch
description: Run advanced, guarded Evo improvement loops for production agents. Use only when the user explicitly requests repeated candidate optimization and a stable agent already has human-approved, representative, reproducible evals with baseline failures, measurable headroom, protected gates, and a justified research budget. Do not use for initial agent building, early eval development, or a single focused fix.
---

# Autoresearch

Tie production learning, evaluation, optimization, and release into one evidence loop. This is an advanced opt-in workflow, not the default way to improve an agent.

## Pass the readiness gate

Proceed only when all are true:

- The vertical contract is stable and the agent has been proven on representative work.
- Domain owners approved what good means through concrete cases, including normal, failure, boundary, and refusal behavior.
- Every optimization case has provenance; subjective cases have explicit human approval.
- Deterministic checks are stable and semantic judges are calibrated.
- The unchanged baseline has repeatable failures, known noise, and meaningful headroom.
- Evaluation files and nonzero gates can remain immutable during comparison.
- Repeated candidate search is justified over one localized fix.
- The research question, allowed edit surface, budget, stopping rule, reviewer, and rollback owner are explicit.

If any condition fails, stop. Use `$recipes` to stabilize the agent, `$evals` to strengthen measurement, or `$introspection` for a manual evidence-to-fix-to-deploy loop.

## Load only the phase you need

Read the current Evo skill for the active phase before acting:

- discover before initializing research or defining the benchmark
- optimize before launching or managing candidate experiments
- ship only after a winner survives promotion checks

Use current Evo documentation and CLI help for exact commands and files. Read [research-design.md](references/research-design.md) for the cross-phase guardrails retained from Evo.

## 1. Ground the question

Use `$introspection` to gather production patterns, observations, conversations, and random controls. Use `$evals` to identify the earliest failures and select the evaluation layer. Use `$harbor` where end-to-end environment behavior matters.

Write one bounded research question. Freeze:

- primary score and direction
- required nonzero gates
- held-out promotion slice
- allowed files and immutable evaluation files
- compute, concurrency, cost, and time budgets
- stopping and rollback conditions

Before turning production conversations into fixtures, define authorization, redaction, access, retention, and deletion rules. Prefer sanitized or synthetic equivalents when raw data is not required.

## 2. Discover

Keep the main worktree clean. Establish the unchanged baseline in the research worktree and audit dirty or untracked dependencies before initialization. Confirm the benchmark measures the intended capability, has enough headroom, and cannot be trivially gamed.

Record candidate hypotheses with mechanism, expected signal, parent, allowed surface, and evidence pointer. Separate causal ideas from bundles of unrelated edits.

Keep candidate authors blind to hidden answers and identifiable test details. Give them sanitized failure patterns, constraints, and evidence pointers rather than answer keys.

## 3. Optimize

Run isolated candidates with resource-bound concurrency. Give every candidate the same benchmark contract and prohibit changes to tasks, tests, fixtures, verifiers, judges, and gates. Preserve failed results and inspect history before repeating ideas.

When progress stalls, generate new hypotheses from trace differences and failure clusters rather than widening random search. Re-run finalists to estimate noise.

Keep search width proportional to independent benchmark evidence. A small suite supports a narrow hypothesis-led pilot, not broad unconstrained optimization.

## 4. Challenge and ship

Before promotion:

1. inspect traces for reward hacking and shortcut behavior
2. run the held-out slice
3. verify all required gates
4. repeat the winner from a clean state
5. compare complexity, latency, and cost with the baseline

Then use Evo's ship phase to distill the winning mechanism into the smallest reviewable diff. Re-run the full frozen benchmark after distillation. Evo ship stops at a review-ready candidate; it never merges, deploys, or changes an active runtime.

Require a named release reviewer and rollback owner. Use `$introspection` to deploy through the normal Git release path and validate fresh production tasks. If live evidence creates a new failure class, save it as an eval and begin a new loop; do not silently change the active benchmark.
