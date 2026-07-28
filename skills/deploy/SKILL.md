---
name: deploy
description: Deploy a locally proven Introspection recipe and verify the runtime it resolves to, in staging and then in production, including the environment-scoped bindings each lane needs. Use when the user asks to deploy, publish, stage, promote, release, configure bindings for, or create a runtime for an agent recipe, or invokes deploy.
---

# Deploy

Deploy the locally proven recipe identified by the request. Resolve the actual package and platform identity instead of assuming the current directory or a passing check points to the right thing.

Load and follow `$introspection:pi`, `$introspection:recipes`, `$introspection:evals`, and `$introspection:introspection`. Resolve each CLI only when the approved deployment step first needs it.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Think in provenance and lifecycle

Deployment is a proof problem: establish which recipe, repository, commit, project, runtime group, version, bindings, and environments will be affected. A passing recipe check is necessary but not sufficient. The deployed task must resolve to the intended immutable Git commit and produce representative behavior in every environment lane it will serve.

Staging is pinned directly; production moves when the configured branch merges. Deployment therefore does not end at staging, and it is not finished because a version exists.

Reuse the existing runtime lifecycle. A matching runtime group is not a reason to create another one, and an ambiguous identity is not permission to guess.

## Establish readiness

Confirm local evidence in proportion to the agent's risk. For a newly created agent, use its approved acceptance set and retained local proof. For a migrated or improved agent, use the parity or comparison evidence from that workflow. Do not invent an eval, Harbor task, or calibrated judge when the job does not require one.

Read the current deployment and connection workflows routed through the `introspection-docs` source, then confirm exact operations with focused installed CLI help. If documentation and help disagree, resolve the installed version and upgrade path rather than guessing.

Separate repository setup from GitHub App access. Local Git work, creating or reusing the remote repository, and pushing do not require the App. When the target repository is new to the intended Introspection project, direct the user to the organization Integrations page identified by the current connection documentation after the remote exists, and require confirmation that the App can access it only before first runtime registration. An existing runtime in that project backed by the same repository satisfies this requirement unless access is known to have changed or been revoked. Continue independent deployment work while waiting. Do not use `runtimes create` or another mutation as an authorization probe, inspect stored credentials, or call an undocumented API to manufacture a preflight. If the target repository changes before deployment, repeat the confirmation.

Without changing anything, resolve CLI version and login identity, project and scopes, Git remote and status, recipe package root, `.introspection` manifest, and intended diff. Run the Introspection CLI's `check` verb, which is the single recipe validation surface. Identify missing or invalid configuration, but do not repair it yet.

## Resolve runtime identity

Query runtime groups and versions before proposing a deployment. Match repository identity, manifest, package location, and any other canonical identifiers supported by the current CLI.

If a runtime group already represents the recipe, use its candidate-version flow. For a genuinely new first runtime, follow the documented clean-main bootstrap and make clear that its first version activates for both production and staging. Requery the same identity immediately before creation so concurrent work cannot produce a duplicate.

If no suitable remote exists, propose creating the GitHub repository as part of the deployment mutation, naming its owner, repository name, and visibility. Reuse an appropriate existing remote instead of creating a duplicate. A missing remote is setup work, not a reason to stop before alignment.

## Align with the user

Explain the resolved target and provenance, local readiness, recipe-check result, proposed Git or configuration work, runtime lifecycle, environment effects, and verification plan. Make material side effects and uncertainty unmistakable, but choose the clearest natural presentation rather than a fixed deployment brief.

Ask for explicit confirmation covering the complete proposed mutation: configuration edits, repository creation with its owner, name, and visibility when needed, commit, push, runtime registration or candidate selection, bindings in every affected environment, and staging changes. Name what the eventual merge will activate in production so that consequence is approved before it is reachable, not discovered afterward. Continue through the approved deployment without routine stops, but pause if the target, side effects, or scope changes materially.

## Deploy and verify

Make approved manifest or configuration changes and rerun the recipe check. Commit them, create the approved remote when needed, and push the intended commit. Do not create or update a runtime until the recipe is correctly configured, its applicable local proof still holds, and any required GitHub App confirmation is complete. Requery before first-runtime creation and prefer any supported idempotency or uniqueness mechanism.

Configure the approved staging bindings, select the candidate for staging, and run a representative task through the runtime-group slug so the smoke test exercises staging resolution. Follow the task to completion, retrieve its exact conversation ID, and inspect the complete conversation. Prove that the resolved runtime and recipe commit match the intended Git SHA.

Use an API key scoped to the environment under test; the credential is what selects the environment, so a staging key cannot verify production. Load the `runtime-auth` reference when the product needs more than a trusted backend calling on its own behalf, and treat the move to a service-account application or federation as an integration decision the user makes, not a deployment step.

## Carry both environments

Bindings are environment-scoped. A configured staging endpoint, variable, or credential does not configure production, and production activates on merge without asking whether its bindings exist. Resolve the applicable rows for every environment the recipe will serve, and configure the missing production ones before the merge rather than after the first failed live task.

Merging is the user's release decision, so do not merge to make production move. Explain what the merge will activate, which production bindings are in place, and what remains unresolved.

After the user merges, verify production the same way staging was verified: run a representative task through the stable runtime-group slug, confirm it resolves to the merged recipe commit, and inspect the complete conversation. A created production version is not a verified one.

Report the deployed identity, active commit per environment, runtime and task evidence, material environment effects, remaining readiness gaps, and anything the current CLI could not perform.

## Firm boundaries

- Do not change project files, Git state, bindings, or platform state before confirmation.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not deploy an ambiguous recipe, repository, commit, project, or runtime identity.
- Do not create a duplicate runtime group or invent an unsupported update path.
- Do not merge to production for the user; the merge is their release decision.
- Do not leave production bindings unresolved once the merge would activate it.
- Do not create a GitHub repository without approval of its owner, name, and visibility, or when an appropriate remote already exists.
- Do not register the first runtime from a repository new to the intended project until its GitHub App access is confirmed. This does not block local Git work, remote creation, commits, pushes, or independent binding setup.
- Do not substitute another platform interface when a required operation is unavailable through the current CLI; expose the gap.
