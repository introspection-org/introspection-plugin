# Evaluation design

## Analyze failures from traces

Find the earliest observable divergence from a successful run. Useful emergent categories often include misunderstanding, planning, capability selection, execution, recovery, evidence, and final communication. Use categories only after seeing examples.

Pair targeted incident review with a random sample. Otherwise the suite can overfit dramatic failures and miss the actual production distribution.

## Define quality with domain owners

Ask users to compare varied concrete outputs and explain what worked or failed. Capture the input, expected behavior, variation tags, source, and approval status for each case. A generated or imported case is a proposal until a responsible domain owner verifies it.

Vary personas, channels, input completeness, languages, capability paths, refusals, and edge cases that occur in the real job. Prefer several meaningfully different cases over rewordings of one incident.

## Leave an evaluation brief

Record:

- behavior and user outcome being measured
- source and owner of the requirement
- representative cases with provenance and approval status
- expected behavior, required evidence, and unacceptable shortcuts
- chosen evaluation layer and why lower layers are insufficient
- baseline result and known measurement noise
- uncovered risks, disputed policy, and other limitations
- current readiness level and the next proof needed

This is a reasoning artifact, not a replacement for current test, task, or judge schemas.

## Prefer outcome evidence

Do not require one ideal trajectory when several valid approaches exist. Check stable intermediate invariants only when they are part of the real contract. Exact checks should run before expensive semantic checks.

## Validate judges like classifiers

Label a training set for prompt development, a development set for threshold and wording changes, and a held-out test set for final trust. Include hard negatives and near-boundary cases. Track true-positive and true-negative behavior separately; one aggregate accuracy can conceal a useless judge.

Review disagreements between judge and human labels. If the policy itself is ambiguous, resolve the policy before tuning the judge.

## Interpret repeated attempts

Use pass@k to ask whether at least one of several attempts succeeds. Use pass^k to ask whether all repeated attempts succeed. The first reflects reach; the second reflects reliability. Report the attempt count and sampling conditions with either metric.

## Watch suite health

Warning signs include:

- most cases always pass or always fail
- one fixture dominates the score
- score improves while traces look worse
- judge changes are bundled with agent changes
- the suite contains only remembered regressions
- environment failures are counted as agent failures
- repeated runs vary more than candidate differences

When the suite is unhealthy, repair it and re-baseline before making comparative claims.

## Decide whether optimization is warranted

Do not optimize merely because an eval suite exists. Require:

- a stable agent contract
- approved and representative cases
- reliable execution and grading
- an unchanged baseline with known noise
- meaningful failures and score headroom
- protected evaluation files and gates
- a bounded change surface and research budget

If one localized improvement addresses the evidence, implement and validate that first. Repeated search is an advanced escalation, not the default repair loop.
