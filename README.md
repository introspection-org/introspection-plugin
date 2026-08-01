# Introspection

A small set of progressively disclosed skills that makes a coding agent an effective forward-deployed engineer for Pi, Pi Recipes, and Introspection.

The plugin helps turn an important workflow into a narrowly scoped agent with an approved definition of quality, trustworthy evaluation coverage, proven deployment, and a disciplined production feedback loop.

## Install

Install the Introspection CLI once:

```bash
npm install -g @introspection-ai/cli
```

Then inspect the complete setup plan for Pi, Recipes, and every supported coding-agent host detected on your machine:

```bash
introspection setup --check
```

Apply that reviewed plan when it contains changes:

```bash
introspection setup --yes
```

Setup is idempotent and preflights every detected host before changing Pi, Recipes, or plugins. The rendered plan is the execution contract; explain and apply it as one operation instead of reproducing its component decisions with separate install commands.

Setup configures each detected plugin at user scope. If automatic installation or host detection fails, register the `stable` release channel and install with the host's native marketplace commands:

```bash
# Claude Code
claude plugin marketplace add https://github.com/introspection-org/introspection-plugin.git#stable
claude plugin install introspection@introspection-org-introspection-plugin --scope user
```

```bash
# Codex
codex plugin marketplace add introspection-org/introspection-plugin@stable
codex plugin add introspection@introspection-org
```

The `stable` branch advances only when Release Please creates a versioned release, so normal development on `main` cannot change an installed plugin. The machine-readable [`stable-channel.json`](./stable-channel.json) travels with that branch and lets the CLI produce an accurate update plan before asking a host to refresh its marketplace.

Update installed plugins with:

```bash
introspection plugin update --dry-run
introspection plugin update
```

The broader upgrade command includes installed plugins on a best-effort basis alongside the CLI, Recipes, and Pi:

```bash
introspection upgrade --dry-run
introspection upgrade
```

To remove the user-scoped plugin while preserving its marketplace registration for an easy reinstall:

```bash
introspection plugin uninstall
```

Run `/reload-plugins` in Claude Code, or start a new Codex task, after an install, update, or uninstall. The CLI delegates installation and updates to each host's native plugin commands. The guided workflows inspect and design with the context already available. They defer tool installation, setup, authentication checks, and upgrades until the workflow actually needs the relevant command, and use an existing compatible installation when one is available.

| Entry point | Owns |
| --- | --- |
| `create` | Build a locally proven Pi recipe from scratch or a selected template |
| `migrate` | Convert an existing agent into a locally proven Pi recipe |
| `improve` | Improve an agent from production evidence by default or an optional user-directed target |
| `deploy` | Publish a proven recipe, verify its Introspection runtime, and recover a bad version |
| `operate` | Inspect and explain a live project, and change platform state that is not a recipe change |

The five split by what a request ends in: a new recipe (`create`), an existing agent ported into one (`migrate`), changed agent behavior landed through the repository (`improve`), a change to what an environment resolves to (`deploy`), and an answer or a changed live resource that leaves the recipe alone (`operate`).

Only these five workflow skills are exposed to the host; everything else is progressively loaded. They pull in five packaged capability modules when needed: Pi, Recipes, evals, Harbor, and Introspection CLI operations. Focused supporting questions route through the closest entry point without forcing its end-to-end workflow.

Offline evals and online judges have different contracts. Every eval case and expected answer must be shown to the domain owner before implementation or execution. Every judge calibration label must likewise be human-approved before calibration. Harbor implements accepted offline environment-level evals; Recipes pins their exact versions while declaring online judges separately. Judge calibration data lives beside its definition as `judges/<judge-name>.calibration.jsonl` and is committed with the judge YAML rather than retained in a temporary directory.

All workflow skills and supporting capability modules ship in this plugin. Pi Recipes remains the lightweight, open implementation and canonical specification for portable recipe behavior; the plugin adds the forward-deployed engineering workflow across Pi, recipes, Introspection, evals, and Harbor.

## Workflows

Nobody names a workflow. A request in ordinary language selects one, and the plugin says which it picked and why:

- `create` builds from scratch or a selected recipe template and proves the result locally with Pi.
- `migrate` converts an existing agent and proves approved behavioral parity locally.
- `improve` turns production evidence or an optional prompt, skill, tool, configuration, eval, failure pattern, or goal into approved fixes, tests, and focused pull requests.
- `deploy` publishes a proven recipe, verifies its resolved runtime, task, conversation, and Git commit, and recovers a version that is causing harm.
- `operate` inspects a live project — tasks, conversations, observations, patterns, metrics, runtimes, bindings, and keys — explains what it finds, and changes live state such as judge enablement, sampling, experiments, and credentials.

