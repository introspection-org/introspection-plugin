# Introspection Agent Builder — Claude Code plugin

Build, publish, and run **fully managed custom agents** on the
[Introspection](https://introspection.dev) platform from a single prompt,
without leaving Claude Code.

```text
/introspection:new-agent an email agent that drafts replies in my voice and
sends me a prioritized to-do summary every morning
```

The plugin interviews you briefly, scaffolds a portable
[Pi recipe](https://pi.recipes) (a git-backed agent package you own),
validates it, publishes it, and connects it to the Introspection platform as a
managed runtime — sandboxed execution, telemetry, observations, and evals
included. Optionally it attaches a schedule ("routine") so your agent runs
every morning without you.

> **Status: beta.** Phase 1 of the
> [design proposal](https://github.com/introspection-org/introspection-cloud/pull/1634):
> the plugin composes the open-source `recipes` CLI and the platform's MCP
> tasks server, with zero backend changes. Platform-side automation of
> registration and routines is phase 2.

## Install

```bash
claude plugin install introspection@<marketplace>   # once listed
# or, from a checkout:
claude --plugin-dir /path/to/agent-builder-plugin
```

Requirements:

- `recipes` CLI: `npm install -g @introspection-ai/pi-recipes`
- An Introspection project + API token (see **Auth** below) for the managed
  parts. Without one, everything through "working local recipe" still works.

## Auth

The bundled MCP server config reads two environment variables:

| Variable | Meaning |
| --- | --- |
| `INTROSPECTION_MCP_URL` | Your data-plane MCP endpoint, e.g. `https://<dp-host>/v1/mcp` |
| `INTROSPECTION_API_TOKEN` | A project-scoped API token (Bearer) |

Set them in your shell profile or `.claude/settings.json` `env`. Tokens are
never written into recipes or committed anywhere. (OAuth sign-in replaces the
pasted token when the platform's MCP OAuth work lands.)

## Commands

| Command | What it does |
| --- | --- |
| `/introspection:new-agent <prompt>` | Interview → scaffold a Pi recipe → validate → test-drive → publish → connect. The main flow. |
| `/introspection:deploy` | Publish the current recipe repo and walk through connecting it as a managed runtime. |
| `/introspection:run <prompt>` | Run a prompt on one of your managed runtimes via `task_run` and stream back the result. |
| `/introspection:routine <schedule>` | Attach a schedule to your agent (an Introspection automation). Guided today; API-automated in phase 2. |

## What you end up with

1. **A git repo you own** — a portable Pi recipe (`agents/*.yaml`,
   `SYSTEM.md`, `skills/**/SKILL.md`), editable anywhere, forkable by anyone.
   Your existing Claude Code skills can be lifted in as-is: recipe skills use
   the same `SKILL.md` format.
2. **A managed runtime** running that recipe on Introspection.
3. **Optionally a routine** — a scheduled run with results delivered to your
   channel.

## Layout

```text
.claude-plugin/plugin.json   # plugin manifest
.mcp.json                    # Introspection MCP server (env-var configured)
commands/                    # /introspection:* slash commands
agents/builder.md            # the interviewer/scaffolder subagent
skills/recipe-authoring/     # how to write a good recipe
skills/platform-onboarding/  # auth, registration, first run
```

## License

Apache-2.0
