---
name: create-agent
description: Define, build, and prove a new vertical agent locally.
argument-hint: <describe the agent and the job it should own>
---

Create a vertical agent from the request below.

Load and follow the Introspection plugin's `recipes` and `evals` skills. Define the vertical contract and get domain-owner approval on a small, varied acceptance set before choosing the recipe structure.

If the domain owner or representative examples are unavailable, leave a draft contract and an explicit list of unresolved quality decisions. Do not claim prototype readiness or invent approval.

Preflight Pi and the `recipes` binary before editing. If either is unavailable, use the current canonical installation source and report the missing prerequisite before proceeding with an installation.

Use Pi recipe tooling to scaffold, check, and register the portable recipe. Run the approved cases locally with Pi, preferring repeatable noninteractive runs when several cases must be compared. Record the prompts, agent/model configuration, outputs, and run evidence, then report whether it is prototype-ready.

Also report whether a `.introspection` runtime manifest already exists. Its absence does not block local prototype readiness; it is the explicit handoff to `/introspection:deploy`.

Stop after local proof. Do not commit, push, deploy, or register a runtime unless the user separately requests deployment.

Confirm exact operations with current CLI help rather than copying command contracts into the response.

$ARGUMENTS
