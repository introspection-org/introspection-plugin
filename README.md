# Introspection Agent Builder

Build, publish, and run **fully managed custom agents** on the
[Introspection](https://introspection.dev) platform from a single prompt —
from **Claude Code or OpenAI Codex CLI**.

```text
/introspection:new-agent an email agent that drafts replies in my voice and
sends me a prioritized to-do summary every morning
```

The kit interviews you briefly, scaffolds a portable
[Pi recipe](https://pi.recipes) — **a git repository you own and commit** —
validates it, publishes it, and wires it up to Introspection as a managed
runtime: sandboxed execution, telemetry, observations, and evals included.
Optionally it attaches a schedule ("routine") so your agent runs every
morning without you.

> **Status: beta.** Phase 1 of the design proposal
> (introspection-org/introspection-cloud#1634): composes the open-source
> `recipes` CLI and the platform's MCP tasks server with zero backend
> changes.

## Layout: one core, thin host adapters

```text
core/
  skills/
    agent-builder-flow/     # the end-to-end flow + hard rules
    recipe-authoring/       # how to write a good recipe
    platform-onboarding/    # docs discovery, auth, GitHub wire-up, task_run
hosts/
  claude-code/              # Claude Code plugin (commands, builder agent, MCP config)
  codex/                    # Codex CLI adapter (AGENTS.md, prompts, config, install.sh)
```

The flow and skills live once in `core/`; each host wraps them in its native
format. Platform capabilities (which integrations exist, what the API offers)
are discovered live from https://docs.introspection.dev/llms.txt — the skills
treat the docs site as the source of truth rather than baking in a list.

## Install

**Claude Code** — the plugin root is `hosts/claude-code/`:

```bash
claude --plugin-dir /path/to/agent-builder-plugin/hosts/claude-code
# marketplace install lands with the beta listing
```

**Codex CLI**:

```bash
./hosts/codex/install.sh
# then merge hosts/codex/config.toml.example into ~/.codex/config.toml
# prompts install as /introspection-new-agent, /introspection-deploy, ...
```

**Both need** the recipe CLI: `npm install -g @introspection-ai/pi-recipes`.
The `gh` CLI (authenticated) is optional but makes the GitHub wire-up
hands-free.

## Auth

Both hosts read the same two environment variables:

| Variable | Meaning |
| --- | --- |
| `INTROSPECTION_MCP_URL` | Your data-plane MCP endpoint, e.g. `https://<dp-host>/v1/mcp` |
| `INTROSPECTION_API_TOKEN` | A project-scoped API token (Bearer) |

Set them in your shell profile. Tokens are never written into recipes or
committed anywhere. (OAuth sign-in replaces the pasted token when the
platform's MCP OAuth work lands.)

## Commands / prompts

| Claude Code | Codex CLI | What it does |
| --- | --- | --- |
| `/introspection:new-agent <prompt>` | `/introspection-new-agent` | Interview → scaffold recipe repo → validate → commit → publish → wire up → first run |
| `/introspection:deploy` | `/introspection-deploy` | Publish the current recipe repo and wire it up as a managed runtime |
| `/introspection:run <prompt>` | `/introspection-run` | Run a prompt on a runtime via `task_run` and show the result |
| `/introspection:routine <schedule>` | `/introspection-routine` | Attach a schedule (an Introspection automation). Guided today; API-automated in phase 2 |

## What you end up with

1. **A git repo you own** — a portable Pi recipe (`agents/*.yaml`,
   `SYSTEM.md`, `skills/**/SKILL.md`), committed by you, editable anywhere,
   forkable by anyone. Your existing agent skills can be lifted in as-is:
   recipe skills use the same `SKILL.md` format.
2. **A managed runtime** running that recipe on Introspection, connected via
   the platform's GitHub App (`gh`-approved or UI-approved).
3. **Optionally a routine** — a scheduled run with results delivered to your
   channel.

## License

Apache-2.0
