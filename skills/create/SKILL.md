---
name: create
description: Create a focused agent from scratch or a recipe template, ending with a locally proven Introspection recipe, and provide supporting Pi, Pi Recipes, evaluation, or Harbor guidance during agent development. Use for create, build, scaffold, template, Pi, recipe, eval, or Harbor requests that are not migration, production improvement, or deployment. Keep migration and deployment separate. Adding a tool, skill, capability, or MCP server to an agent that already exists is improve rather than create, even when the request is phrased as building something new, and an existing agent implementation to be ported is migrate.
---

# Create

Turn the user's desired outcome into a locally proven recipe, starting from a template they brought when they have one. End with something they can run in Pi; leave migration to `migrate` and platform deployment to `deploy`.

## Load capabilities

Load only the local capability modules the request reaches:

- [Pi](../../capabilities/pi.md) for harness, extension, skill-discovery, provider, settings, package, or local-execution behavior.
- [Recipes](../../capabilities/recipes.md) for portable package composition, templates, validation, distribution, or judge declarations.
- [Evals](../../capabilities/evals.md) for behavior discovery, trace analysis, measurement design, case approval, or judge calibration.
- [Harbor](../../capabilities/harbor.md) only after the Evals module selects a new environment-level evaluation, or for a narrowly scoped Harbor question.
- [Introspection](../../capabilities/introspection.md) when a runtime already exists and the user wants to exercise recipe changes through the platform's development chat.

For a focused supporting question, load and follow the matching module without forcing the full creation workflow. When one module routes to another, load the named module before acting at that boundary.

Load the `common-failures` reference before starting: it lists, by lifecycle stage, the mistakes that are actually made here — including what a clean validator run does and does not prove.

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Keep the first run short

Keep setup brief so the conversation can be about the agent. The Recipes capability owns making the Introspection CLI available and using its canonical setup workflow before scaffolding. Once the CLI is available, run `introspection setup --check` and treat the rendered plan as authoritative for Pi, Recipes, and every supported coding-agent host the CLI detects.

When the plan is already satisfied, report that in one line and move to the agent. Do not narrate the probes that established it or print a dependency table whose every row reads "already fine". When the plan contains changes, show it once and proceed without asking for installation approval. Invoking this workflow authorizes routine bootstrap of the required Node runtime, CLI, Pi, Recipes, and detected-host plugin through the reviewed setup path.

Run `introspection setup --yes` and follow the exact command to a terminal exit status. A returned session, process, cell, or job handle—or output that merely says installation began—is still in progress: poll the same handle until it exits. After exit zero, rerun `introspection setup --check` and continue only when it reports no required changes. Do not install or update Pi, Recipes, or host plugins piecemeal around setup.

`introspection init` scaffolds a recipe after setup is ready. It is not a prerequisite installer or repair command.

## Think like an agent builder

Clarify the job before designing the agent. A strong first version owns one meaningful outcome for one accountable user. Representative cases are the working specification: use them to discover required judgment, evidence, side effects, and boundaries.

Do not add tools, skills, subagents, or elaborate evaluation infrastructure because they are available. Add each only when an approved case requires it. Prefer a small system whose behavior and failure boundary can be explained.

## Choose the starting point

Open by asking what sort of agent the user wants to build. That is the only thing the workflow cannot proceed without, and the one question they arrive already able to answer. Ask it on its own and wait; do not stack a second question behind it.

Their first answer will be a sentence, not a specification, so step them through the job from there — a short interview of a few focused questions, one round at a time, each one narrowing what the agent owns. Never present them as a numbered list or a form; ask, listen, and let the next question follow from the last answer. The Evals capability owns what to ask about behavior; this skill owns keeping it short and conversational.

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

Name the catalog repository itself, such as `template-starter`, rather than the bare key or a URL: the template option takes the repository name, and the CLI resolves it within the catalog organization.

A template also carries a scaffolded model-access mode in its Introspection manifest — managed gateway or the user's own provider account — which is inherited input in the same way its model is. Leave the default in place for local proof, but surface the choice before handing off to deployment rather than letting the scaffold settle it silently.

Which route obtained the template decides who rewrites its identity. When the scaffolding verb fetched it, adoption is part of that verb: it drops the template's history and origin, removes its runtime manifest, writes a new one under the agreed slug with the package path rebased for wherever the recipe landed, and renames the package. Read the result back, but do not rewrite it — re-authoring the manifest is how a correct package acquires a stale path or a second manifest, and two manifests are ambiguous at deploy.

