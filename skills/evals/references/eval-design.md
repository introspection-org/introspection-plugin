# Evaluation design

Use this reference when performing error analysis, assembling datasets, validating judges, defining team ownership, or operationalizing evaluation results.

## Contents

- [Frame the system](#frame-the-system)
- [Make behavior reviewable](#make-behavior-reviewable)
- [Run error analysis](#run-error-analysis)
- [Build and prioritize the taxonomy](#build-and-prioritize-the-taxonomy)
- [Audit an existing suite](#audit-an-existing-suite)
- [Separate offline evals from online judges](#separate-offline-evals-from-online-judges)
- [Choose the evaluation layer](#choose-the-evaluation-layer)
- [Approve cases before implementation](#approve-cases-before-implementation)
- [Design deterministic verification](#design-deterministic-verification)
- [Design the dataset](#design-the-dataset)
- [Generate synthetic coverage](#generate-synthetic-coverage)
- [Write semantic judges](#write-semantic-judges)
- [Validate semantic judges](#validate-semantic-judges)
- [Define ownership](#define-ownership)
- [Operationalize the signal](#operationalize-the-signal)
- [Interpret results](#interpret-results)
- [Leave durable artifacts](#leave-durable-artifacts)
- [Methodology sources](#methodology-sources)

## Frame the system

Define the user, job, promised outcome, failure cost, permitted behavior, and downstream business outcome. Set the rigor in proportion to exposure and harm: an internal low-stakes assistant does not need the same evidence as a customer-facing or safety-critical agent.

Treat evaluation as a family of activities independent of the runner used:

- qualitative review and error analysis
- deterministic regression and integration checks
- environment-level capability tasks
- calibrated semantic evaluators
- human review
- production monitoring and experiments
- comparison with user and business outcomes

Do not reduce this family to unit tests or one aggregate score.

## Make behavior reviewable

Capture complete traces, including the user input, system and retrieved context, capability calls and results, intermediate decisions where available, final output, errors, latency, and cost. Preserve stable identifiers so feedback and downstream outcomes can be joined back to the originating trace.

Create the smallest review interface that makes the important parts easy to scan and annotate. Hide repetitive noise by default, distinguish roles and calls visually, support in-context notes, preserve reviewer progress, and keep annotations exportable. The tool should accelerate judgment, not decide quality.

Sample deliberately:

- targeted incidents and known complaints
- random normal traffic, including successes
- important cohorts, channels, languages, and capability paths
- boundary and refusal behavior
- rare high-consequence scenarios

Clustering can improve breadth, but it is an imperfect suggestion mechanism. Pair it with random sampling and explicit cohort coverage.

## Run error analysis

Start with open coding rather than an inherited rubric.

1. Read the trace in context.
2. Stop at the earliest meaningful divergence; downstream mistakes may be consequences.
3. Write a specific note that another reviewer could understand without reconstructing your memory.
4. Record why the behavior matters to the user or product.
5. Continue across traces without prematurely standardizing the notes.
6. Revisit earlier traces after discovering new patterns.

Aim for breadth across distinct failure modes and depth through multiple examples of each important mode. A commitment to roughly 100 traces can unblock a first pass, but it is not a statistical law. Stop at theoretical saturation: additional review no longer changes the actionable taxonomy. A narrow application may saturate earlier; a heterogeneous one may require stratified rounds.

Use AI to:

- inspect data shape and build a review surface
- suggest diverse samples or clusters
- organize open notes into candidate groups
- find additional instances of an accepted pattern in reviewed and unreviewed traces
- visualize progress and coverage

Keep the human in control of new failure modes and product taste. Applying an accepted pattern at scale is easier to verify than judging AI-generated taste suggestions.

## Build and prioritize the taxonomy

Use axial coding after open coding: group concrete notes into a smaller set of actionable failure modes. Refine AI-proposed categories until each describes a behavior that a team could investigate. Avoid generic buckets such as `bad quality` or categories based only on an organizational component.

Preserve:

- the original note
- its assigned failure mode
- a `none of the above` option
- representative examples and counterexamples
- the owner and version of the definition

Count occurrences to understand prevalence, then prioritize using prevalence, severity, affected users, business importance, detectability, and likely cost to fix. Common issues often concentrate in a few modes, but frequency must not erase rare catastrophic failures.

Separate:

- infrastructure and access failures
- deterministic implementation defects
- agent judgment or capability failures
- unclear or disputed product policy

Fix obvious, localized defects directly and verify them. Invest in a persistent evaluator when the behavior is recurring, hard to fix confidently, high-risk, likely to regress, or important to compare across versions.

## Audit an existing suite

Audit from evidence rather than evaluator names or test counts:

1. Map each evaluator to an observed failure mode, user promise, or hard invariant.
2. Inspect the underlying cases, expected outcomes, rationales, provenance, and cohort tags.
3. Run the unchanged baseline and classify invalid trials before interpreting scores.
4. Sample passing and failing traces from every important evaluator; verify that a pass means useful behavior and a failure identifies the intended defect.
5. Check for duplicated evaluators, uncovered high-severity modes, stale labels, data leakage, unstable environments, and judges without held-out validation.
6. Compare evaluation movements with human feedback and downstream outcomes.
7. Record keep, repair, replace, or retire decisions with an owner and next proof.

Do not preserve an evaluator merely because it already exists. Do not remove one merely because the current agent scores well; first establish whether it guards a meaningful regression.

## Separate offline evals from online judges

Use **eval** for an offline, versioned set of approved cases run during development, regression testing, or candidate comparison. Use **judge** for an online measurement instrument applied to sampled or live conversations. Judge calibration is an offline validation activity, but its purpose is to decide whether the exact judge is trustworthy enough for online use; it does not convert model outputs into ground truth.

Keep the artifacts separate. An eval owns cases, approved expected outcomes, offline run configuration, and comparison results. A judge owns a narrow online decision, a human-labeled calibration dataset, its exact prompt and model, held-out validation, deployment declaration, sampling policy, and production disagreements. Do not use either name as a generic synonym for the other.

## Choose the evaluation layer

Choose the lowest layer that faithfully represents the failure:

1. deterministic assertions for exact, inspectable outcomes
2. environment-level agent tasks for end-to-end work across files, tools, services, or multiple steps
3. human review for meaning-dependent or unresolved judgment

Keep regression and capability measurement distinct. A remembered failure proves that one case stays fixed; a varied capability set estimates how the system generalizes.

Prefer Harbor when building a new environment-level agent evaluation because it packages the instruction, environment, execution, and verifier into a reproducible task. When a project already has an evaluation framework, first map the observed failure modes into its native cases, graders, runner, and reporting. Preserve comparable history and CI wiring. Introduce Harbor only for missing fidelity, isolation, reproducibility, or grading—not merely to standardize names or commands.

Avoid generic off-the-shelf metrics unless they match an observed product-specific failure. A handful of important evaluators is often more useful than broad rubric coverage. Do not optimize for an evaluator count.

## Approve cases before implementation

Before authoring fixtures, scaffolding a task, implementing a verifier, calibrating a judge, or running a proposed suite, present a case matrix containing:

- case identifier and input or scenario
- capability, invariant, or failure mode covered
- proposed expected answer or label
- rationale and provenance
- proposed verification method
- intended development, validation, or held-out split when relevant

Mark all machine-generated answers and labels as proposed. Ask the domain owner to approve, reject, edit, or relabel every case and confirm that the set covers the intended boundaries. Pause until that approval is explicit. General authorization to improve an agent, deterministic generation, agreement between models, or a passing reference solution does not approve the cases.

Record the approver and dataset version. Reopen approval when a material case, expected outcome, label, rationale, split, or success contract changes. Do not silently replace a rejected case or move a case between splits.

## Design deterministic verification

Call a verifier deterministic only when it checks an objective product contract and produces reproducible results. Prefer structured parsing, schema and type checks, exact calculations, filesystem or database state, API side effects, compilation and executable behavior, tool outcomes, invariants, idempotency, or other durable task artifacts.

Regex, keywords, substrings, edit distance, and exact prose matching are deterministic implementations but usually semantic proxies. Use them only when the literal surface form is itself the human-approved requirement. Do not accept a brittle proxy merely because the reference answer matches it. Redesign the task to expose an inspectable outcome when possible; if meaning remains essential, retain approved human review rather than disguising semantic judgment as deterministic grading.

## Design the dataset

Store, for each example:

- input and the trace fields required to judge it
- expected behavior or label
- reviewer rationale
- failure-mode and cohort tags
- provenance, authorization, and approval status
- agent, model, prompt, environment, and product version

Build positives, negatives, near-boundary cases, and hard negatives. Balance evaluation slices enough to inspect both classes; production prevalence can be measured separately.

Separate data used to invent or revise the rubric and judge prompt from validation data used during iteration and a held-out test set used only for the final trust decision. Do not leak held-out answers into prompts, candidate changes, or synthetic-generation instructions.

Use real traces to discover taste and failure modes. Use synthetic examples to fill deliberate coverage gaps, stress boundaries, or create controlled variants, then require domain review before treating them as truth.

Version data, labels, rationales, and approvals. Criteria drift is expected: reviewers discover new requirements and reinterpret old examples as they see more behavior. Revisit earlier labels when definitions change and obtain explicit approval for every relabeled case before reuse.

Introspection judge calibration has a stricter provenance contract than a generic local dataset. Create its fixture rows with the current CLI's bounded conversation export, then add only `expected` and optional `split` at the top level. Do not rewrite the exported conversation or engine metadata, synthesize snapshot hashes, convert arbitrary trace JSON into `judge_fixture` rows, or invoke internal judge-engine protocols. For non-Introspection evidence, keep the original local evaluator or first replay the case into a real Introspection conversation that the CLI can export.

Store the approved fixture set in the owning recipe at `judges/<judge-name>.calibration.jsonl`, next to `judges/<judge-name>.yaml`, and run calibration from that canonical path. Temporary directories are acceptable only while exporting or assembling a review draft; they are not durable dataset locations. Confirm repository-storage authorization and secret hygiene before persistence. When a source conversation cannot be committed, replay an authorized sanitized case and export a new valid fixture instead of editing the protected conversation, engine, or snapshot fields.

## Generate synthetic coverage

Generate synthetic cases only from an explicit coverage plan. Define the missing failure mode, cohort, boundary, or environmental condition first; otherwise collect more real traces.

For each generation batch:

1. Supply the behavior contract, accepted examples, counterexamples, and the exact coverage gap without exposing held-out answers.
2. Generate varied inputs and contexts, not paraphrases of one seed.
3. Preserve the intended difficulty while removing accidental shortcuts and impossible requirements.
4. Deduplicate semantically, inspect distribution and cohort balance, and reject cases that do not resemble plausible use.
5. Require domain-owner review of the expected outcome and rationale.
6. Tag provenance as synthetic and keep generated cases out of held-out evaluation until independently approved.

Use controlled variants to test one factor at a time. Never let a generator label its own cases without human or deterministic verification.

## Write semantic judges

Write a judge only when an online semantic signal is required and after the failure definition and human-approved labeled examples are stable enough for another reviewer to apply. Give it:

- one narrow decision to make
- only the trace fields required for that decision
- an operational definition of pass and fail
- positive, negative, and boundary examples with rationales
- explicit rules for missing evidence and invalid input
- a constrained output contract containing the decision and concise evidence

Require the judge to cite observable evidence from the supplied trace. Prevent it from rewarding style, verbosity, or proxy features unless those are part of the product contract. Keep agent identity, candidate name, and expected answer hidden when they are unnecessary and could bias the decision.

Use deterministic parsing for judge output. Treat missing fields, malformed output, execution errors, and insufficient context as invalid measurements. Keep the prompt, examples, output schema, model, and decoding configuration versioned together.

## Validate semantic judges

Make each judge answer one narrow question. Prefer a clear binary operational decision. If graded severity is truly required, define what each level changes operationally rather than relying on vague numerical quality.

Before calibration, show every fixture, proposed label, rationale, provenance, and split to the domain owner. Do not let the model that proposes or generates a case establish its authoritative label. Calibrate the exact judge prompt and model only against explicitly approved domain-expert labels. Record rationales for labels and judge disagreements. Examine:

- true-positive rate: how often real failures are caught
- true-negative rate: how often acceptable cases pass
- false positives: acceptable behavior incorrectly blocked
- false negatives: failures incorrectly accepted

Do not trust overall agreement alone. On an imbalanced dataset, a judge can appear accurate by always predicting the majority class.

Inspect every disagreement in a small calibration set. Improve the failure definition, examples, or prompt when the human policy is clear. Escalate to the quality owner when it is not. If knowledgeable humans cannot apply the rubric consistently, clarify the policy before tuning the judge.

Set acceptance thresholds from the cost of each error type. A release gate may demand extremely low false negatives for a dangerous behavior, while a monitoring signal may tolerate more noise. Freeze the validated model with the prompt; changing the judge model requires revalidation.

Treat judge execution errors, malformed outputs, and missing context as invalid measurements rather than passes or agent failures.

After calibration, stage `judges/<judge-name>.yaml` and `judges/<judge-name>.calibration.jsonl` together, inspect the Git diff for both files, and commit them as one focused measurement change. A calibration result backed only by an untracked or temporary dataset is not a durable artifact and is not ready for recipe promotion.

## Define ownership

Assign responsibilities by expertise rather than title:

- A domain expert or product owner defines quality, labels examples, and resolves ambiguous cases.
- An engineer makes traces accessible, implements the harness, prevents leakage, and owns execution reliability.
- Both inspect disagreements, connect measurements to product changes, and sign off on deployment use.

Prefer one benevolent dictator for the active quality contract when possible: the person with the strongest domain context and authority to decide. Multiple annotators are useful for surfacing ambiguous policy or auditing a mature rubric, but forced consensus on every early example creates cost without creating taste.

Decide explicitly:

- how much labeled evidence is enough for the intended decision
- who breaks ties between a judge and a human label
- who investigates when eval and business outcomes diverge
- who can change the rubric, thresholds, or held-out set

## Operationalize the signal

Reuse a validated evaluator across:

- local iteration and candidate comparison
- CI regression gates
- sampled production monitoring
- release or experiment analysis

Keep the benchmark contract fixed during comparisons. Record evaluator version, judge model, task or dataset version, agent configuration, attempts, raw traces, and environmental failures.

Choose production sample size by cohort coverage and observed variance. Increase or stratify the sample when daily results are unstable or omit important segments. Recalibrate if the production distribution, product contract, or judge model changes.

Link eval metrics, human feedback, and business outcomes at the trace or cohort level. Production monitoring should reveal prevalence and drift; it does not eliminate ongoing human review.

## Interpret results

Pair every aggregate movement with trace inspection. Ask:

- Which cases changed?
- Did the intended failure mode improve?
- Did another cohort or behavior regress?
- Is the movement larger than repeated-run noise?
- Did latency, cost, refusal behavior, or user outcomes worsen?

Use pass@k for reach: whether at least one of several attempts succeeds. Use pass^k for reliability: whether every attempt succeeds. Report attempt count and sampling conditions.

If eval improves while human or business outcomes worsen, do not optimize harder against the metric. Investigate missing cohorts, proxy mismatch, label drift, judge errors, and delayed outcomes. Business outcomes create pressure to inspect and revise evaluation coverage; they are not direct labels for a single trace.

## Leave durable artifacts

Maintain an evaluation brief containing:

- behavior and user outcome being measured
- source and owner of the requirement
- observed failure modes with prevalence and severity
- representative cases, provenance, and approval status
- selected evaluation layer and why lower layers are insufficient
- dataset splits and leakage controls
- judge validation results by error type
- unchanged baseline and measurement noise
- known gaps, disputed policy, and uncovered cohorts
- current readiness and next proof required

Maintain the failure taxonomy, labeled examples with rationales, evaluator definitions, validation reports, run history, and decision log as versioned product artifacts. The process of creating them is part of the value: it turns implicit taste into an executable, evolving product contract.

## Methodology sources

This synthesis draws from these talks and their caption transcripts:

- [Why AI evals are the hottest new skill for product builders](https://www.youtube.com/watch?v=BsWxPI9UM4c)
- [How Engineers and PMs should collaborate on Evals](https://www.youtube.com/watch?v=XueTa4qrMpg)
- [How To Build AI Evals](https://www.youtube.com/watch?v=mF4CaijvJos)
- [How to Automate AI Evals (Correctly)](https://www.youtube.com/watch?v=tqUDjc1HzO4)
