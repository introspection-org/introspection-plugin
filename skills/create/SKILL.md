---
name: create
description: Create a new focused agent from scratch or an existing recipe template, ending with a locally proven Introspection recipe. Use when the user asks to create, build, scaffold, or start from a template. Keep deployment separate.
---

# Create

Turn the user's desired outcome into a locally proven recipe. Start from scratch or from a selected recipe template. End with something they can run in Pi; leave platform deployment to `$introspection:deploy`.

Load and follow `$introspection:pi`, `$introspection:recipes`, and `$introspection:evals`.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Keep the first run short

A first-time create should feel like a couple of prompts, not an interview. Two things must be true before scaffolding — a Node runtime at the Recipes toolchain's floor, and the Introspection CLI — and `$introspection:recipes` owns resolving both. Everything else the recipe needs, including Pi and the Recipes extension, is installed by `init` itself.

When both are already satisfied, spend two lines saying so and move to the agent. Do not narrate the probes that established it, and do not print a dependency table whose every row reads "already fine" — a table is how you present a decision the user has to make, not a receipt for work they did not ask to watch. Report a discrete step only where something is actually unresolved: a runtime below the floor, a missing CLI, or an install that will touch machine-wide state. Those are the user's decisions and deserve their own visible step; the rest is noise that buries them.

Mention once, before scaffolding runs, that `init` installs Pi and the Recipes extension. That single sentence is what keeps a later install from reading as something going wrong.

## Think like an agent builder

Clarify the job before designing the agent. A strong first version owns one meaningful outcome for one accountable user. Representative cases are the working specification: use them to discover required judgment, evidence, side effects, and boundaries.

Do not add tools, skills, subagents, or elaborate evaluation infrastructure because they are available. Add each only when an approved case requires it. Prefer a small system whose behavior and failure boundary can be explained.

## Choose the starting point

Ask for the **recipe** name first, and call it that. It is the one answer the workflow cannot proceed without, it is the argument `init` actually takes, and it is a question the user arrives already able to answer. Everything else about the starting point can be defaulted; this cannot.

Do not call it the agent name. A recipe is the package, and it holds one or more agents; scratch mode simply starts it with one. The two names are independent: the value given to `init` becomes the package name, the directory, and the manifest filename stem, while each agent is named by its own YAML, where the recipe spec's default is `agent`.

Take the name in the user's own words and derive a slug from it. Show the derived slug alongside the name you were given and let the user correct it, rather than silently reshaping what they typed or passing prose where a slug belongs.

Treat this as the most consequential cheap decision in the workflow, and say why when you ask. The slug does not stay inside the package: it names the recipe, the directory, and the manifest stem now, it names the Git repository when scaffolding creates one, and it becomes the basis of the runtime identity when the recipe is later deployed. Only the first of those is a local edit. By deploy the name has been reserved, so a placeholder chosen to get moving is not free to abandon later, and this prompt is the last point where changing it costs nothing. Get it right here rather than offering to fix it afterwards.

Then resolve the creation mode:

- **Scratch (default):** use when the user has an outcome but no agent or requested starting point.
- **Template:** use when the user names a recipe, asks for a template, or wants to compare existing starting points.

When the request does not settle the mode, ask through the host's structured selection affordance, listing scratch first and marked as the default. Never pose this in prose on a host that has the affordance; a paragraph ending in two questions is the thing this instruction exists to prevent. Fall back to a short prose question only where no such affordance exists.

Ask the mode and the destination in the same round, so the starting point is one dialog rather than a sequence of small ones. With the name, that is two prompts for a first run, which is the target. Give each option a hint that names what the choice causes — which command runs, where the recipe lands, whether a repository is created — because the label alone does not let anyone choose. Always leave a path for an answer you did not anticipate.

Scratch and template both reach `init`, and how far template mode diverges depends on what `init` currently accepts. Read its help and let that decide:

- A first-party **template key** is a positional `init` argument alongside the name, so template mode is the same scaffold with a different key. Read the available keys from help rather than naming one from memory, since the set grows, and treat a single available key as meaning scratch and template are currently the same command.
- A **catalog or user-supplied repository** is not an `init` argument. It is obtained with ordinary Git and customized into the approved output path.

Do not present a repository and a template key as the same kind of choice, and do not imply `init` can take a URL.

Do not treat an ordinary application repository as an existing agent. Route to `$introspection:migrate` only when an agent implementation exists and the user wants its approved behavior preserved.

For template mode, prefer a source the user supplied. Otherwise let `$introspection:recipes` resolve a small credible set of catalog candidates against the required job, capabilities, provider requirements, license, and adaptation cost. Present the resolved candidates as selectable options, each naming its inherited behavior, required and optional capabilities, provider, and license, so the choice is informed rather than a list of titles. Let the user select the source and an owned repository-local destination. Do not install, customize, or copy a template before confirmation.

When candidate resolution fails, name the key that failed and ask the user for an explicit source. Do not dead-end the workflow, and do not name candidate templates from memory.

## Understand the job

Inspect relevant repository context and nearby recipes without changing anything. Learn who invokes the agent, what triggers it, what result it promises, what sources it may trust, what it may change, and when it must stop or ask for help. In template mode, distinguish behavior worth retaining from example behavior that must be removed or replaced.

Interview the user for the job in small rounds rather than one dense block. Where a question reduces to known alternatives — who invokes it, what it may change, when it must stop — offer them through the host's structured selection affordance, always leaving a path for an answer you did not anticipate.

