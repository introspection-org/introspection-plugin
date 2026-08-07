---
name: operate
description: Operate a live Introspection project and answer questions about it — inspect tasks, conversations, observations, patterns, metrics, runtimes, bindings, and keys, and change platform state that is not an agent recipe change, including judge enablement and sampling, experiments, credentials, bindings on an already-serving runtime, and cancelling work. Use when the user asks what a task, status, or completion reason means, why work is queued, stuck, or cancelled, how often something happens or what it costs, how an application should authenticate to and call a runtime, or asks to enable, disable, sample, rotate, revoke, cancel, or list a live platform resource. Also use for organization-level work the CLI does not own, where the job is to guide the user through the dashboard — adding or removing a teammate, changing a role, connecting GitHub, Linear, or Slack, or checking plan, usage, and billing. A task that is queued, cancelled, or failing mechanically belongs here; an agent whose answers are poor is improve.
---

# Operate

Answer questions about a live Introspection project and change the platform state the request actually calls for. This workflow ends in an answer or a changed live resource, not in a changed recipe.

## Standing rules

Read the [standing boundaries](../../BOUNDARIES.md) and the [reference loading contract](../../CONTRACT.md) before acting. Boundaries hold in every workflow; the contract governs how the index is fetched, how a step id resolves to the content that step needs, how `degradation` is honored when a fetch fails, and the version floor below which this plugin must stop.

Sections below name a step id. Look it up in the index's `steps` map on entering the step and load what it lists. Before the first CLI command, whichever section reaches it first, that step is `*/setup`. The index also carries entries no step routes; match `load_when` against the work rather than assuming the set is what this skill mentions.

## Know which workflow owns the request

The test is what the request ends in:

- An answer, or a live resource that changed without the recipe changing — **this workflow**.
- A change to which version an environment resolves to, including rollback, repinning, withdrawal, and restoration — `deploy`.
- A change to how the agent behaves, landed through the repository — `improve`.
- A new recipe, or an existing agent ported into one — `create` and `migrate`.

Bindings are the one resource both this workflow and `deploy` touch, and the same test settles it: configuring bindings so a version can serve an environment is part of deploying, while inspecting or correcting a binding on a runtime that is already serving is ordinary operation.

Route rather than refuse, and say which workflow you are handing to. An investigation that starts here and turns out to need a behavior change is an ordinary handoff to `improve`, not a failure of this one. When live traffic is affected and the remedy is moving what an environment resolves to, hand to `deploy` before continuing.

Judge definition and calibration are repository work owned by `improve`; a judge's live state — on or off, and how much traffic it grades — is owned here. Do not report an operational judge change as an unsupported boundary.

## Read before you change

Resolve the project and the exact resource before acting on it. Preserve runtime-group slugs, runtime IDs, runtime-version IDs, task IDs, and conversation IDs as distinct identifier types, and carry the canonical value returned by inventory into each later command.

Confirm which project a command acts on rather than assuming the one selected at login. Read-only inspection needs no approval; gather it before asking anything.

When the question is who changed something, or what changed and when, the answer is the audit log rather than the resource's own row — read the `security` page of the `introspection-docs` source. Pair it with the resource's own lineage when you need both who and what.

## Diagnose from the task row outward

Step `operate/read-evidence`.

A task is a durable execution, not a blocking call. Start every task question at the task row itself, not at the conversation. The `tasks-and-runs` page of the `introspection-docs` source carries the full lifecycle — every status, the queue's exits, and the completion and failure reasons — and `conversations` carries what the record does and does not contain. Read them rather than inferring a status's meaning. Four things decide where to look:

- A terminal status is not a result. Read why the task ended: a completed task reports its completion reason, and one torn down by the idle window completes having produced nothing.
- A failed task carries its reason too, including failures that happen before the agent ever runs — an unresolved binding, an expired or missing credential, or a runtime that cannot serve.
- A task that failed before its agent ran has no conversation, so retrieving one returns not-found. That absence is evidence about when the failure happened, not a dead end.
- A task queued on organization concurrency is waiting, not wedged. It proceeds, is cancelled, or is collected once it exceeds the queue-wait budget. Retrying only lengthens the queue.

Only once the task row is exhausted does conversation evidence become the right place to look. Never abandon a task you started without cancelling it, and treat one awaiting input as live work.

