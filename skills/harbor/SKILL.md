---
name: harbor
description: Create, grade, run, and maintain Harbor tasks for environment-level agent evaluation. Use when an agent must operate on files, code, services, or tools in an isolated environment; when success needs hidden outcome verification; or when the user explicitly requests Harbor task, Reward Kit, exec, adapter, or publishing work.
---

# Harbor

Use Harbor for reproducible environment-level behavior, after `$evals` establishes that a lower deterministic seam would not faithfully test the capability. This skill is the Introspection quickstart and quality layer. Harbor's installed skills and CLI own Harbor mechanics.

## Load only the official skill needed

Assume the current skills from [`harbor-framework/harbor/skills`](https://github.com/harbor-framework/harbor/tree/main/skills) are installed. Load only the matching upstream skill:

- `create-task` for ordinary task scaffolding, environment design, verifier selection, reference solutions, Oracle validation, and real-agent runs.
- `rewardkit` when grading needs multiple criteria, partial credit, reusable programmatic checks, or a semantic or agent judge.
- `harbor-exec` only for `harbor exec`: compiling loose files, directories, or globs into tasks and running map or map-reduce jobs. Do not use it as the ordinary task runner.
- `create-adapter` only when adapting an external benchmark into Harbor.
- `publish` only when the user explicitly asks to publish a task or dataset to the Harbor registry.
- `upload-parity-experiments` only while contributing adapter parity artifacts to Harbor's shared dataset.

Do not copy their schemas, commands, examples, or troubleshooting tables into this plugin. Confirm current behavior with the installed `harbor` CLI help.

## Create a task

Read [create-task.md](references/create-task.md), then follow the installed `create-task` skill. The local reference supplies the Introspection-to-Harbor handoff, integrity checks, and result interpretation that the upstream task mechanics do not own.

## Preserve and interpret the benchmark

Freeze the instruction, fixtures, environment, verifier, reference solution, and scoring contract while comparing candidates. If the task is wrong, repair it, version it, and establish a new baseline before resuming comparison.

Classify incomplete runs before scoring them: infrastructure failure, task-definition failure, agent failure, or inconclusive noise. Return valid results to `$evals` with the task version, run configuration, raw trial evidence, reward details, and observed variance. Use `$autoresearch` only after the frozen suite is representative, repeatable, and worth optimizing.