A workflow that reaches another workflow's boundary hands over in the same session rather than asking the user to restart with a different one.

The onboarding entry points stay deliberately small:

- An outcome with no implementation routes to `create` from scratch.
- A supplied or requested recipe template routes to `create` in template mode.
- An existing agent whose behavior should be preserved routes to `migrate`.

Every public workflow begins with context collection and produces a useful execution brief. Entering create or migrate authorizes routine local bootstrap: required Node, CLI, Pi, Recipes, and detected-host plugin changes are explained and applied without an installation question. Confirmation still precedes changes to the recipe, repository, configuration, runtime deployment, or product behavior. After approval the workflow proceeds continuously inside that scope and pauses again only for a material target, side-effect, or product-decision change.

`create` and `migrate` stop at a locally proven candidate, show the exact local run command, and leave publishing to `deploy`. `migrate` is designed to complete in one pass after approval. `improve` accepts optional steering and otherwise defaults to production evidence; it adapts investigation and measurement to the resolved target, fixes and tests locally reproducible defects, and opens focused pull requests. It adds or proposes evals only when durable behavioral measurement is justified, and proposes experiments only when calibrated offline evidence cannot decide. Deployment remains a separate explicit action.

Build in readiness stages:

- **Prototype:** vertical contract plus a small, varied, approved acceptance set.
- **Deployment:** representative evaluation coverage, baseline, and staging proof.
- **Optimization:** stable measurement, meaningful headroom, protected gates, and an explicit research budget.

The default improvement path is production evidence → adaptive parallel investigation when independent evidence can be reviewed concurrently → human-approved scope → the cheapest adequate test or eval → one focused change → local proof → focused pull request → explicit deployment.

## Sources of truth

The plugin is a stable router. It carries the routing surface and the safety contract — skill descriptions, workflow control flow, approval gates, and firm boundaries — and resolves everything else at run time.

All content is resolved through the **plugin reference index** at [`docs.introspection.dev/plugin/index.json`](https://docs.introspection.dev/plugin/index.json), by key rather than by URL, so content can be corrected, split, or re-hosted without a plugin release. The index carries two kinds of entry:

- **References** are the plugin's own cross-cutting judgment, such as evaluation design and vertical-agent composition. They are published from the docs repository and reach every installation on its next session.
- **Sources** are external truth: Pi, Pi Recipes, Harbor, and the Introspection documentation. Read only the page the current operation needs, then confirm exact operations with installed CLI help.

Each entry declares a `degradation` class that governs a failed fetch: `advisory` proceeds at reduced depth, `required-for-step` skips only that step, and `gating` stops. A reference that could not be loaded is never reconstructed from memory; the workflow names the key that failed. Workflows report the key and `revision` they used, so a session's judgment is reproducible.

Operate the product entirely through the CLI; never substitute the dashboard, a browser, or browser automation.

The plugin intentionally does not copy product schemas, command catalogs, or full documentation.

## Staying current

Two things update on different clocks.

**The plugin** is the host's responsibility. `version` in `.claude-plugin/plugin.json` is the release signal: Claude Code pins an installation to that string and delivers a new one only when it changes, so a Release Please version bump is what reaches users. Codex refreshes its marketplace on demand. Both need a restart to apply, and the plugin never prompts for its own upgrade — it would only duplicate the host, and cannot activate the result anyway.

The index still publishes `plugin.min_supported_version` as a safety floor. An installation below it stops rather than acting on content shaped for newer semantics. `plugin.current_version` is informational.

**Reference content** is fetched per session, so a correction reaches every installation on every host immediately, with no release, no update, and no restart. That is why the judgment lives there and only the routing lives here.

## Requirements

- Required only when a workflow executes that layer: compatible `@earendil-works/pi-coding-agent`, `@introspection-ai/recipes`, or `@introspection-ai/cli` tooling.
- Conditional: Harbor and its matching official skill when an environment-level agent eval is the lowest faithful layer.

## Validate a contribution

Run both discovery targets before exercising the workflows in a clean host session:

```bash
npx --yes plugins@latest discover . --target codex
npx --yes plugins@latest discover . --target claude-code
```

## License

Apache-2.0
