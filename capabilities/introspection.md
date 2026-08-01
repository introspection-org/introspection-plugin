# Introspection

Use the CLI as the only interface for **operating** Introspection: creating, inspecting, or changing runtimes, versions, environment pins, bindings, judges, experiments, keys, and the evidence behind them. Never substitute the dashboard, a browser, browser automation, a direct API call, an SDK, or database access for an operator action the CLI owns.

That rule governs operating the platform, not building on it. Application code that runs tasks for end users is an SDK integration, and shelling out to the operator CLI from a product is the mirror-image mistake. When work crosses from managing a runtime to writing code that calls one, load the `integration-surface` reference; it also owns durable files, shares, conversation forks, and end-user memory. Never treat the CLI-only rule as a reason to refuse an integration.

Keep recipe design in the [Recipes capability](recipes.md), evaluation reasoning in the [Evals capability](evals.md), and production diagnosis and fixes in `$introspection:improve`.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Route through current documentation

1. Select only the workflow matching the request: connect, deploy, run, observe, judge, experiment, or ship.
2. Open the `introspection-docs` source and read only the linked CLI workflow and concepts required for that operation.
3. Inspect repository and task context and prepare the execution brief before installing, upgrading, authenticating, or configuring the CLI.
4. Before the first invocation of an uncertain or version-sensitive command surface, confirm `introspection` exists, then run and read that command's narrow help as a separate read-only operation. Only after interpreting the result may you construct or execute the platform operation; never batch help and a speculative mutation together.
5. Use the installed CLI when it supports the required command and flags. Install it only when missing; upgrade a recognized installation only when an actual incompatibility blocks the operation. Use the documented command for its detected installation method, verify in a fresh process, and retry the blocked operation.

Current docs and compatible installed CLI output are authoritative. Do not repeat schemas or command catalogs in this module. Preserve runtime-group slugs, runtime IDs, runtime-version IDs, task IDs, and conversation IDs as distinct identifier types. Carry the canonical value returned by inventory or creation into later commands and never substitute a readable slug where focused help requires an ID. Do not configure host-side servers, host tools, or direct endpoints. Speak in terms of integrations, bindings, capabilities, recipes, runtimes, tasks, conversations, observations, patterns, judges, and experiments.

If a requested documented operation is absent from installed help, verify command resolution and compare the installed version with the official CLI package named by current Introspection documentation before declaring the operation unsupported. Resolve that package through its documented installation source; do not probe similarly named packages, unrelated package managers, repository release APIs, or source checkouts. That missing operation is an actual incompatibility, not a reason to stop at the older surface. Upgrade through the detected installation method, or use an isolated transient invocation of the exact official version when the approved workflow explicitly forbids changing the global installation. Recheck focused help in the resulting fresh process. Do not guess at flags from another source checkout.

Only once that upgrade path is exhausted does the gap become real: if the operation is still unavailable on the current official version, report it and stop at the last supported step. Do not substitute another interface. Stopping at an outdated binary you could have upgraded is not honoring this rule; it is skipping the step above.

## Return useful links

Treat user-facing URLs as part of the result of every cloud operation. Preserve and present every actionable URL the CLI returns, especially dashboard pages for resources it created or inspected and settings pages that unblock the next action. When a runtime or task URL would help but the preceding command did not return one, resolve it with `introspection open --print`, using `--runtime` or `--task` as needed. Label each link by destination; never hand-build a dashboard URL or claim a link you did not resolve. If no supported direct URL is available, say so and include the relevant official documentation link when it helps. Sharing a dashboard link does not authorize operating the dashboard.

## Develop through the platform

After a runtime exists, use `introspection dev` when the user wants to exercise uncommitted recipe changes through the platform's development chat. This complements local Pi proof; it does not replace it and does not create a deployable runtime version.

Authenticate, validate the local recipe, and run from its Git worktree. Prefer an explicit runtime slug when repository-based resolution is ambiguous. Inspect binding readiness, but do not make remote MCP endpoints or credentials a prerequisite for development: missing required and optional development bindings warn by default, while `--check-bindings` deliberately turns missing required bindings into a failing readiness check.

When a declared MCP server is still local, pass `--mcp NAME=URL`; the name must match the recipe declaration. This routes development calls to the local process while the command remains attached. It does not read local credential files or upload local secrets, so use a development binding only when that local server actually requires bound credentials. Keep the command attached while testing: it refreshes the development recipe as files change and prints a runtime preview URL that works only for the attached session.

Prove the loop with a visible recipe-specific change in a development conversation. Stopping the command ends the preview attachment; publishing still follows the normal Git and deployment flow.

## Connect and deploy

- Validate the recipe locally first.
- Confirm the intended Git state and whether this is a first bootstrap or a later candidate version.
- Bootstrap the first runtime only through the documented manifest flow. For later versions, use the immutable version created from the pull-request head; do not create another runtime group.
- For a new runtime, allow registration with unresolved remote MCP bindings when the user chooses a development-only bootstrap; record the affected lane readiness instead of inventing placeholder values.
- Configure required staging bindings before selecting and exercising the candidate through staging.
- Start a representative task through staging runtime-group resolution, follow it to completion, and confirm which exact version answered.
- Retrieve the conversation associated with that task and inspect its complete evidence bundle, not only task status.
- Join the resolved runtime to its recipe pin and verify the intended Git commit.

