# Introspection

A small set of progressively disclosed skills for building and improving vertical agents.

The plugin helps turn an important workflow into a narrowly scoped agent with an approved definition of quality, trustworthy evaluation coverage, proven deployment, and a disciplined production feedback loop.

## Install

Choose your coding agent and run the matching command in a terminal:

```bash
# Codex
npx plugins add introspection-org/introspection-plugin -t codex

# Claude Code
npx plugins add introspection-org/introspection-plugin -t claude-code
```

Restart the coding agent after installation so it can load the plugin. The guided workflows check their own prerequisites and keep recognized installations of Pi, recipe tooling, and the Introspection CLI current before normal workflow approval. They never switch installation methods, replace an unrecognized development build, request elevated privileges, or change authentication or user configuration without stopping for the user.

| Skill | Owns |
| --- | --- |
| `create` | Turn an agent idea into a locally proven Pi recipe |
| `migrate` | Convert an existing agent into a locally proven Pi recipe |
| `improve` | Improve an agent from production evidence by default or an optional user-directed target |
| `deploy` | Publish a proven recipe and verify its Introspection runtime |
| `recipes` | Vertical agent boundaries, structure, and local proof |
| `evals` | Error analysis, measurement design, and judge calibration |
| `harbor` | Harbor create-task quickstart and evaluation integrity |
| `introspection` | CLI staging deployment, production evidence, judges, comparisons, and Git-release verification |

Start with the skill matching the current problem. Skills route to one another at clear boundaries and load detailed references only when needed.

## Commands

- `/introspection:create` builds a new recipe and proves it locally with Pi.
- `/introspection:migrate` converts an existing agent and proves approved behavioral parity locally.
- `/introspection:improve [focus]` turns production evidence or an optional prompt, skill, tool, configuration, eval, failure pattern, or goal into approved fixes, tests, and focused pull requests.
- `/introspection:deploy` publishes a proven recipe and verifies its resolved runtime, task, conversation, and Git commit.

In Codex, invoke the same workflows with `$introspection:create`, `$introspection:migrate`, `$introspection:improve`, and `$introspection:deploy`. Codex surfaces enabled skills in its slash menu and inserts them using the plugin-and-skill mention syntax.

Every public workflow begins with context collection, completes the narrowly scoped toolchain-freshness preflight described above, presents one concrete execution brief, and asks for confirmation before changing the recipe, repository, configuration, runtime, or product behavior. After approval it proceeds continuously inside that scope and pauses again only for a material target, side-effect, or product-decision change. Any preflight upgrade is reported in the execution brief.

`create` and `migrate` stop at a locally proven candidate and show the exact Pi and `deploy` commands. `migrate` is designed to complete in one pass after approval. `improve` accepts optional steering and otherwise defaults to production evidence; it adapts investigation and measurement to the resolved target, fixes and tests locally reproducible defects, and opens focused pull requests. It adds or proposes evals only when durable behavioral measurement is justified, and proposes experiments only when calibrated offline evidence cannot decide. Deployment remains a separate explicit action.

Build in readiness stages:

- **Prototype:** vertical contract plus a small, varied, approved acceptance set.
- **Deployment:** representative evaluation coverage, baseline, and staging proof.
- **Optimization:** stable measurement, meaningful headroom, protected gates, and an explicit research budget.

The default improvement path is production evidence → adaptive parallel investigation when independent evidence can be reviewed concurrently → human-approved scope → the cheapest adequate test or eval → one focused change → local proof → focused pull request → explicit deployment.

## Sources of truth

For Introspection work, fetch [llms.txt](https://docs.introspection.dev/llms.txt), open only the relevant linked pages, and confirm exact operations with the installed `introspection` CLI help. For Harbor work, load the matching skill from the installed [official Harbor collection](https://github.com/harbor-framework/harbor/tree/main/skills) and confirm exact operations with CLI help.

The plugin carries cross-cutting agent judgment. It intentionally does not copy product schemas, command catalogs, or full documentation.

## Requirements

- Core: current compatible releases of `@earendil-works/pi-coding-agent`, `@introspection-ai/pi-recipes`, and `@introspection-ai/cli`.
- Conditional: Harbor when an environment-level agent eval is the lowest faithful layer. Its official skills are assumed to be installed.

## Validate a contribution

Run the repository contract checks and both discovery targets before exercising the workflows in a clean host session:

```bash
python3 scripts/validate_plugin.py
npx --yes plugins@latest discover . --target codex
npx --yes plugins@latest discover . --target claude-code
```

The local validator rejects duplicate command and skill surfaces, unqualified cross-skill references, broken local references, incomplete confirmation contracts, and missing trigger coverage. Extend [`tests/trigger-cases.json`](tests/trigger-cases.json) whenever a description or routing boundary changes, then run representative positive, paraphrased, and near-miss cases repeatedly in both hosts before release.

## License

Apache-2.0
