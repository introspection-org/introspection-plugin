---
name: create
description: Create a new focused agent from scratch or an existing recipe template, ending with a locally proven Introspection recipe. Use when the user asks to create, build, scaffold, or start from a template. Keep deployment separate.
---

# Create

Turn the user's desired outcome into a locally proven recipe. Start from scratch or from a selected recipe template. End with something they can run in Pi; leave platform deployment to `$introspection:deploy`.

Load and follow `$introspection:pi`, `$introspection:recipes`, and `$introspection:evals`.

## Think like an agent builder

Clarify the job before designing the agent. A strong first version owns one meaningful outcome for one accountable user. Representative cases are the working specification: use them to discover required judgment, evidence, side effects, and boundaries.

Do not add tools, skills, subagents, or elaborate evaluation infrastructure because they are available. Add each only when an approved case requires it. Prefer a small system whose behavior and failure boundary can be explained.

## Choose the starting point

Resolve the creation mode from the user's request and the repository:

- **Scratch:** use when the user has an outcome but no agent or requested starting point.
- **Template:** use when the user names a recipe, asks for a template, or wants to compare existing starting points.

Do not treat an ordinary application repository as an existing agent. Route to `$introspection:migrate` only when an agent implementation exists and the user wants its approved behavior preserved.

For template mode, prefer a source the user supplied. Otherwise let `$introspection:recipes` resolve a small credible set of catalog candidates against the required job, capabilities, provider requirements, license, and adaptation cost. Explain the consequential inherited behavior and let the user select the source and an owned repository-local destination. Do not install, customize, or copy a template before confirmation.

## Understand the job

Inspect relevant repository context and nearby recipes without changing anything. Learn who invokes the agent, what triggers it, what result it promises, what sources it may trust, what it may change, and when it must stop or ask for help. In template mode, distinguish behavior worth retaining from example behavior that must be removed or replaced.

Develop a small varied acceptance set with the user. Cover ordinary work, ambiguity, missing access, partial failure, and a request that should be declined. Use concrete good and bad outcomes to resolve vague requirements. Let `$introspection:recipes` resolve the portable package and provider/model choices that affect it, and `$introspection:pi` resolve harness, extension, provider, and local execution behavior. Defer tool installation, upgrades, setup, and authentication until an approved execution step actually needs them.

Treat any model written by a scaffold or template as inherited input, not an approved provider decision. Resolve it explicitly before editing the recipe. If the request and repository do not establish a safe choice, pause for that decision instead of silently retaining the placeholder.

## Align with the user

Share what you learned, whether you recommend scratch or a named template, the agent you intend to build, how its representative cases will prove the promise, and any consequential choices or unresolved assumptions. For a template, include its source, license, provider and capability requirements, retained behavior, expected customization, and owned destination. Present this in the clearest natural form for the situation; do not force a standard brief or checklist onto the user.

Ask for confirmation before changing project files or configuration. Treat confirmation as approval to build and prove the agreed local recipe in one continuous pass. Pause again only when a newly discovered dependency, side effect, provider choice, or product decision materially changes that agreement.

## Build and prove

Resolve the real package root and use current recipe tooling to build the smallest recipe that satisfies the approved cases:

- In scratch mode, scaffold a new recipe at the approved repository-local path.
- In template mode, use `$introspection:recipes` to customize the approved source into the approved repository-local output path. Preserve required attribution and license files. Treat the template as a starting point, not proof that the customized agent is correct. Creating a new GitHub repository is outside this local workflow.

Default to one agent. Put judgment in skills, deterministic behavior in scripts and tests, and external access behind explicit capabilities. Do not register a scratch recipe globally unless the user explicitly asks. Treat any recipe-store registration performed by template tooling as an implementation detail; the owned package path is the source of truth.

Preserve the recipe composition model. Put instructions shared across the root agent and delegated subagents in `SYSTEM.md`; put specialized role instructions in each agent's `system_instructions`. Use `from:` when a variant or subagent genuinely inherits a base configuration, and make capability overrides explicit because `tools`, `skills`, and `subagents` arrays replace rather than merge. Keep reusable detailed judgment in skills selected by the agents that need it.

Run representative cases in fresh Pi sessions. Keep the evidence needed to explain what worked, what failed, and why. Fix the owning layer rather than accumulating prompt instructions. Once repeatable checks are credible, offer the user the Pi TUI so they can try the agent and continue iterating with them until the local version is accepted or a concrete blocker remains.

## Hand off

Explain what the agent now does, the evidence behind it, known limits, and the resolved package path and agent name. Give the actual local command and the appropriate deploy invocation for the current host:

```text
Try locally:
pi --recipe <resolved-package-path> --agent <agent>

Deploy:
<host invocation for introspection:deploy> <resolved-package-path>
```

Use `/introspection:deploy` in Claude Code and `$introspection:deploy` in Codex. Omit `--agent` only for one unambiguous default agent. Omit the deploy invocation when the approved output is not inside a Git worktree, and explain that concrete boundary. Invite the user to request another iteration.

## Firm boundaries

- Do not edit project files or configuration before confirmation.
- Do not silently switch providers, models, package managers, installation methods, or authentication.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not silently choose a template or imply that customization removes its license obligations.
- Do not read or expose credentials.
- Do not commit, push, open a pull request, register a runtime, change bindings, or deploy in this workflow.
