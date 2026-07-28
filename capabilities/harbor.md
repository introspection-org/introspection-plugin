# Harbor

Use Harbor as the recommended framework for new reproducible environment-level agent evaluations, after the [Evals capability](evals.md) establishes that a lower deterministic seam would not faithfully test the capability. This module is the Introspection quickstart and quality layer. Harbor's installed skills and CLI own Harbor mechanics.

Harbor implements offline evals; it does not own online judges. Require the human-approved case matrix from the Evals capability before scaffolding, grading, or running a task. If the matrix is missing or contains unapproved expected answers or labels, present it for review and pause instead of inventing ground truth.

Do not force a project with a working evaluation framework to migrate. Keep its existing cases, graders, runner, history, and CI integration when they faithfully exercise the behavior. Use the Evals capability with that framework, and introduce Harbor only for a missing environment, isolation, execution, portability, or verification capability.

Before an approved task-authoring or execution operation requires Harbor, confirm the CLI and selected official skill are available. Do not install or upgrade Harbor during evaluation design merely to make it current. If required tooling is missing or incompatible, route to the current official Harbor installation source instead of reconstructing its workflow locally.

Before spending any approved real-agent attempt, resolve and print the complete run configuration with current CLI help: agent, explicit model, authentication source, environment, task or dataset selector, attempt count, and output directory. Run a non-mutating setup or config check when the agent supports one. For Codex, `--model` is required; when using an existing ChatGPT login, pass `CODEX_AUTH_JSON_PATH` or `CODEX_FORCE_AUTH_JSON` through `--agent-env` instead of assuming the host login will appear inside the Harbor environment. Never print credential contents.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Load only the official skill needed

Assume the current official Harbor skills are installed; the `harbor-skills` source locates them when one is missing or incompatible. Load only the matching upstream skill:

- `create-task` for ordinary task scaffolding, environment design, verifier selection, reference solutions, Oracle validation, and real-agent runs.
- `rewardkit` when offline grading needs multiple criteria, partial credit, or reusable programmatic checks. Do not use model-based grading to disguise semantic correctness as a deterministic eval; route an online judge request through the [Evals](evals.md) and [Introspection](introspection.md) capabilities.
- `harbor-exec` only for `harbor exec`: compiling loose files, directories, or globs into tasks and running map or map-reduce jobs. Do not use it as the ordinary task runner.
- `create-adapter` only when adapting an external benchmark into Harbor.
- `publish` only when the user explicitly asks to publish a task or dataset to the Harbor registry.
- `upload-parity-experiments` only while contributing adapter parity artifacts to Harbor's shared dataset.

Do not copy their schemas, commands, examples, or troubleshooting tables into this plugin. Confirm current behavior with the installed `harbor` CLI help, and use the `harbor-docs` source only when help does not settle the question.

## Create a task

Load the `harbor-create-task` reference, then follow the installed `create-task` skill. The local reference supplies the Introspection-to-Harbor handoff, integrity checks, and result interpretation that the upstream task mechanics do not own.

## Preserve and interpret the benchmark

Freeze the instruction, fixtures, environment, verifier, reference solution, and scoring contract while comparing candidates. If the task is wrong, repair it, version it, and establish a new baseline before resuming comparison.

Classify incomplete runs before scoring them: infrastructure failure, task-definition failure, agent failure, or inconclusive noise. A pre-execution configuration failure is not a completed real-agent attempt: correct it and rerun within the user's approved real-agent budget. Do not rerun a trial that reached agent execution or verification unless the user approved another attempt. Return valid results to the Evals capability with the task version, run configuration, raw trial evidence, reward details, and observed variance. When a representative, repeatable suite cannot distinguish credible candidates, return the evidence needed for a bounded experiment proposal; do not launch an experiment or autonomous candidate search.

Treat durable coverage as an explicit handoff: the Evals capability owns the approved offline measurement contract, Harbor owns the environment, verifier, and run evidence, and the [Recipes capability](recipes.md) owns the package declaration. When an accepted task becomes durable recipe coverage, load the Recipes capability for the declaration and the [Pi capability](pi.md) for the local harness run. Read the current Pi Recipe Evals documentation, pin the exact Harbor dataset version or Git revision in the recipe, and establish a new unchanged baseline through the Introspection CLI. Keep the dataset outside the recipe and change an eval pin separately from agent behavior. Keep online judge declarations separate from Harbor eval pins.
