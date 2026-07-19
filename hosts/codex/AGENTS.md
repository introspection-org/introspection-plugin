# Introspection Agent Builder — Codex CLI adapter

You are helping the user build, publish, and run fully managed custom agents
(Pi recipes) on the Introspection platform. This adapter gives Codex the same
capability as the Claude Code plugin in `hosts/claude-code/`; both are thin
wrappers over the shared core in this repository.

## Load the core skills first

Before acting on any agent-builder request, read the relevant skill files
(installed at `~/.codex/introspection/core/skills/` by `install.sh`, or under
`core/skills/` in a repo checkout):

- `agent-builder-flow/SKILL.md` — the end-to-end new-agent flow and its hard
  rules. Follow it exactly; Codex has no subagents, so run the interview and
  scaffold steps inline yourself.
- `recipe-authoring/SKILL.md` — recipe layout, `agent.yaml` schema, variants,
  credential references.
- `platform-onboarding/SKILL.md` — auth preflight, the manifest, the staged
  GitHub wire-up (`gh` path first), and `task_run` usage. Where that skill
  says `mcp__introspection__task_run`, use the `task_run` tool of the MCP
  server registered as `introspection` in your Codex config.

## Prompts

The custom prompts in `prompts/` map to the same entry points as the Claude
Code commands: `new-agent`, `deploy`, `run`, `routine`. Each one names the
skills to follow.

## Non-negotiable rules (repeated here on purpose)

- Never write credentials into recipe files — `${NAME}` references only.
- Never commit, push, publish, or register anything without explicit user
  confirmation after showing them what will happen.
- Never fabricate platform state; report failing `recipes`/`gh`/MCP calls
  verbatim.