Develop a small varied acceptance set with the user. Cover ordinary work, ambiguity, missing access, partial failure, and a request that should be declined. Use concrete good and bad outcomes to resolve vague requirements. Let `$introspection:recipes` resolve the portable package and provider/model choices that affect it, and `$introspection:pi` resolve harness, extension, provider, and local execution behavior. Defer tool upgrades, setup, and authentication until an approved execution step actually needs them; the Introspection CLI is the exception, and `$introspection:recipes` resolves it up front so it is available in this and later shells.

Treat any model written by a scaffold or template as inherited input, not an approved provider decision. Resolve it explicitly before editing the recipe. If the request and repository do not establish a safe choice, pause for that decision instead of silently retaining the placeholder.

## Align with the user

Share what you learned, whether you recommend scratch or a named template, the agent you intend to build, how its representative cases will prove the promise, and any consequential choices or unresolved assumptions. For a template, include its source, license, provider and capability requirements, retained behavior, expected customization, and owned destination. Present this in the clearest natural form for the situation; do not force a standard brief or checklist onto the user. Use the host's structured selection affordance for a discrete choice among known alternatives, and prose for genuinely open-ended questions such as the outcome the agent should own.

Ask for confirmation before changing project files or configuration. Treat confirmation as approval to build and prove the agreed local recipe in one continuous pass. Pause again only when a newly discovered dependency, side effect, provider choice, or product decision materially changes that agreement.

## Build and prove

Resolve the real package root and use the Introspection CLI to build the smallest recipe that satisfies the approved cases:

- In scratch mode, scaffold with the Introspection CLI's `init` verb rather than hand-authoring package files. It writes the recipe directory and its manifest as one unit, and initializes a Git repository when run outside one, which establishes the worktree that deployment later requires. It also installs the Pi coding agent and the Recipes extension, so expect that install here rather than treating it as a prerequisite or a fault.
- Pass the agreed recipe slug as the name argument. Running the verb bare makes it prompt interactively for a recipe name, which stalls a non-interactive shell and takes the naming decision out of the dialog where it was already settled. Confirm the argument order and the available template keys from `init --help` before running; the name is the package name, the directory, and the manifest filename stem, and a template key is a separate positional.
- Expect the scaffolded agent to be named `agent`, the recipe spec's default, rather than named after the recipe. Confirm it from the generated agent YAML instead of assuming, since a recipe may hold more than one agent and any of them can be renamed. Rename it only if the user asks, and treat that as an ordinary edit to its YAML.
- The verb always creates its own subdirectory beneath the working directory and refuses to merge into a path that already exists, so the decision that matters is which directory it runs in: outside a repository the recipe becomes its own repository, and inside one it becomes a subdirectory whose manifest lands at the repository root. Its templates are first-party and embedded in the binary; a starting point named by URL is a repository to clone in template mode, not a value to pass to `init`.
- In template mode, use `$introspection:recipes` to customize the approved source into the approved repository-local output path. Preserve required attribution and license files. Treat the template as a starting point, not proof that the customized agent is correct. Creating a new GitHub repository is outside this local workflow.

Default to one agent. Put judgment in skills, deterministic behavior in scripts and tests, and external access behind explicit capabilities. The owned package path is the source of truth: a recipe is an ordinary Git-backed source package, with no separate install store to register it in.

Preserve the recipe composition model. Put instructions shared across the root agent and delegated subagents in `SYSTEM.md`; put specialized role instructions in each agent's `system_instructions`. Use `from:` when a variant or subagent genuinely inherits a base configuration, and make capability overrides explicit because `tools`, `skills`, and `subagents` arrays replace rather than merge. Keep reusable detailed judgment in skills selected by the agents that need it.

Run representative cases in fresh Pi sessions. Keep the evidence needed to explain what worked, what failed, and why. Fix the owning layer rather than accumulating prompt instructions. Once repeatable checks are credible, offer the user the Pi TUI so they can try the agent and continue iterating with them until the local version is accepted or a concrete blocker remains.

## Hand off

Explain what the agent now does, the evidence behind it, known limits, and the resolved package path and agent name. Give the actual local command and the appropriate deploy invocation for the current host:

```text
Try locally:
introspection local --agent <agent>

Deploy:
<host invocation for introspection:deploy> <resolved-package-path>
```

Give the local command as the CLI's own run verb rather than a raw Pi invocation. The verb resolves the local runtime manifest and launches Pi itself, so it keeps the single developer surface the user already has installed and does not require them to know a second command or where the package root sits. Confirm its flags from help before handing them over, note that it discovers the manifest by walking up from the working directory, and pass anything Pi-specific through the argument separator instead of switching to Pi directly.

Use `/introspection:deploy` in Claude Code and `$introspection:deploy` in Codex. Omit `--agent` only for one unambiguous default agent. Omit the deploy invocation when the approved output is not inside a Git worktree, and explain that concrete boundary. Invite the user to request another iteration.

## Firm boundaries

- Do not edit project files or configuration before confirmation.
- Do not silently switch providers, models, package managers, installation methods, or authentication.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command, apart from the Introspection CLI, which every path through this workflow needs.
- Do not check the environment before stating what the workflow requires, and do not install or switch a runtime without asking first.
- Do not silently choose a template or imply that customization removes its license obligations.
- Do not read or expose credentials.
- Do not commit, push, open a pull request, register a runtime, change bindings, or deploy in this workflow.
