---
name: harbor
description: Provide supporting Harbor expertise for environment-level agent evaluations. Use for a narrowly scoped Harbor task, Reward Kit, exec, adapter, grading, or publishing request, or when the evals workflow selects Harbor as the lowest faithful layer. Route general evaluation design to evals and end-to-end agent improvement to improve.
license: Apache-2.0
---

# Harbor

Use Harbor as the recommended framework for new reproducible environment-level agent evaluations, after `$introspection:evals` establishes that a lower deterministic seam would not faithfully test the capability. This skill is the Introspection quickstart and quality layer. Harbor's installed skills and CLI own Harbor mechanics.

Do not force a project with a working evaluation framework to migrate. Keep its existing cases, graders, runner, history, and CI integration when they faithfully exercise the behavior. Use `$introspection:evals` with that framework, and introduce Harbor only for a missing environment, isolation, execution, portability, or verification capability.

Before authoring or running a task, confirm the Harbor CLI and selected official skill are available. They are normally pre-installed; if either is missing, stop and route to the current official Harbor installation source instead of reconstructing its workflow locally.

Before spending any approved real-agent attempt, resolve and print the complete run configuration with current CLI help: agent, explicit model, authentication source, environment, task or dataset selector, attempt count, and output directory. Run a non-mutating setup or config check when the agent supports one. For Codex, `--model` is required; when using an existing ChatGPT login, pass `CODEX_AUTH_JSON_PATH` or `CODEX_FORCE_AUTH_JSON` through `--agent-env` instead of assuming the host login will appear inside the Harbor environment. Never print credential contents.

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

Classify incomplete runs before scoring them: infrastructure failure, task-definition failure, agent failure, or inconclusive noise. A pre-execution configuration failure is not a completed real-agent attempt: correct it and rerun within the user's approved real-agent budget. Do not rerun a trial that reached agent execution or verification unless the user approved another attempt. Return valid results to `$introspection:evals` with the task version, run configuration, raw trial evidence, reward details, and observed variance. When a representative, repeatable suite cannot distinguish credible candidates, return the evidence needed for a bounded experiment proposal; do not launch an experiment or autonomous candidate search.

When an accepted task becomes durable recipe coverage, load `$introspection:recipes` first so its current-docs and just-in-time tool resolution runs. Then read the current Pi Recipe Evals documentation, pin the exact Harbor dataset version or Git revision in the recipe, and establish a new unchanged baseline through Pi recipe tooling. Keep the dataset outside the recipe and change an eval pin separately from agent behavior.
