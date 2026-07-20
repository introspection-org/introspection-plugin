# Introspection

A small set of progressively disclosed skills for building and improving vertical agents.

The plugin helps turn an important workflow into a narrowly scoped agent with an approved definition of quality, trustworthy evaluation coverage, proven deployment, and a disciplined production feedback loop.

| Skill | Owns |
| --- | --- |
| `recipes` | Vertical agent boundaries, structure, and local proof |
| `evals` | Error analysis, measurement design, and judge calibration |
| `harbor` | Harbor create-task quickstart and evaluation integrity |
| `introspection` | CLI staging deployment, production evidence, judges, comparisons, and Git-release verification |
| `autoresearch` | Advanced, explicitly requested Evo optimization loops |

Start with the skill matching the current problem. Skills route to one another at clear boundaries and load detailed references only when needed.

## Commands

- `/introspection:create-agent` defines quality, builds a recipe, and proves it locally with Pi.
- `/introspection:deploy` takes a staging candidate through Git-backed deployment and verifies the resolved version and conversation.

Use those names in hosts that expose plugin slash commands. In Codex, choose the matching plugin starter prompt or ask to create or deploy an agent; the same skills and boundaries apply.

`create-agent` stops at local prototype readiness. Deployment is always a separate explicit action.

Build in readiness stages:

- **Prototype:** vertical contract plus a small, varied, approved acceptance set.
- **Deployment:** representative evaluation coverage, baseline, and staging proof.
- **Optimization:** stable measurement, meaningful headroom, protected gates, and an explicit research budget.

The default improvement path is production evidence → approved eval coverage → one focused change → validation → deployment. Use `autoresearch` only when trustworthy evals already exist and repeated candidate search is specifically justified.

## Sources of truth

For Introspection work, fetch [llms.txt](https://docs.introspection.dev/llms.txt), open only the relevant linked pages, and confirm exact operations with the installed `introspection` CLI help. For Harbor work, load the matching skill from the installed [official Harbor collection](https://github.com/harbor-framework/harbor/tree/main/skills) and confirm exact operations with CLI help. For Evo work, load its current official skills and CLI help.

The plugin carries cross-cutting agent judgment. It intentionally does not copy product schemas, command catalogs, or full documentation.

## Requirements

- Core: Pi, `@introspection-ai/pi-recipes`, and `@introspection-ai/cli`.
- Conditional: Harbor when an environment-level agent eval is the lowest faithful layer. Its official skills are assumed to be installed.
- Advanced and opt-in: Evo only when `$autoresearch` passes its readiness gate.

## License

Apache-2.0
