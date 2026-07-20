---
name: deploy
description: Deploy a proven recipe to Introspection and verify it in staging.
argument-hint: [recipe path, defaults to the current directory]
---

Deploy the recipe identified below, defaulting to the current directory.

Load and follow the Introspection plugin's `evals` and `introspection` skills. Confirm that the recipe is deployment-ready, validate it locally, and inspect the intended Git diff before any commit or push.

Use only the current recipe and Introspection CLIs. Read the relevant workflow selected through `https://docs.introspection.dev/llms.txt`, then confirm exact operations with CLI help.

After the user approves consequential writes, publish the intended Git state, create or update the recipe-backed runtime and required bindings, run a representative staging task, follow it to completion, and inspect the complete conversation.

Report the active commit, task evidence, remaining readiness gaps, and any operation unavailable through the current CLI. Do not substitute another interface.

$ARGUMENTS