A task is a durable execution, not a blocking call: it can be streamed, cancelled, and resumed when the agent asks the caller something. Treat one awaiting input as live work, and never abandon a task you started without cancelling it. A task queued on organization concurrency is waiting, not wedged — it proceeds, is cancelled, or is collected once it exceeds the queue-wait budget, so retrying only lengthens the queue.

A terminal status is not a result. Read the whole task row: a completed task reports why it ended, and one torn down by the idle window completes having produced nothing. A failed task carries its reason too, including failures that happen before the agent runs. Never claim a smoke test or verification passed from a completed status alone.

A successful deployment is a proven user workflow, not merely a created runtime. Keep **created**, **active**, **deployed**, and **verified** as distinct claims. Verification requires a representative task through the environment under test, inspection of its exact complete conversation, and proof that intended pushed Git HEAD, selected runtime-version SHA, and task-resolved runtime SHA are identical. If any evidence is unavailable, report the environment as active or deployed but unverified and name the gap.

## Recover a bad version

Deployment has a recovery path, and it is not deploying again. When a live version is suspected of causing harm, load the `runtime-recovery` reference before acting; it owns the choice between repinning, withdrawal, restoration, and deletion.

Establish that the version is the cause before withdrawing it. An unresolved binding, an expired credential, a provider outage, a changed MCP endpoint, or upstream data can fail a task without the version being at fault, and withdrawing a healthy one hides the real defect.

Prefer moving what an environment resolves to over destroying a version. Pinning staging to a known-good version is the fastest reversible response there and keeps the suspect version available for investigation. Staging is the steerable lane; production follows the default branch, so recovering it means withdrawing the implicated version and correcting the branch. Withdrawal does not move traffic by itself, so confirm what each environment resolves to afterward. Deletion evicts baked images and destroys provenance that judgements and experiments depend on; never delete while an incident is open.

Recovery restores service without correcting the recipe: the commit that produced the version is still on the branch. Close the loop through the normal Git path, verify the replacement the way any deployment is verified, and until then report the environment as recovered but not yet fixed.

## Learn from production

Navigate from recurring patterns to supporting observations and then to the underlying conversations. Sample normal traffic alongside failures. A zero count from asynchronous analysis is not proof that no issue exists; verify analysis status and raw evidence.

Read individual evidence and aggregate shape with the surfaces built for each. Typed event reads return the canonical event families; the aggregate telemetry surface answers how often and how much across a population, including model and token usage. Use it before claiming a pattern is common or rare, rather than estimating prevalence from a handful of inspected conversations.

Its query is a document the CLI forwards unchanged, so focused help describes only how to submit it, not which views, metrics, dimensions, or filters exist. Read the `observations-and-patterns` page of the `introspection-docs` source, or the Data Plane API reference, for the grammar; do not infer a query shape from help.

Use the basic improvement loop:

1. Inspect the recurring pattern, supporting observations, source conversations, and random controls.
2. Find the earliest failure and classify it as environment/access, deterministic implementation, agent judgment, or disputed policy.
3. Treat feedback as evidence of a possible eval gap, not as a direct edit instruction.
4. Draft representative cases from traces, remove irrelevant sensitive details, and get domain-owner approval.
5. Use the Evals capability to add the smallest trustworthy check and establish the unchanged baseline.
6. Make one focused improvement and validate it locally and in staging.
7. Promote through the normal Git release path.
8. Verify the active commit with a fresh task, full conversation inspection, and judgement trend.

Treat business outcomes as pressure on eval coverage, not as a reward to chase directly. Form a behavior hypothesis, represent it in approved cases, and validate it offline before considering a production comparison.

## Judge and compare

A judge is an online measurement instrument, distinct from an offline eval suite. Judge definition calibration is an offline validation step against human-owned labels; judgement reads inspect its online results.

The boundary runs between definition and operational state, not between the CLI and something else. A judge's definition is Git-owned and changes through the normal release path; its live state — whether it is on, and how much production traffic it grades — is platform-owned, and the CLI is the surface for it. Enabling, disabling, and sampling are ordinary operator actions, so never report them as an unsupported boundary. Treat a sampling change as production-affecting: it changes what is measured and what it costs.

Calibrating a judge definition is separate work from changing its live state:

- Resolve the owning recipe Git worktree and judge name. Export representative fixtures, including positives, negatives, edge cases, and random controls, then persist them at `judges/<judge-name>.calibration.jsonl` beside `judges/<judge-name>.yaml`. Use temporary output only while assembling the review draft; never calibrate from a temp file that remains the sole retained copy.
- Show every fixture with its proposed label, rationale, provenance, and split to the domain owner. Pause until every label is approved or corrected; a model may propose labels but cannot establish its own ground truth.
- Confirm the fixture data is authorized for repository storage and contains no secrets. If a source conversation cannot be committed, replay an authorized sanitized conversation and export a fresh valid fixture; do not rewrite the export's protected provenance fields.
- Calibrate the exact judge definition on the human-approved development data and verify it on human-approved held-out data, passing the repository-owned calibration JSONL to `--dataset`.
- Stage the judge YAML and calibration JSONL together, inspect the Git diff, and commit both files as one focused change. If Git mutation is not authorized, request approval and stop before claiming completion.
- Promote the versioned judge and calibration data through the normal Git release path, then inspect both aggregate movement and individual disagreements.
- Prefer sequential release comparison when traffic is comparable.
- Use a live experiment only when simultaneous traffic allocation is necessary for a bounded question.

Ending an experiment does not ship its winner. Promotion happens through the repository's normal main-branch release path. After promotion, verify the active commit with a fresh task, conversation inspection, and judgement trend.
