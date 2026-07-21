---
name: deploy
description: Deploy a locally proven Introspection recipe and verify it in staging. Use when the user asks to deploy, publish, stage, or create a runtime for an agent recipe, or invokes deploy.
---

# Deploy

Deploy the locally proven recipe identified by the request. Resolve the actual package and platform identity instead of assuming the current directory or a passing check points to the right thing.

Load and follow `$introspection:pi`, `$introspection:recipes`, `$introspection:evals`, and `$introspection:introspection`. Resolve each CLI only when the approved deployment step first needs it.

## Think in provenance and lifecycle

Deployment is a proof problem: establish which recipe, repository, commit, project, runtime group, version, bindings, and environment will be affected. A passing recipe check is necessary but not sufficient. The deployed task must resolve to the intended immutable Git commit and produce representative behavior through staging.

Reuse the existing runtime lifecycle. A matching runtime group is not a reason to create another one, and an ambiguous identity is not permission to guess.

## Establish readiness

Confirm local evidence in proportion to the agent's risk. For a newly created agent, use its approved acceptance set and retained local proof. For a migrated or improved agent, use the parity or comparison evidence from that workflow. Do not invent an eval, Harbor task, or calibrated judge when the job does not require one.

Read the current deployment and connection workflows routed through [`docs.introspection.dev/llms.txt`](https://docs.introspection.dev/llms.txt), then confirm exact operations with focused installed CLI help. If documentation and help disagree, resolve the installed version and upgrade path rather than guessing.

Without changing anything, resolve CLI version and login identity, project and scopes, Git remote and status, recipe package root, `.introspection` manifest, and intended diff. Run the current recipe check. Identify missing or invalid configuration, but do not repair it yet.

## Resolve runtime identity

Query runtime groups and versions before proposing a deployment. Match repository identity, manifest, package location, and any other canonical identifiers supported by the current CLI.

If a runtime group already represents the recipe, use its candidate-version flow. For a genuinely new first runtime, follow the documented clean-main bootstrap and make clear that its first version activates for both production and staging. Requery the same identity immediately before creation so concurrent work cannot produce a duplicate.

Never create a GitHub repository for the user. If the repository, remote, or GitHub App access is missing, explain what the user must create or grant, then resume only after they select or confirm the repository.

## Align with the user

Explain the resolved target and provenance, local readiness, recipe-check result, proposed Git or configuration work, runtime lifecycle, environment effects, and verification plan. Make material side effects and uncertainty unmistakable, but choose the clearest natural presentation rather than a fixed deployment brief.

Ask for explicit confirmation covering the complete proposed mutation: configuration edits, commit, push, runtime registration or candidate selection, bindings, and staging changes. Continue through the approved deployment without routine stops, but pause if the target, side effects, or scope changes materially.

## Deploy and verify

Make approved manifest or configuration changes and rerun the recipe check. Do not create or update a runtime until the recipe is correctly configured and its applicable local proof still holds. Requery before first-runtime creation and prefer any supported idempotency or uniqueness mechanism.

Configure the approved staging bindings, select the candidate for staging, and run a representative task through the runtime-group slug so the smoke test exercises staging resolution. Follow the task to completion, retrieve its exact conversation ID, and inspect the complete conversation. Prove that the resolved runtime and recipe commit match the intended Git SHA.

Report the deployed identity, active commit, runtime and task evidence, material environment effects, remaining readiness gaps, and anything the current CLI could not perform.

## Firm boundaries

- Do not change project files, Git state, bindings, or platform state before confirmation.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not deploy an ambiguous recipe, repository, commit, project, or runtime identity.
- Do not create a duplicate runtime group or invent an unsupported update path.
- Do not create a GitHub repository for the user.
- Do not substitute another platform interface when a required operation is unavailable through the current CLI; expose the gap.
