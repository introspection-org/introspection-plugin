---
name: create
description: Create a new focused agent from scratch or an existing recipe template, ending with a locally proven Introspection recipe. Use when the user asks to create, build, scaffold, or start from a template. Keep deployment separate.
---

# Create

Turn the user's desired outcome into a locally proven recipe, starting from a template they brought when they have one. End with something they can run in Pi; leave platform deployment to `$introspection:deploy`.

Load and follow `$introspection:pi`, `$introspection:recipes`, and `$introspection:evals`.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Keep the first run short

Keep the setup invisible so the conversation can be about the agent. Two things must be true before scaffolding — a Node runtime at the Recipes toolchain's floor, and the Introspection CLI — and `$introspection:recipes` owns resolving both. Everything else the recipe needs, including Pi and the Recipes extension, is installed by `init` itself.

When both are already satisfied, spend two lines saying so and move to the agent. Do not narrate the probes that established it, and do not print a dependency table whose every row reads "already fine" — a table is how you present a decision the user has to make, not a receipt for work they did not ask to watch. Report a discrete step only where the user actually has to decide something: nothing installed meets the runtime floor, or setup failed. Installing the CLI is not such a case; install it and report the result in a line. Everything else is noise that buries the decisions that matter.

Mention once, before scaffolding runs, that `init` installs Pi and the Recipes extension. That single sentence is what keeps a later install from reading as something going wrong.

## Think like an agent builder

Clarify the job before designing the agent. A strong first version owns one meaningful outcome for one accountable user. Representative cases are the working specification: use them to discover required judgment, evidence, side effects, and boundaries.

Do not add tools, skills, subagents, or elaborate evaluation infrastructure because they are available. Add each only when an approved case requires it. Prefer a small system whose behavior and failure boundary can be explained.

## Choose the starting point

Open by asking what sort of agent the user wants to build. That is the only thing the workflow cannot proceed without, and the one question they arrive already able to answer. Ask it on its own and wait; do not stack a second question behind it.

Their first answer will be a sentence, not a specification, so step them through the job from there — a short interview of a few focused questions, one round at a time, each one narrowing what the agent owns. Never present them as a numbered list or a form; ask, listen, and let the next question follow from the last answer. `$introspection:evals` owns what to ask about behavior; this skill owns keeping it short and conversational.

Everything else about the starting point — the name, the mode, the destination — follows from those answers and is proposed rather than asked for.

Derive the **recipe** name from what they described and propose a slug for correction. Put real effort into it; a good name is the point, and a lazy one pushes the work back onto the user. Ask for one outright only when the description genuinely does not yield it — too vague, or naming a domain rather than a job.

Give one reason it is worth settling now rather than a tour of everywhere the string lands: it is fixed once scaffolding runs, and it cannot collide with a name the project has already reserved. Settle it inside the dialog you are already having, not as a question of its own.

Call it the recipe name, not the agent name: the recipe is the package and the slug names it, while each agent inside it is named by its own YAML.

Creating a recipe starts from the first-party `template-starter` template in the `introspection-recipes` catalog. That is not a choice to put to the user — it is simply what creating a recipe means, and there is no hand-authored path to prefer over it. Never ask a scratch-versus-template question; a user who brought an outcome rather than a starting point has already answered it.

Some other template becomes the starting point only when the user reaches for one: they name a recipe, ask for a template, or describe something they already have. Until that happens, the branch does not exist and asking about it spends a prompt on a road most first runs never take. When they reach for one without naming it, that is the moment to ask for the source or resolve candidates.

Propose the destination the same way you propose the slug — say where the recipe will land and let the user move it — rather than making it a question. Where it lands has consequences worth one clause, since a directory outside a repository becomes its own repository, and that is what deployment later requires.

Catalog templates are named `template-<key>`, so the repository name and the template key are the same value with a fixed prefix. Resolve the set from the catalog rather than listing it here, since templates are added and renamed.

Either way the starting point is a catalog template, so the routes differ only in how it is obtained, and `init --help` settles that rather than this skill:

- When `init` resolves the wanted template itself, use it. That keeps scaffolding, the manifest, and repository creation as one unit.
- When it does not, obtain the template with ordinary Git and customize it into the approved output path.

Read the keys `init` accepts from its help rather than naming one from memory, and do not assume a catalog repository is accepted as a URL; a key and a repository are different arguments even when they name the same template.

Whichever route applies, the template carries its own identity and does not adopt the agreed slug on its own. Treat renaming it as part of scaffolding, not as later cleanup: the package name, the local runtime manifest and its filename, and anything else naming the template rather than the new recipe all have to move to the agreed slug before the recipe is proven. A recipe still carrying the template's runtime name will claim that name at deploy, where it is reserved per project.

A template may be private. That is an access question rather than a capability question: the fetch uses whatever Git credentials the user already has, so no new authentication belongs in this workflow. When a private template cannot be reached, report it as access and let the user resolve it, rather than substituting a different template or asking them for credentials.