When the template arrived by ordinary Git, none of that happened and the rename is yours: the package name, the runtime manifest and its filename, and anything else naming the template must move to the agreed slug before the recipe is proven. A recipe still carrying the template's runtime name will claim that name at deploy, where it is reserved per project.

A template may be private. That is an access question rather than a capability question: the fetch uses whatever Git credentials the user already has, so no new authentication belongs in this workflow. When a private template cannot be reached, report it as access and let the user resolve it, rather than substituting a different template or asking them for credentials.

Catalog templates are licensed, so preserve their `LICENSE` and attribution. That holds for the starter too: every recipe begins as someone else's template, and starting from one is not the same as authoring the package.

Do not treat an ordinary application repository as an existing agent. Route to `migrate` only when an agent implementation exists and the user wants its approved behavior preserved.

This skill owns an agent up to its first locally proven version. Changing one that already exists — adding a tool, skill, capability, or MCP server to it, or altering how it behaves — is `improve`, even when the request is phrased as building something new. Resolve which case you are in before scaffolding.

Writing application code that calls a deployed runtime is not agent creation, even though "build" reaches this skill. When the user wants a backend, service, or product surface that runs tasks for their end users, route to `operate`, which owns that boundary, rather than scaffolding a recipe.

Once the user has reached for a template, prefer a source they supplied. Otherwise let the Recipes capability resolve a small credible set of catalog candidates against the required job, capabilities, provider requirements, license, and adaptation cost. Present the resolved candidates as selectable options, each naming its inherited behavior, required and optional capabilities, provider, and license, so the choice is informed rather than a list of titles. Let the user select the source and an owned repository-local destination. Do not install, customize, or copy a template before confirmation.

When candidate resolution fails, name the key that failed and ask the user for an explicit source. Do not dead-end the workflow, and do not name candidate templates from memory.

## Understand the job

Inspect relevant repository context and nearby recipes without changing anything. Learn who invokes the agent, what triggers it, what result it promises, what sources it may trust, what it may change, and when it must stop or ask for help. When starting from a template the user brought, distinguish behavior worth retaining from example behavior that must be removed or replaced.

Continue the interview the opening question started, in small rounds rather than one dense block, and only for what the starting point did not already settle. Where a question reduces to known alternatives — who invokes it, what it may change, when it must stop — offer them through the host's structured selection affordance, always leaving a path for an answer you did not anticipate.

Develop a small varied acceptance set with the user. Cover ordinary work, ambiguity, missing access, partial failure, and a request that should be declined. Use concrete good and bad outcomes to resolve vague requirements. Let the Recipes capability resolve the portable package and provider/model choices that affect it, and the Pi capability resolve harness, extension, provider, and local execution behavior. Defer tool upgrades, setup, and authentication until an approved execution step actually needs them; the Introspection CLI is the exception, and the Recipes capability resolves it up front so it is available in this and later shells.

Treat any model written by a scaffold or template as inherited input, not an approved provider decision. Resolve it explicitly before editing the recipe. If the request and repository do not establish a safe choice, pause for that decision instead of silently retaining the placeholder.

## Align with the user

Share what you learned, the agent you intend to build, how its representative cases will prove the promise, and any consequential choices or unresolved assumptions. When a template the user brought is the starting point, include its source, license, provider and capability requirements, retained behavior, expected customization, and owned destination. Present this in the clearest natural form for the situation; do not force a standard brief or checklist onto the user. Use the host's structured selection affordance for a discrete choice among known alternatives, and prose for genuinely open-ended questions such as the outcome the agent should own.

Ask for confirmation before changing project files or configuration. Treat confirmation as approval to build and prove the agreed local recipe in one continuous pass. Routine local bootstrap is already authorized by invoking this workflow and is not part of this confirmation gate. Pause again only when a newly discovered dependency, side effect, provider choice, or product decision materially changes the agreed recipe work.

## Build and prove

Resolve the real package root and use the Introspection CLI to build the smallest recipe that satisfies the approved cases:

