# Autoresearch design

## Benchmark contract

Define the score, optimization direction, baseline, expected noise, and minimum meaningful change. Pair the score with at least one required gate that fails on a real baseline example; a gate that never fires is decorative.

Hold back examples that influence neither hypothesis generation nor candidate selection. Use them only for promotion.

## Evidence separation

Separate diagnosis from candidate authoring. Diagnosis may inspect raw cases, traces, and expected behavior. Candidate authors should receive generalized failure patterns with case identifiers, verbatim answers, and test fingerprints removed. Enforce access boundaries structurally where practical.

This safeguard complements held-out promotion; it does not replace representative coverage or human-approved criteria.

## Goodhart review

Before optimization, ask:

- Can a candidate raise the score without improving the user outcome?
- Can it exploit fixture names, verifier assumptions, judge wording, or repeated examples?
- Is latency, cost, verbosity, or refusal behavior missing from the objective?
- Does the score reward one trajectory when several are valid?

Freeze benchmark files during comparison.

## Hypothesis ledger

For each candidate record:

- hypothesis and mechanism
- parent candidate
- exact allowed edit surface
- expected affected cases
- result and uncertainty
- trace or diff pointer
- decision: reject, refine, combine, or promote

Negative results are part of the search history. Read them before proposing nearby ideas.

## Experiment width

Concurrency is limited by the scarcest shared resource, not the number of available workers. Account for model quotas, containers, ports, memory, and benchmark throughput. Isolate candidate worktrees and output directories.

## Promotion

A winner must beat baseline beyond expected noise, pass all gates, survive held-out cases, and reproduce from a clean state. Prefer the simpler candidate when gains are indistinguishable. Distill away incidental edits and rerun after distillation.

Stop when the budget is exhausted, improvement stalls across distinct mechanisms, the benchmark is shown invalid, or a boundary must change. A boundary change starts a new research contract.
