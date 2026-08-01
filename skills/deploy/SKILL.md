---
name: deploy
description: Deploy a locally proven Introspection recipe and verify the runtime it resolves to, in staging and then in production, including the environment-scoped bindings each lane needs, and recover a deployed version that is causing harm. Use when the user asks to deploy, publish, stage, promote, release, configure bindings for, or create a runtime for an agent recipe; or to roll back, repin, withdraw, restore, or otherwise recover a deployed version. Bindings a version needs before it can serve an environment belong here; correcting a binding on a runtime that is already serving is operate.
---

# Deploy

Deploy the locally proven recipe identified by the request. Resolve the actual package and platform identity instead of assuming the current directory or a passing check points to the right thing.

## Load capabilities

Load only the local capability modules the deployment reaches:

- [Recipes](../../capabilities/recipes.md) for package identity, validation, and deployment declarations.
- [Introspection](../../capabilities/introspection.md) for CLI, project, runtime, environment, evidence, and release operations.
- [Pi](../../capabilities/pi.md) when local harness execution or Pi-specific configuration must be resolved.
- [Evals](../../capabilities/evals.md) when readiness or verification relies on behavioral measurement rather than existing approved proof.
- [Harbor](../../capabilities/harbor.md) only when the Evals capability selects an environment-level suite or deployment must interpret existing Harbor evidence.

When one module routes to another, load the named module before acting at that boundary. Resolve each CLI only when the approved deployment step first needs it.

Load the `common-failures` reference before starting: it lists, by lifecycle stage, the mistakes that are actually made here — including why a working staging lane proves nothing about production.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Think in provenance and lifecycle

Deployment is a proof problem: establish which recipe, repository, commit, project, runtime group, version, bindings, and environments will be affected. A passing recipe check is necessary but not sufficient. The deployed task must resolve to the intended immutable Git commit and produce representative behavior in every environment lane it will serve.

Staging is pinned directly; production moves when the configured branch merges. Deployment therefore does not end at staging, and it is not finished because a version exists.

Changing that pin is an ordinary operation rather than only an incident response. Freezing staging on a chosen version, following a branch instead, or restoring the moving pin all use the one mechanism the `runtime-recovery` reference describes; load it for the routine case too, not just when a version is suspected of causing harm.

Reuse the existing runtime lifecycle. A matching runtime group is not a reason to create another one, and an ambiguous identity is not permission to guess.

## Establish readiness

Confirm local evidence in proportion to the agent's risk. For a newly created agent, use its approved acceptance set and retained local proof. For a migrated or improved agent, use the parity or comparison evidence from that workflow. Do not invent an eval, Harbor task, or calibrated judge when the job does not require one.

A request to deploy does not guarantee there is anything to deploy. When no recipe exists yet, the work ahead is `create` from the user's outcome or `migrate` from an existing implementation, and deployment resumes once that produces a locally proven package. Say so and continue there rather than scaffolding a recipe under a deployment brief that never proposed one.

Read the current deployment and connection workflows routed through the `introspection-docs` source, then confirm exact operations with focused installed CLI help. If documentation and help disagree, resolve the installed version and upgrade path rather than guessing.

Separate repository setup from login and repository access. Local Git work, creating or reusing the remote repository, and pushing do not require Introspection login. When the CLI reports a valid logged-in identity with the required project scopes, continue without asking the user to inspect or confirm GitHub App state. Use the documented browser or device authorization handoff only when the user is logged out or login explicitly requires it. If a supported repository operation returns an access error, report that concrete failure and its documented recovery path; do not manufacture a speculative preflight, use a mutation as an authorization probe, inspect stored credentials, or call an undocumented API.

Without changing anything, resolve CLI version and login identity, project and scopes, Git remote and status, recipe package root, `.introspection` manifest, and intended diff. Inspect `.introspection/` explicitly, including hidden files; never infer that a manifest is absent from a generic repository listing. When multiple manifests exist, resolve the requested recipe before choosing one and do not replace or create a manifest while identity remains ambiguous.

