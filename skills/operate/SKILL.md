---
name: operate
description: Operate a live Introspection project and answer questions about it — inspect tasks, conversations, observations, patterns, metrics, runtimes, bindings, and keys, and change platform state that is not a recipe change, including judge enablement and sampling, experiments, credentials, and cancelling work. Use when the user asks what a task, status, or completion reason means, why work is queued, stuck, or cancelled, how often something happens or what it costs, how an application should authenticate to and call a runtime, or asks to enable, disable, sample, rotate, revoke, cancel, or list a live platform resource.
---

# Operate

Answer questions about a live Introspection project and change the platform state the request actually calls for. This workflow ends in an answer or a changed live resource, not in a changed recipe.

## Load capabilities

Load only the local capability modules the request reaches:

- [Introspection](../../capabilities/introspection.md) for the CLI surface, project and runtime identity, task and conversation evidence, aggregate telemetry, judge operation, links, and platform development chat. This is the primary module for this workflow.
- [Evals](../../capabilities/evals.md) when a judge result, calibration claim, or measurement question has to be interpreted rather than merely read.
- [Recipes](../../capabilities/recipes.md) only when a live resource has to be traced back to what the package declares, such as which judge or capability a runtime version carries.

When one module routes to another, load the named module before acting at that boundary. Resolve the CLI only when the first read or change needs it.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Know which workflow owns the request

The test is what the request ends in:

- An answer, or a live resource that changed without the recipe changing — **this workflow**.
- A change to which version an environment resolves to, including rollback, repinning, withdrawal, and restoration — `$introspection:deploy`.
- A change to how the agent behaves, landed through the repository — `$introspection:improve`.
- A new recipe, or an existing agent ported into one — `$introspection:create` and `$introspection:migrate`.

Bindings are the one resource both this workflow and `$introspection:deploy` touch, and the same test settles it: configuring bindings so a version can serve an environment is part of deploying, while inspecting or correcting a binding on a runtime that is already serving is ordinary operation.

Route rather than refuse, and say which workflow you are handing to. An investigation that starts here and turns out to need a behavior change is an ordinary handoff to `$introspection:improve`, not a failure of this one. When live traffic is affected and the remedy is moving what an environment resolves to, hand to `$introspection:deploy` before continuing.

Judge definition and calibration are repository work owned by `$introspection:improve`; a judge's live state — on or off, and how much traffic it grades — is owned here. Do not report an operational judge change as an unsupported boundary.

## Read before you change

Resolve the project and the exact resource before acting on it. Preserve runtime-group slugs, runtime IDs, runtime-version IDs, task IDs, and conversation IDs as distinct identifier types, and carry the canonical value returned by inventory into each later command.

Confirm which project a command acts on rather than assuming the one selected at login. Read-only inspection needs no approval; gather it before asking anything.

## Diagnose from the task row outward

A task is a durable execution, not a blocking call. Start every task question at the task row itself, not at the conversation:

- A terminal status is not a result. Read why the task ended: a completed task reports its completion reason, and one torn down by the idle window completes having produced nothing.
- A failed task carries its reason too, including failures that happen before the agent ever runs — an unresolved binding, an expired or missing credential, or a runtime that cannot serve.
- A task that failed before its agent ran has no conversation, so retrieving one returns not-found. That absence is evidence about when the failure happened, not a dead end.
- A task queued on organization concurrency is waiting, not wedged. It proceeds, is cancelled, or is collected once it exceeds the queue-wait budget. Retrying only lengthens the queue.

Only once the task row is exhausted does conversation evidence become the right place to look. Never abandon a task you started without cancelling it, and treat one awaiting input as live work.

## Answer prevalence with the aggregate surface

Individual evidence and population shape have different surfaces. Read typed events for the canonical event families, and use the aggregate telemetry surface for how often, how many, and how much — including model and token usage. Use it before calling a pattern common or rare rather than estimating from a handful of inspected conversations.

Its query is a document the CLI forwards unchanged, so focused help describes only how to submit it, not which views, metrics, dimensions, or filters exist. Read the grammar from the documented source rather than inferring a query shape from help.

A zero count from asynchronous analysis is not proof that nothing is wrong; verify analysis status and raw evidence.

## Change live state deliberately

A read is free; a change to live state is not. Before changing anything, state the resource, the current value, the intended value, and who or what it affects. Then make the change and confirm the resulting state by reading it back rather than inferring it from command output.

Treat these as production-affecting and name the effect before acting:

- Judge enablement and sampling change what is measured and what it costs.
- Starting or stopping an experiment changes what live traffic receives.
- Rotating or revoking a credential can break a caller that is still using it. Rotation is not revocation; establish which one the user means.
- Cancelling a task ends work that may be partially complete.

Ask for confirmation before a change whose blast radius the user has not already accepted. An explicit instruction to make a specific change is that acceptance; a question about state is not.

## Support integration work

Operating a runtime and building on one are different jobs with different surfaces. When the request moves from managing a runtime to writing application code that calls one, load the `integration-surface` reference; it owns that boundary along with durable files, shares, conversation forks, and end-user memory. Load `runtime-auth` when the product needs more than a trusted backend calling on its own behalf.

Shelling out to the operator CLI from product code is the mirror image of operating the platform through an SDK. Never treat the CLI-only rule for operator actions as a reason to refuse an integration.

## Hand off

Report what you inspected, what it means, and what changed, with the identifiers and evidence behind each claim. Preserve and present every actionable URL the CLI returned, labelled by destination. Name anything you could not determine and what evidence would settle it.

When the finding calls for another workflow, say which one and why. Use `/introspection:` in Claude Code and `$introspection:` in Codex.

## Firm boundaries

- Do not change a live resource before resolving its exact identity and current state.
- Do not treat a terminal task status as a result, or report a smoke test or verification as passing from status alone.
- Do not fabricate evidence, counts, statuses, or causes when access is unavailable. State what remains unverified and what you would gather.
- Do not edit recipe files, commit, push, or open a pull request in this workflow; hand behavior changes to `$introspection:improve`.
- Do not create runtimes or runtime versions, change what an environment resolves to, or withdraw, restore, or delete a version; hand those to `$introspection:deploy`.
- Do not read or expose credential contents. Operate on credentials by reference.
- Do not substitute the dashboard, browser automation, a direct API call, or database access for an operator action the CLI owns; expose the gap instead.
