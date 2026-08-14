# Introspection Agent Skills

A small set of progressively disclosed Agent Skills for building and operating
agents with Pi, Pi Recipes, and Introspection. A vertical agent owns a focused
outcome from request to result.

## Install

Install the Introspection CLI once:

```bash
npm install -g @introspection-ai/cli
```

Inspect the complete setup plan for Pi, Recipes, and every supported coding
agent detected on the machine:

```bash
introspection setup --check
```

Apply that reviewed plan:

```bash
introspection setup --yes
```

Setup installs the five skills directly into each detected host's user skill
directory. It is idempotent and does not use a plugin marketplace, host plugin
manifest, or separate skill version channel. Re-run setup after upgrading the
CLI to reconcile the installed skills with the CLI's current skill bundle.

Start a new Codex task or Claude Code session after setup changes the installed
skills. Setup also prints the absolute skill directory so an agent in the
current session can read the relevant `SKILL.md` directly.

## Included skills

| Entry point | Owns |
| --- | --- |
| `create` | Build an agent recipe and test it locally with representative cases |
| `migrate` | Convert an existing agent into an agent recipe and test it locally with representative cases |
| `improve` | Improve an agent from production evidence by default or an optional user-directed target |
| `deploy` | Deploy a tested agent recipe, verify its Introspection runtime, and recover a bad version |
| `operate` | Inspect and explain a live project, and change platform state that is not an agent recipe change |

## Repository contents

- `skills/` contains the five public workflow skills and their host-facing metadata.
- `scripts/` contains reference loading and validation helpers.
- `BOUNDARIES.md` contains rules shared by every workflow.
- `CONTRACT.md` contains the reference-loading contract used by every workflow.

The bundle contains workflow routing and safety rules. Supporting product and
tool guidance is loaded from the reference index at
[`docs.introspection.dev/plugin/index.json`](https://docs.introspection.dev/plugin/index.json)
when a workflow needs it. Reference content is fetched per session, so product
guidance can be corrected without publishing a new CLI.

## Requirements

- Required only when a workflow executes that layer: compatible
  `@earendil-works/pi-coding-agent`, `@introspection-ai/recipes`, or
  `@introspection-ai/cli` tooling.
- Conditional: Harbor and its matching official skill when an environment-level
  agent eval is the lowest faithful layer.

## Validate a contribution

```bash
node scripts/validate-references.mjs
```

Validate each public skill with the Agent Skill validator before publishing a
bundle change.

## License

Apache-2.0