Resolve the manifest's model-access mode as part of this preflight, not after a runtime exists. It decides whether the runtime reaches models through the managed provider gateway or your own provider account, and bring-your-own-key needs its LLM endpoint binding present in every environment that will serve traffic. Treat a scaffolded value as inherited input: confirm the intended mode with the user before the first version, and name it in the execution brief alongside the environments it affects.

Run the Introspection CLI's `check` verb against the exact resolved manifest, which is the single recipe validation surface. A rejected or malformed invocation is not a recipe-check result: read the focused installed help and retry the read-only validation before proposing repair or deployment. Identify missing or invalid configuration, but do not repair it yet.

## Resolve runtime identity

Query runtime groups and versions before proposing a deployment. Match repository identity, manifest, package location, and any other canonical identifiers supported by the current CLI. Preserve runtime-group slugs, runtime IDs, runtime-version IDs, task IDs, and conversation IDs as distinct values and carry the exact identifier returned by inventory or creation into each later command.

If a runtime group already represents the recipe, use its candidate-version flow. For a genuinely new first runtime, follow the documented clean-main bootstrap and make clear that its first version activates for both production and staging. Requery the same identity immediately before creation so concurrent work cannot produce a duplicate.

Treat first-runtime registration and environment readiness as separate milestones. Offer to create a new runtime even when a declared remote MCP server, endpoint, or credential is not ready, especially when the recipe and MCP server are being developed together. Record the missing bindings and explain that registration makes the runtime available for development but does not prove staging or production readiness. Do not require placeholder endpoints or credentials.

If no suitable remote exists, propose creating the GitHub repository as part of the deployment mutation, naming its owner, repository name, and visibility. Reuse an appropriate existing remote instead of creating a duplicate. A missing remote is setup work, not a reason to stop before alignment.

## Align with the user

Explain the resolved target and provenance, local readiness, recipe-check result, proposed Git or configuration work, runtime lifecycle, environment effects, and verification plan. Make material side effects and uncertainty unmistakable, but choose the clearest natural presentation rather than a fixed deployment brief. This execution brief is informational when every operation remains within the user's deploy request; do not turn it into a permission gate by default.

Treat an explicit deploy request as authorization for routine in-scope deployment work. Without asking again, perform:

- focused recipe or runtime configuration edits
- commits and pushes
- runtime registration or candidate version creation
- staging binding changes and staging selection
- verification

Satisfy supported CLI confirmation gates non-interactively for these; the operation is already authorized.

Stop and obtain an explicit decision only when work reaches a materially new external, destructive, or user-owned choice:

- creating a repository whose owner, name, or visibility was not specified
- changing the resolved target
- expanding the affected environments
- merging to production

Explain what first-runtime creation or an eventual merge activates before performing that in-scope operation, but do not ask for redundant approval. When bindings are unresolved, name them, identify which environment lanes cannot yet be exercised, and offer the development-only bootstrap explicitly.

Never infer approval, refusal, or decline from scenario wording, an expected outcome, silence, or a missing response; report a decline only after the user explicitly refuses a decision that was actually presented.

## Deploy and verify

Make the in-scope manifest or configuration changes and rerun the recipe check. Commit them, create a remote only after any required owner, name, and visibility decision, and push the intended commit. Do not create or update a runtime until the recipe is correctly configured and its applicable local proof still holds. Requery before first-runtime creation and prefer any supported idempotency or uniqueness mechanism.

For a new runtime whose remote MCP binding is not ready, registration may be the approved stopping point for deployment. Hand development back to `introspection dev --mcp NAME=URL` so the declared MCP server can resolve to the local process while the command remains attached. Do not use `--check-bindings` as a prerequisite for this loop; it intentionally turns missing required bindings into a failing readiness check. Do not claim staging or production verification from development evidence.

Keep creation, activation, deployment, and verification distinct. A runtime or version is **created** when it exists, **active** when an environment resolves to it, **deployed** when the intended version is selected in that environment, and **verified** only after representative behavior and provenance are proven. Creation output, inventory, activation state, or task status alone cannot establish verification. If a lane cannot be exercised, report it as active or deployed but unverified and name the missing evidence.

