# Create a Harbor task

Use this reference only after `$introspection:evals` selects Harbor as the lowest faithful evaluation layer. Use the installed Harbor `create-task` skill for exact task structure and commands.

## Start from an evaluation contract

Do not scaffold, implement, or run the task until `$introspection:evals` has shown the complete case matrix to the domain owner and every proposed expected answer or label has been explicitly approved or relabeled. Carry these fields into the task design:

- behavior and user outcome being measured
- source and owner of the requirement
- representative starting inputs
- observable success and required evidence
- unacceptable shortcuts
- expected variability and known infrastructure risks
- approved cases, expected outcomes, rationales, provenance, approver, and dataset version

Keep one task focused on one coherent capability. Split independent behaviors when they need different environments, instructions, or grading contracts.

## Build through the upstream workflow

Follow `create-task` to scaffold the task, write the instruction, construct the environment, choose the verifier, implement the reference solution, configure the task, validate with the Oracle agent, and run a real agent.

Before the real-agent run, resolve the agent's required model and authentication inputs from current `harbor run --help` and the installed adapter. Record the full run configuration without secret values. A missing model, missing credential path, invalid provider setup, or other failure before agent execution is a configuration diagnostic, not the approved real-agent attempt; fix the configuration and rerun. Once the agent has started, preserve the user's attempt limit.

Select the simplest faithful verifier:

1. deterministic assertions for exact outcomes
2. the installed `rewardkit` skill for composable criteria or multiple reward dimensions
3. approved human review when meaning-dependent quality cannot be reduced to an objective outcome

Determinism is a property of the contract being checked, not merely the grader implementation. Prefer structured results, resulting state, executable behavior, tool effects, exact calculations, and invariants. Do not use regex, keywords, substring matching, or exact prose matching as semantic proxies unless literal wording is the approved requirement. If no objective verifier exists, redesign the task or retain human review; do not call model-based semantic grading a deterministic Harbor eval.

Keep legitimate starting inputs visible to the agent. Keep hidden checks, expected outputs, grading prompts, secrets, and the reference solution outside the agent-visible workspace. Verify durable outcomes rather than one preferred command sequence.

## Prove task integrity

Require all of the following before accepting a task:

1. the instruction, environment, and verifier describe the same task
2. the untouched starting state fails for the intended reason
3. the reference solution passes from a clean environment
4. verifier setup and failure paths produce valid, diagnosable results
5. at least one real agent run reaches verification
6. noisy tasks are repeated enough to distinguish variance from capability

Treat dependency resolution, image pulls, service startup, provider failures, and verifier crashes as infrastructure or task failures until shown otherwise. Do not count them as agent failures.

## Return the evidence

Record the task version, agent and model, environment provider, attempt count, raw trial location, reward and reward details, infrastructure failures, and qualitative trace findings. Send new failure classes back to `$introspection:evals` before changing the agent.
