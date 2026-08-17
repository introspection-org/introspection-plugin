# Introspection (retired)

> **This plugin is retired and is no longer installable. Nothing here is live.**
>
> Agent Skills are now read from the Introspection CLI, and the five workflow
> skills are owned by [`introspection-docs`](https://github.com/introspection-org/introspection-docs)
> (`skills/`), which serves them through the skills manifest. The copies under
> `skills/` in this repository are the older plugin-era versions and are **not**
> what a user receives.
>
> ```bash
> introspection skills           # list and read the current workflows
> introspection setup --check    # inspect the current setup plan
> ```
>
> **If you still have the old plugin installed**, `introspection upgrade`
> removes it — it detects the retired user-scoped plugin and marketplace entries
> on both hosts and takes them out. You do not need to uninstall anything by
> hand.
>
> ```bash
> introspection upgrade --dry-run   # shows the removal before it happens
> introspection upgrade
> ```
>
> Every `introspection plugin …` command this README used to document
> (`install`, `update`, `uninstall`, `telemetry`) **no longer exists** in the
> CLI. Session capture never shipped past the plugin, so there is no consent
> state to revoke.
>
> The repository is kept for history and for the capture engine in `hooks/`,
> which may be revived independently of the plugin. See
> [`plugin-observability.md`](https://github.com/introspection-org/introspection-cloud/blob/main/docs/design/plugin-observability.md)
> for that design and why it was retired.

A small set of progressively disclosed skills for building and operating agents with Pi, Pi Recipes, and Introspection. A vertical agent owns a focused outcome from request to result.

## Included skills (historical)

These are the workflows the plugin routed. They live on in
[`introspection-docs`](https://github.com/introspection-org/introspection-docs)
`skills/` and are reached with `introspection skills <name>`; the table records
what each one owned.

| Entry point | Owns |
| --- | --- |
| `create` | Build an agent recipe and test it locally with representative cases |
| `migrate` | Convert an existing agent into an agent recipe and test it locally with representative cases |
| `improve` | Improve an agent from production evidence by default or an optional user-directed target |
| `deploy` | Deploy a tested agent recipe, verify its Introspection runtime, and recover a bad version |
| `operate` | Inspect and explain a live project, and change platform state that is not an agent recipe change |

## Repository contents

- `.codex-plugin/` contains the Codex plugin manifest.
- `.claude-plugin/` contains the Claude Code plugin and marketplace manifests.
- `skills/` contains the five public workflow skills and their host-facing metadata.
- `scripts/` contains reference loading, validation, and release helpers.
- `BOUNDARIES.md` contains rules shared by every workflow.
- `CONTRACT.md` contains the reference-loading contract used by every workflow.
- `stable-channel.json` and `version.txt` identify the published stable release.

The plugin contains workflow routing and safety rules. Supporting product and tool guidance is loaded from the reference index at [`docs.introspection.dev/plugin/index.json`](https://docs.introspection.dev/plugin/index.json) when a workflow needs it.

## Staying current

Nothing here updates any more. The release machinery below is inert: `stable`
no longer advances, and no host resolves this marketplace.

Historically the plugin was the host's responsibility — `version` in
`.claude-plugin/plugin.json` was the release signal, and Claude Code pinned an
installation to that string. Reference content was fetched per session so a
correction reached every installation with no release. That split (judgment in
the index, routing in the plugin) is the idea that carried over: the CLI now
serves the routing too.

## Requirements

- Required only when a workflow executes that layer: compatible `@earendil-works/pi-coding-agent`, `@introspection-ai/recipes`, or `@introspection-ai/cli` tooling.
- Conditional: Harbor and its matching official skill when an environment-level agent eval is the lowest faithful layer.

## Contributing

Don't. This repository is retired and accepts no functional changes. Workflow
skill edits belong in
[`introspection-docs`](https://github.com/introspection-org/introspection-docs)
`skills/`, which is what users actually receive; capture-engine changes belong
in `@introspection-sdk/coding-agent` in
[`introspection-js-sdk`](https://github.com/introspection-org/introspection-js-sdk).

## License

Apache-2.0
