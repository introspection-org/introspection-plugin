# Introspection

A small set of progressively disclosed skills that makes a coding agent an effective forward-deployed engineer for Pi, Pi Recipes, and Introspection.

The plugin helps turn an important workflow into a narrowly scoped agent with an approved definition of quality, trustworthy evaluation coverage, proven deployment, and a disciplined production feedback loop.

## Install

Choose your coding agent and run the matching command in a terminal:

```bash
# Codex
npx --yes plugins@latest add introspection-org/introspection-plugin --target codex --scope user --yes

# Claude Code
npx --yes plugins@latest add introspection-org/introspection-plugin --target claude-code --scope user --yes
```

Restart the coding agent after installation so it can load the plugin. The guided workflows inspect and design with the context already available. They defer tool installation, setup, authentication checks, and upgrades until the workflow actually needs the relevant command, and use an existing compatible installation when one is available.

| Skill | Owns |
| --- | --- |
| `create` | Build a locally proven Pi recipe from scratch or a selected template |
| `migrate` | Convert an existing agent into a locally proven Pi recipe |
| `improve` | Improve an agent from production evidence by default or an optional user-directed target |
| `deploy` | Publish a proven recipe and verify its Introspection runtime |
| `pi` | Pi harness operation, packages, extensions, skills, settings, and local execution |
| `recipes` | Portable agent composition plus pinned offline evals and separate online judge declarations |
| `evals` | Human-approved offline eval design and online judge calibration methodology |
| `harbor` | Reproducible offline environment-level eval implementation and integrity |
| `introspection` | CLI staging deployment, production evidence, online judges, comparisons, and Git-release verification |

Start with the skill matching the current problem. Skills route to one another at clear boundaries and load detailed references only when needed.

Offline evals and online judges have different contracts. Every eval case and expected answer must be shown to the domain owner before implementation or execution. Every judge calibration label must likewise be human-approved before calibration. Harbor implements accepted offline environment-level evals; Recipes pins their exact versions while declaring online judges separately. Judge calibration data lives beside its definition as `judges/<judge-name>.calibration.jsonl` and is committed with the judge YAML rather than retained in a temporary directory.

All workflow and supporting skills ship in this plugin. Pi Recipes remains the lightweight, open implementation and canonical specification for portable recipe behavior; the plugin adds the forward-deployed engineering workflow across Pi, recipes, Introspection, evals, and Harbor.

## Commands

- `/introspection:create` builds from scratch or a selected recipe template and proves the result locally with Pi.
- `/introspection:migrate` converts an existing agent and proves approved behavioral parity locally.
- `/introspection:improve [focus]` turns production evidence or an optional prompt, skill, tool, configuration, eval, failure pattern, or goal into approved fixes, tests, and focused pull requests.
- `/introspection:deploy` publishes a proven recipe and verifies its resolved runtime, task, conversation, and Git commit.

In Codex, invoke the same workflows with `$introspection:create`, `$introspection:migrate`, `$introspection:improve`, and `$introspection:deploy`. Codex surfaces enabled skills in its slash menu and inserts them using the plugin-and-skill mention syntax.

The onboarding entry points stay deliberately small:

- An outcome with no implementation routes to `create` from scratch.
- A supplied or requested recipe template routes to `create` in template mode.
- An existing agent whose behavior should be preserved routes to `migrate`.

Every public workflow begins with context collection, produces a useful execution brief, and asks for confirmation before changing the recipe, repository, configuration, runtime, or product behavior. After approval it proceeds continuously inside that scope and pauses again only for a material target, side-effect, or product-decision change. Tooling is resolved just in time, and any required installation or upgrade is reported when it occurs.

`create` and `migrate` stop at a locally proven candidate and show the exact Pi and `deploy` commands. `migrate` is designed to complete in one pass after approval. `improve` accepts optional steering and otherwise defaults to production evidence; it adapts investigation and measurement to the resolved target, fixes and tests locally reproducible defects, and opens focused pull requests. It adds or proposes evals only when durable behavioral measurement is justified, and proposes experiments only when calibrated offline evidence cannot decide. Deployment remains a separate explicit action.

Build in readiness stages:

- **Prototype:** vertical contract plus a small, varied, approved acceptance set.
- **Deployment:** representative evaluation coverage, baseline, and staging proof.
- **Optimization:** stable measurement, meaningful headroom, protected gates, and an explicit research budget.

The default improvement path is production evidence → adaptive parallel investigation when independent evidence can be reviewed concurrently → human-approved scope → the cheapest adequate test or eval → one focused change → local proof → focused pull request → explicit deployment.

## Sources of truth

For Pi harness work, read only the relevant current [Pi documentation](https://pi.dev/docs/latest). For portable recipe work, use the installed Pi Recipes documentation or the canonical [`pi-recipes` docs](https://github.com/introspection-org/pi-recipes/tree/main/docs). For Introspection work, fetch [llms.txt](https://docs.introspection.dev/llms.txt), open only the relevant linked pages, and confirm exact operations with the installed `introspection` CLI help. Operate the product entirely through the CLI; never substitute the dashboard, a browser, or browser automation. For Harbor work, load the matching skill from the [official Harbor collection](https://github.com/harbor-framework/harbor/tree/main/skills) and confirm exact operations with CLI help.

The plugin carries cross-cutting agent judgment. It intentionally does not copy product schemas, command catalogs, or full documentation.

## Requirements

- Required only when a workflow executes that layer: compatible `@earendil-works/pi-coding-agent`, `@introspection-ai/pi-recipes`, or `@introspection-ai/cli` tooling.
- Conditional: Harbor and its matching official skill when an environment-level agent eval is the lowest faithful layer.

## Validate a contribution

Run both discovery targets before exercising the workflows in a clean host session:

```bash
npx --yes plugins@latest discover . --target codex
npx --yes plugins@latest discover . --target claude-code
```

## License

Apache-2.0