A conversation reports failure in more than one way, and the surfaces disagree: a conversation whose model calls all succeeded but whose tool calls did not still reads as successful in a list. Load the `conversation-evidence` reference before concluding a conversation went well, and before selecting conversations as calibration fixtures.

## Answer prevalence with the aggregate surface

Step `operate/prevalence`.

Individual evidence and population shape have different surfaces. Read typed events for the canonical event families, and use the aggregate telemetry surface for how often, how many, and how much — including model and token usage. Use it before calling a pattern common or rare rather than estimating from a handful of inspected conversations.

Its query is a document the CLI forwards unchanged, so focused help describes only how to submit it and never names a field. Load the `metrics-query` reference for the views and field names rather than inferring a query shape from help.

A zero count from asynchronous analysis is not proof that nothing is wrong; verify analysis status and raw evidence.

## Change live state deliberately

Step `operate/change-live`.

A read is free; a change to live state is not. Before changing anything, state the resource, the current value, the intended value, and who or what it affects. Then make the change and confirm the resulting state by reading it back rather than inferring it from command output.

Treat these as production-affecting and name the effect before acting:

- Judge enablement and sampling change what is measured and what it costs — the `judges` page of the `introspection-docs` source carries the split between the Git-owned definition and these platform-owned settings.
- Starting or stopping an experiment changes what live traffic receives, and ending one does not ship its winner. Read the `experiments` page before starting or ending one.
- Rotating or revoking a credential can break a caller that is still using it. Rotation is not revocation; establish which one the user means. The `bindings` page owns how credentials and endpoints resolve.
- Stopping the current turn leaves the task running and ready for another message rather than terminating it, and work in flight may be partially complete. The CLI calls this cancelling or aborting. Draining instead lets the turn finish and then tears down the sandbox, and is an API-level choice with no CLI flag.

Ask for confirmation before a change whose blast radius the user has not already accepted. An explicit instruction to make a specific change is that acceptance; a question about state is not.

## Guide organization work to the dashboard

Step `operate/org-work`.

The CLI does everything inside a project, and it does login. Organization administration is the one place it does not reach: there is no members, organizations, plan, usage, or billing command group, so inviting a teammate, changing a role, connecting GitHub, Linear, or Slack, or anything touching plan and billing happens in the dashboard. Load the `dashboard-surface` reference when work reaches that boundary.

Guide rather than take over. Give the person the labelled link and the specific change to make, plus anything the page will ask of them that could stop them halfway — that only an owner can grant the owner role, for instance. Never send someone to a page for work the CLI owns, and never open one to gather evidence a command would give you: a command's output is inspectable and repeatable, and a scraped page is neither.

Driving the browser yourself is a last resort, only for this organization-scoped work, and only when the user asks or genuinely cannot act. Confirm before anything that spends money, changes access, or is hard to reverse, and never enter someone's credentials or move through a login, payment, or consent screen for them.

## Support integration work

Step `operate/integrate`.

Operating a runtime and building on one are different jobs with different surfaces. When the request moves from managing a runtime to writing application code that calls one, load the `integration-surface` reference; it owns that boundary along with durable files, shares, conversation forks, and end-user memory. Load `runtime-auth` when the product needs more than a trusted backend calling on its own behalf.

Shelling out to the operator CLI from product code is the mirror image of operating the platform through an SDK. Never treat the CLI-only rule for operator actions as a reason to refuse an integration.

## Hand off

Report what you inspected, what it means, and what changed, with the identifiers and evidence behind each claim. Preserve and present every actionable URL the CLI returned, labelled by destination. Name anything you could not determine and what evidence would settle it.

## Firm boundaries

- Do not change a live resource before resolving its exact identity and current state.
- Do not treat a terminal task status as a result, or report a smoke test or verification as passing from status alone.
- Do not fabricate evidence, counts, statuses, or causes when access is unavailable. State what remains unverified and what you would gather.
- Do not edit recipe files, commit, push, or open a pull request in this workflow; hand behavior changes to `improve`.
- Do not create runtimes or runtime versions, change what an environment resolves to, or withdraw, restore, or delete a version; hand those to `deploy`.
- Do not read or expose credential contents. Operate on credentials by reference.
- Do not substitute the dashboard, browser automation, a direct API call, or database access for an operator action the CLI owns; expose the gap instead.