Catalog templates are licensed, so preserve their `LICENSE` and attribution. That holds for the starter too: every recipe begins as someone else's template, and starting from one is not the same as authoring the package.

Do not treat an ordinary application repository as an existing agent. Route to `$introspection:migrate` only when an agent implementation exists and the user wants its approved behavior preserved.

Once the user has reached for a template, prefer a source they supplied. Otherwise let `$introspection:recipes` resolve a small credible set of catalog candidates against the required job, capabilities, provider requirements, license, and adaptation cost. Present the resolved candidates as selectable options, each naming its inherited behavior, required and optional capabilities, provider, and license, so the choice is informed rather than a list of titles. Let the user select the source and an owned repository-local destination. Do not install, customize, or copy a template before confirmation.

When candidate resolution fails, name the key that failed and ask the user for an explicit source. Do not dead-end the workflow, and do not name candidate templates from memory.

## Understand the job

Inspect relevant repository context and nearby recipes without changing anything. Learn who invokes the agent, what triggers it, what result it promises, what sources it may trust, what it may change, and when it must stop or ask for help. When starting from a template the user brought, distinguish behavior worth retaining from example behavior that must be removed or replaced.

Continue the interview the opening question started, in small rounds rather than one dense block, and only for what the starting point did not already settle. Where a question reduces to known alternatives — who invokes it, what it may change, when it must stop — offer them through the host's structured selection affordance, always leaving a path for an answer you did not anticipate.

Develop a small varied acceptance set with the user. Cover ordinary work, ambiguity, missing access, partial failure, and a request that should be declined. Use concrete good and bad outcomes to resolve vague requirements. Let `$introspection:recipes` resolve the portable package and provider/model choices that affect it, and `$introspection:pi` resolve harness, extension, provider, and local execution behavior. Defer tool upgrades, setup, and authentication until an approved execution step actually needs them; the Introspection CLI is the exception, and `$introspection:recipes` resolves it up front so it is available in this and later shells.

Treat any model written by a scaffold or template as inherited input, not an approved provider decision. Resolve it explicitly before editing the recipe. If the request and repository do not establish a safe choice, pause for that decision instead of silently retaining the placeholder.

## Align with the user

Share what you learned, the agent you intend to build, how its representative cases will prove the promise, and any consequential choices or unresolved assumptions. When a template the user brought is the starting point, include its source, license, provider and capability requirements, retained behavior, expected customization, and owned destination. Present this in the clearest natural form for the situation; do not force a standard brief or checklist onto the user. Use the host's structured selection affordance for a discrete choice among known alternatives, and prose for genuinely open-ended questions such as the outcome the agent should own.

Ask for confirmation before changing project files or configuration. Treat confirmation as approval to build and prove the agreed local recipe in one continuous pass. Pause again only when a newly discovered dependency, side effect, provider choice, or product decision materially changes that agreement.

## Build and prove

Resolve the real package root and use the Introspection CLI to build the smallest recipe that satisfies the approved cases:

- Scaffold with the Introspection CLI's `init` verb rather than hand-authoring package files. It writes the recipe directory and its manifest as one unit, and initializes a Git repository when run outside one, which establishes the worktree that deployment later requires. It also installs the Pi coding agent and the Recipes extension, so expect that install here rather than treating it as a prerequisite or a fault.
- Pass the agreed recipe slug as the name argument. Running the verb bare makes it prompt interactively for a recipe name, which stalls a non-interactive shell and takes the naming decision out of the dialog where it was already settled. Confirm the argument order and the available template keys from `init --help` before running; the name is the package name, the directory, and the manifest filename stem, and a template key is a separate positional.
- Expect the scaffolded agent to be named `agent`, the recipe spec's default, rather than named after the recipe. Confirm it from the generated agent YAML instead of assuming, since a recipe may hold more than one agent and any of them can be renamed. Rename it only if the user asks, and treat that as an ordinary edit to its YAML.
- The verb always creates its own subdirectory beneath the working directory and refuses to merge into a path that already exists, so the decision that matters is which directory it runs in: outside a repository the recipe becomes its own repository, and inside one it becomes a subdirectory whose manifest lands at the repository root.
- When the template has to be obtained with Git instead, use `$introspection:recipes` to customize it into the approved output path. Keep the new recipe's history its own: a clone carries the template's commits and its origin, and neither belongs to the user's agent. Creating a new GitHub repository is outside this local workflow.
- Either way, rewrite the template's identity to the agreed slug before proving anything, and confirm it landed by reading the files back. The package name and the local runtime manifest are the two that matter, because they are what deployment later claims. Preserve required attribution and license files while doing it. Treat the template as a starting point, not proof that the customized agent is correct.

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
- Do not install or switch a runtime without asking first, and do not narrate a probe whose result required no decision from the user.
- Do not silently choose a template or imply that customization removes its license obligations.
- Do not read or expose credentials.
- Do not commit, push, open a pull request, register a runtime, change bindings, or deploy in this workflow.
