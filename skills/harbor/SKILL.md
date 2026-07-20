---
name: harbor
description: Author and validate Harbor tasks for environment-level agent evaluation. Use when an agent must operate on files, code, services, or tools in an isolated environment and success needs hidden outcome verification.
---

# Harbor

Build fair, reproducible tasks that test outcomes rather than one preferred trajectory. Use `$evals` first when the correct evaluation layer is still unclear.

## Load Harbor's current contract

Before authoring or changing a task:

1. Read the current official Harbor task-creation and CLI skills from `harbor-framework/skills`.
2. Confirm exact scaffolding, validation, and run commands with installed Harbor help.
3. Inspect neighboring tasks in the target repository.

Those sources own current structure and commands. This skill supplies the design review, not a duplicate specification.

## Author the task

1. State the user-visible objective and acceptance criteria in a self-contained instruction.
2. Put only legitimate starting inputs in the environment.
3. Keep the reference solution and hidden verification outside the agent-visible image.
4. Verify observable end state, not tool sequence or wording.
5. Make every verifier path emit a valid reward, including setup and test failures.
6. Pin dependencies and remove incidental network, clock, and ordering sensitivity.
7. Implement a real reference solution; do not hardcode the answer into verification.

Read [task-quality.md](references/task-quality.md) when designing the verifier or diagnosing unreliable results.

## Validate in layers

Run, in order:

1. static task-quality checks
2. the reference solution in a clean environment
3. the verifier against the untouched starting state to prove a meaningful failure
4. at least one real agent attempt
5. repeated runs when the task or environment may be noisy

Treat image pulls, service startup, timeouts, and dependency failures as infrastructure until shown otherwise. Treat instruction-verifier disagreement as a broken task, not an agent failure.

## Preserve the benchmark

Version task changes deliberately. Never modify instructions, fixtures, environment, or verifier while comparing candidate agents. If the task itself is wrong, repair it and establish a new baseline before resuming comparison.
