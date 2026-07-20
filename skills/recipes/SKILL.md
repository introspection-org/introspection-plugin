---
name: recipes
description: Define, create, or revise focused vertical agent recipes from an approved definition of quality. Use when shaping an agent's job, representative cases, instructions, skills, scripts, capability boundaries, repository layout, or local proof before deployment.
---

# Recipes

Build the smallest agent that can reliably own one vertical job. Keep platform mechanics in `$introspection` and evaluation design in `$evals`.

## Start with current sources

1. Fetch `https://docs.introspection.dev/llms.txt`.
2. Open only the linked recipe and connection pages needed for the task.
3. Inspect the target repository and nearby recipes before proposing structure.
4. Confirm exact authoring and validation commands with the installed recipe CLI help. If command-specific help is unavailable, use the current Pi recipe documentation rather than inferring side effects.

Current docs, CLI help, and repository schemas override this skill. Describe capabilities, integrations, and bindings in user-facing guidance. Do not reproduce schemas or command catalogs here.

## Define the vertical contract

Write down five things before editing:

- user and trigger
- promised outcome
- evidence that proves the outcome
- permitted side effects
- explicit boundaries and escalation cases

If the job cannot be judged from its output or trace, narrow it.

## Define quality before architecture

Before choosing the recipe structure:

1. Gather real examples when available; otherwise draft varied representative inputs.
2. Show concrete good and bad outcomes and ask the domain owner what specifically matters.
3. Record a small approved acceptance set covering normal work, ambiguity, missing access, partial failure, and a case that should be declined.
4. Capture required evidence, allowed assumptions, unacceptable shortcuts, and source authority.
5. Use `$evals` to produce an evaluation brief and choose the cheapest trustworthy checks.

This acceptance set makes a prototype buildable; it does not need to be a mature optimization benchmark.

## Choose the smallest structure

Default to one agent. Add structure only when it earns its cost:

- Put durable judgment and workflow guidance in a skill.
- Put deterministic, repeatable operations in scripts.
- Add a subagent only for an independent context boundary with a clear input and output.
- Expose only capabilities required by the vertical contract.
- Enforce absolute prohibitions by withholding the capability, not only with prose.
- Prefer a short root instruction that routes into progressively loaded skills.

Read [vertical-agents.md](references/vertical-agents.md) when choosing boundaries or reviewing agent quality.

## Build and prove

1. Preflight Pi and the Pi recipe tooling, then scaffold with the current recipe tooling when starting fresh.
2. Author the root contract, then add only the skills and scripts needed by the representative cases.
3. Make progress, uncertainty, access limits, and final evidence visible to the user.
4. Check the portable package with Pi recipe tooling. Use Introspection's recipe validation only after a `.introspection` manifest exists or deployment preparation begins.
5. Run representative cases locally and inspect the actual outputs and traces. Prefer repeatable noninteractive runs for a multi-case acceptance set, and retain prompts, configuration, and outputs for comparison.
6. Compare results with the approved acceptance set.
7. Hand new failures to `$evals`; do not encode every example into the root prompt.

Stop when the vertical contract is met with a small, understandable recipe. Do not add speculative frameworks or duplicate product documentation.
