# Introspection

A small set of progressively disclosed skills for building and operating agents with Pi, Pi Recipes, and Introspection. A vertical agent owns a focused outcome from request to result.

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

## Session capture (opt-in)

The plugin can record your sessions as OpenTelemetry traces in your own Introspection project, so an onboarding problem is visible to us as something other than a user who gave up. It is **off unless you explicitly turn it on** during installation:

```bash
introspection plugin install --target claude-code --telemetry=on
```

The three levels control what is captured:

| `--telemetry` | Mode | What leaves your machine |
| --- | --- | --- |
| `off` (default) | Off | Nothing. |
| `on` | Telemetry only (timings, errors) | Session shape, timings, models, and tool **names**. No prompts, completions, tool arguments, tool output, working directory, or Git branch. |
| `full` | Full traces (enables support, failures as evals) | The above plus message content, tool payloads, working directory, and Git branch. |

Change or revoke it later without reinstalling. For a single session, the
environment override can only narrow the stored choice; it cannot enable
capture or widen `on` to `full`:

```bash
introspection plugin telemetry            # show the current state and where it came from
introspection plugin telemetry off
INTROSPECTION_PLUGIN_TELEMETRY=off        # disable for this session
INTROSPECTION_PLUGIN_TELEMETRY=on         # omit content from a stored full grant
```

Traces are authenticated with your existing `introspection login`, so nothing extra to configure — and nothing is sent if you are not logged in.

The hook in [`hooks/`](./hooks) is installed for everyone, because it reads your consent at run time and exits immediately when there is none. That keeps consent revocable without uninstalling the plugin, and means capture can never start from a plugin update alone. It also cannot break a session: every failure path exits 0 and changes nothing.

Run `/reload-plugins` in Claude Code, or start a new Codex task, after an install, update, or uninstall. The CLI delegates installation and updates to each host's native plugin commands. The guided workflows inspect and design with the context already available. They defer tool installation, setup, authentication checks, and upgrades until the workflow actually needs the relevant command, and use an existing compatible installation when one is available.

## Included skills

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