When the bindings required by staging are available, configure the in-scope staging bindings, select the candidate for staging, and run a representative task through the runtime-group slug so the smoke test exercises staging resolution. Follow the task to completion, retrieve its exact conversation ID, and inspect the complete conversation. A completed status is not a passing smoke test: read the task row's reason for ending, since a task torn down by the idle window also reports completed while having produced nothing. If the task failed before its agent ran there is no conversation to retrieve, and the task row's own failure reason — not a missing conversation — is the evidence. Before claiming verification, prove that the intended pushed Git HEAD, the selected runtime-version SHA, and the task-resolved runtime SHA are identical.

Use an API key scoped to the environment under test; the credential is what selects the environment, so a staging key cannot verify production. Load the `runtime-auth` reference when the product needs more than a trusted backend calling on its own behalf. A move to a service-account application, an identity provider, or federation is an integration decision the user makes rather than a deployment step — hand it to `operate`, which owns that boundary, instead of stopping.

## Carry both environments

Bindings are environment-scoped. Configuring them so a version can serve an environment is part of deploying and belongs here; inspecting or correcting a binding on a runtime that is already serving is ordinary operation and belongs to `operate`. A configured development or staging endpoint, variable, or credential does not configure production. A first-runtime bootstrap may register a version while bindings are unresolved, but it is not production-ready and must not be presented or exercised as such. Resolve the applicable rows for every environment the recipe will serve, and configure the missing production ones before directing production traffic or before a later merge activates a new version.

Merging is the user's release decision, so do not merge to make production move. Explain what the merge will activate, which production bindings are in place, and what remains unresolved.

After the user merges, verify production the same way staging was verified: run a representative task through the stable runtime-group slug, confirm that the merged Git HEAD, selected runtime-version SHA, and task-resolved runtime SHA are identical, and inspect the complete conversation. A created or active production version is not a verified one.

## Recover when a version goes wrong

This workflow owns recovery for any deployed version, not only one it deployed itself. An incident that arrives cold — no prior deployment in this session — is in scope, and so is one handed over mid-investigation by `improve`. Resolve the runtime identity the same way any deployment does, then load the `runtime-recovery` reference before acting on a suspected bad version; it owns the choice between repinning, withdrawing, restoring, and deleting.

Confirm the version is the cause before withdrawing it, and never delete one while an incident is open. Recovery restores service without fixing the recipe — the commit that produced the version is still on the branch — so report the environment as recovered but not yet fixed until a corrected version is verified the way any deployment is.

## Hand off

Report the deployed identity, active commit per environment, runtime and task evidence, material environment effects, remaining readiness gaps, and anything the current CLI could not perform. Include the resolved runtime dashboard URL and each task or conversation URL used as verification evidence. After a recovery, say which environment is serving what now and what remains unfixed.

A verified deployment is where the agent starts producing evidence rather than where the work ends. From here, live tasks, conversations, and costs are read through `operate`, and what that evidence shows about the agent's behavior is acted on through `improve`, which lands the next version back through this workflow.

## Firm boundaries

- Do not perform work outside the user's deploy request without obtaining the material decision that expands its scope.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not deploy an ambiguous recipe, repository, commit, project, or runtime identity.
- Do not create a duplicate runtime group or invent an unsupported update path.
- Do not accept a scaffolded model-access mode as the user's decision, or deploy bring-your-own-key without its LLM endpoint binding present in each serving environment.
- Do not delete a runtime version to recover from an incident, and do not withdraw a version before confirming it is the cause.
- Do not merge to production for the user; the merge is their release decision.
- Do not make first-runtime registration depend on a remote MCP endpoint or credential when the user approves a development-only bootstrap. Keep every affected lane's readiness gap explicit.
- Do not direct production traffic to, or claim production readiness for, a runtime with unresolved required production bindings. Configure them before a later merge activates a new version.
- Do not create a GitHub repository without approval of its owner, name, and visibility, or when an appropriate remote already exists.
- Do not block a valid logged-in user on speculative GitHub App confirmation; surface repository access failures only from supported operations.
- Do not change judge state, experiments, credentials, application identity, or task lifecycle in this workflow; hand them to `operate` rather than performing them under a deployment brief that never named their blast radius.
- Do not substitute another platform interface when a required operation is unavailable through the current CLI; expose the gap.