- Treat a returned session, process, cell, or job identifier as an in-progress command, not a result. Follow that same handle until a terminal exit status is available before starting a dependent mutation or reporting success. Serialize commands that mutate the same installation, cache, recipe, or worktree. After a nonzero exit, preserve the exact invocation and working directory, inspect focused help or read-only state, and change the hypothesis before retrying; never repeat the same mutation unchanged.
- Scaffold with the Introspection CLI's `init` verb rather than hand-authoring package files. It writes the recipe directory and its manifest as one unit, and initializes a Git repository when run outside one, which establishes the worktree that deployment later requires. Setup must already be ready; do not use `init` to install or repair prerequisites.
- Pass the agreed recipe slug as the name argument. Running the verb bare makes it prompt interactively for a recipe name, which stalls a non-interactive shell and takes the naming decision out of the dialog where it was already settled. The slug is the verb's only positional: it becomes the package name, the directory, and the manifest filename stem. The template is a separate named option whose value is the catalog repository, so there is no second positional and no key that differs from the repository. Help states the default template but does not enumerate the catalog, so resolve the available templates from the catalog source rather than expecting a list from help.
- Expect the scaffolded agent to be named `agent`, the recipe spec's default, rather than named after the recipe. Confirm it from the generated agent YAML instead of assuming, since a recipe may hold more than one agent and any of them can be renamed. Rename it only if the user asks, and treat that as an ordinary edit to its YAML.
- The verb always creates its own subdirectory beneath the working directory and refuses to merge into a path that already exists, so the decision that matters is which directory it runs in: outside a repository the recipe becomes its own repository, and inside one it becomes a subdirectory whose manifest lands at the repository root.
- When the template has to be obtained with Git instead, use the Recipes capability to customize it into the approved output path. Keep the new recipe's history its own: a clone carries the template's commits and its origin, and neither belongs to the user's agent. Creating a new GitHub repository is outside this local workflow.
- Confirm the recipe's identity is the agreed slug before proving anything by reading the files back — rewriting it yourself only when the template came from ordinary Git rather than the scaffolding verb. The package name and the local runtime manifest are the two that matter, because they are what deployment later claims. Preserve required attribution and license files while doing it. Treat the template as a starting point, not proof that the customized agent is correct.

Default to one agent. Put judgment in skills, deterministic behavior in scripts and tests, and external access behind explicit capabilities. The owned package path is the source of truth: a recipe is an ordinary Git-backed source package, with no separate install store to register it in.

Preserve the recipe composition model. Put instructions shared across the root agent and delegated subagents in `SYSTEM.md`; put specialized role instructions in each agent's `system_instructions`. Use `from:` when a variant or subagent genuinely inherits a base configuration, and make capability overrides explicit because `tools`, `skills`, and `subagents` arrays replace rather than merge. Keep reusable detailed judgment in skills selected by the agents that need it.

Prove one credible ordinary happy path first in a fresh Pi process. Only after the basic runtime works should you exercise the smallest additional approved cases needed to support the claimed behavior and important boundaries. Record unexecuted cases as planned coverage and never describe them as proven. Keep the evidence needed to explain what worked, what failed, and why. Fix the owning layer rather than accumulating prompt instructions. Once repeatable checks are credible, offer the user the Pi TUI so they can try the agent and continue iterating with them until the local version is accepted or a concrete blocker remains.

## Hand off

Explain what the agent now does, the evidence behind it, known limits, and the resolved package path and agent name. Give the actual local command:

```text
Try locally:
introspection local --agent <agent>
```

Give the local command as the CLI's own run verb rather than a raw Pi invocation. The verb resolves the local runtime manifest and launches Pi itself, so it keeps the single developer surface the user already has installed and does not require them to know a second command or where the package root sits. Confirm its flags from help before handing them over. Keep Introspection options before the argument separator and Pi arguments after it; do not invent a prompt flag. Resolve manifest discovery separately from process working directory: `--work-dir` changes where Introspection searches for manifests, while Pi inherits the directory from which the CLI was invoked.

Use the deploy skill to publish it. Omit `--agent` only for one unambiguous default agent. Do not deploy when the approved output is not inside a Git worktree, and explain that boundary. Invite the user to request another iteration.

## Firm boundaries

- Do not edit project files or configuration before confirmation.
- Do not silently switch providers, models, package managers, installation methods, or authentication.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command, apart from the Introspection CLI, which every path through this workflow needs.
- Explain and perform routine runtime or tooling bootstrap when the workflow needs it; do not ask whether to install required local tooling. Stop only at the concrete bootstrap blockers defined by the Recipes capability.
- Do not silently choose a template or imply that customization removes its license obligations.
- Do not read or expose credentials.
- Do not commit, push, open a pull request, register a runtime, change bindings, or deploy in this workflow.
