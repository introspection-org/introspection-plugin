---
name: deploy
description: Deploy a proven recipe to Introspection and verify it in staging.
argument-hint: [recipe path, defaults to the current directory]
---

Deploy the recipe identified below, defaulting to the current directory.

Load and follow the Introspection plugin's `evals` and `introspection` skills. Confirm that the recipe is candidate-ready for staging, validate it locally, and inspect the intended Git diff before any commit or push.

Use the Introspection CLI for platform operations and normal Git tooling for repository and pull-request operations. Read the current "Deploying a recipe" and "Connecting an agent" workflows selected through `https://docs.introspection.dev/llms.txt`, then confirm exact operations with installed CLI help. If the docs and installed help disagree, check the CLI version and upgrade path rather than guessing.

Preflight the installed CLI version, login identity, project, scopes, Git remote, Git status, recipe path, and `.introspection` manifest. If the manifest is missing, author it from the current deployment guide and revalidate before Git operations. Stop when the project or repository integration required by the guide is unavailable through the CLI.

Distinguish the lifecycle before mutating anything:

- For the first runtime, follow the documented clean-main bootstrap. It activates the first version for both production and staging, so state that exposure before proceeding.
- For an existing runtime group, publish or update the pull request, then identify the immutable candidate version created from its PR head. Do not look for a runtime update command or create a second runtime group.

Configure required staging bindings, select the candidate for staging, then run a representative task through the runtime-group slug so the smoke test exercises staging resolution. Follow it to completion, retrieve that task's exact conversation ID, and inspect the complete conversation. Prove that the resolved runtime and recipe commit match the intended Git SHA.

Report the active commit, runtime and task evidence, remaining readiness gaps, and any operation unavailable through the current CLI. Do not substitute another platform interface.

$ARGUMENTS
