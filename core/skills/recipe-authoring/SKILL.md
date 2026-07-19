---
name: recipe-authoring
description: How to author a high-quality Pi recipe — package layout, agent.yaml schema, SYSTEM.md, skills, variants, and credential references. Use whenever creating or editing recipe files.
---

# Authoring Pi recipes

A recipe is a folder: a `package.json` manifest with a `pi` block, plus agent
YAML files, prompts, skills, and optional TypeScript extensions. It is the
portable definition of an agent — the same recipe runs locally under
`pi --recipe <name>` and as a managed Introspection runtime.

## Layout

```text
my-recipe/
  package.json      # identity + pi block declaring resources
  README.md         # what the agent does, for humans
  SYSTEM.md         # base system prompt shared by all agents
  agents/
    agent.yaml      # the default agent (managed runtimes run this)
    daily-brief.yaml# optional named variants
  skills/
    <topic>/SKILL.md
```

`package.json` essentials — top-level `name`/`version`/`description` identify
the recipe; the `pi` block declares resources by glob:

```json
{
  "name": "my-recipe",
  "version": "0.1.0",
  "description": "One line on what this agent does.",
  "type": "module",
  "pi": {
    "agents": ["./agents/*.yaml"],
    "skills": ["./skills/**/SKILL.md"]
  }
}
```

## agents/agent.yaml

The fields that matter (all observed in production recipes):

```yaml
name: agent                       # `agent` is the default the platform runs
description: Main interactive agent session

model:
  name: <provider/model>          # leave the scaffold default unless asked
  thinking_level: low

tools:                            # capability allow-list, smallest that works
  - read
  - exec_command
  - write_stdin
  - apply_patch
  - update_plan

skills:                           # names of skills/<name>/SKILL.md to attach
  - inbox-triage

system_instructions:
  mode: append                    # append to SYSTEM.md, don't replace it
  content: |
    ## Task
    <the agent's actual operating instructions>
```

Named variants derive from the default agent and override only what differs:

```yaml
name: daily-brief
from: agent
description: Scheduled morning summary run
system_instructions:
  mode: append
  content: |
    ## Task
    Produce the morning brief: ...
```

Use a variant (not a second recipe) whenever the same capability set serves a
different cadence or output shape — interactive drafting vs. a scheduled
brief.

## Writing the instructions

- `SYSTEM.md` holds durable identity and shared rules; per-agent
  `system_instructions` hold the task. Don't duplicate between them.
- Write operating instructions, not aspirations: what to read first, what to
  produce, when to stop, what never to do. Concrete beats complete.
- Encode the user's boundaries (e.g. "never send without review") as explicit
  MUST/NEVER rules in the relevant agent, not buried in prose.
- Communication style rules (tone, length, channel etiquette) belong with the
  agent that talks to humans.

## Skills

Recipe skills are `SKILL.md` files with `name` and `description` frontmatter —
the same open format as Claude Code skills, so existing skills can be copied
in unchanged (keep attribution/license headers). Put reusable how-to knowledge
in skills; keep agent instructions about *this agent's* behavior.

## MCP tool access (docs: /integrations/mcp)

When the agent needs an external MCP server (email, calendar, an internal
API), access is declared twice and enforced as the intersection:

1. The **recipe package** declares the allowed servers and tools in
   `package.json` under `pi.mcp`:

   ```json
   {
     "pi": {
       "mcp": {
         "manifest": "mcp.json",
         "servers": [
           { "id": "contacts", "tools": { "include": ["*"], "exclude": ["delete_contact"] } }
         ]
       }
     }
   }
   ```

2. **Each agent** selects its subset in an `mcp:` block keyed by server id:

   ```yaml
   mcp:
     contacts:
       include: ["*"]
       exclude: [delete_contact]
   ```

`include` is required per selected server; `"*"` is a whole-toolset sentinel,
**not a glob** (`search_*` is invalid). Omitting a server from the agent's
`mcp:` block means no access; omitting the block means no MCP tools at all.
Invalid policy fails closed — the task won't launch. The concrete endpoint
and credentials are connected platform-side as bindings, never in the recipe
(see `platform-onboarding`).

## Credentials — the one hard rule

**Never write a secret into any recipe file.** Integrations reference
platform-held credentials by name using `${NAME}` placeholders (e.g. an
endpoint header `Authorization: Bearer ${GMAIL_TOKEN}`); the platform resolves
them at session materialization, and recipes stay publishable. If you find
yourself pasting a token value, stop — the value goes into the Introspection
credentials store via the product UI, only the `${NAME}` reference goes in the
recipe.

## Validate

`recipes check <path>` runs the `pi-recipe-check` validator. It is a hard
gate: fix every finding before install, publish, or deploy. `recipes install
<path>` + `pi --recipe <name>` gives a local test-drive when the `pi` CLI is
available.
