# Pi

Treat Pi as an extensible agent harness. Keep portable agent packaging in the [Recipes capability](recipes.md), outcome design in the calling workflow, and hosted operation in the [Introspection capability](introspection.md).

## Load references

All content resolves by key through the plugin reference index. Read the [reference loading contract](../CONTRACT.md) before the first fetch and follow it exactly: it governs how the index is fetched, when an entry may be loaded, how `degradation` is honored when a fetch fails, and the version floor below which this plugin must stop rather than act on newer semantics. The index also carries entries no skill names; match `load_when` against the work rather than assuming the set is what this module mentions.

## Resolve only the behavior the task needs

Inspect the target repository and its package metadata before assuming how Pi is installed or extended. When exact current behavior matters, open the `pi-docs` source and read only the page relevant to the work. Use the `pi-source-docs` source when the rendered documentation is unavailable or implementation-level precision is required.

Do not install or upgrade Pi merely to answer a question, inspect a repository, or design a change. When an approved operation actually requires Pi, inspect the available executable, its version, and focused command help. Install or upgrade only when it is missing or demonstrably incompatible, using the canonical method for the detected installation. Do not switch package managers or installation methods. Stop before elevated privileges, replacement of an unrecognized development build, or authentication and user-configuration changes.

Current official documentation, compatible installed CLI help, and the target repository override this module. Do not reproduce a command catalog here.

## Extend Pi without modifying the harness

Use the smallest supported extension point that owns the requirement:

- Use a **skill** for progressively disclosed judgment and workflow guidance.
- Use a **script** for repeatable deterministic operations that do not need Pi lifecycle hooks.
- Use an **extension** for tools, commands, events, rendering, lifecycle behavior, or other programmatic harness integration.
- Use a **prompt template** for reusable user-authored prompts, not durable agent policy.
- Use a **Pi package** to distribute related extensions, skills, prompts, themes, or defaults together.
- Use scoped **settings** for host preferences that should not become portable recipe behavior.

Do not edit or fork Pi core to implement an agent. Modify the harness only when the user explicitly asks to contribute an upstream Pi change and the requirement cannot be expressed through a supported extension point.

Read the `pi-extension` page of the `pi-recipes-docs` source before writing one: it owns the registration API, how a registered tool becomes selectable by an agent, and session materialization. Nothing validates an extension's code at author time, so a guessed API passes every check and fails only when the agent runs.

Keep extensions narrow. Register deterministic behavior in code and keep domain judgment in instructions or skills. Avoid global state when project-local configuration or package resources can express the behavior. Treat settings, extensions, skills, and packages as distinct scopes; confirm precedence and discovery from the current documentation instead of guessing.

## Operate Pi locally

Resolve the intended working directory, package or recipe path, selected agent, provider, and configuration scopes before launching. Use focused help for the intended mode and flags. Keep Introspection options before the argument separator and Pi arguments after it; do not invent a prompt flag. Resolve manifest-discovery location separately from process working directory: `--work-dir` changes where Introspection searches for manifests, while Pi inherits the directory from which the CLI was invoked. Prefer a fresh process when proving extension loading or behavioral changes so prior sessions cannot hide state.

Treat a returned asynchronous handle as still running until it reaches a terminal state. Follow that same handle to completion before launching dependent work or reporting success. Serialize mutations of the same installation, cache, recipe, or worktree. After a nonzero exit, preserve the exact invocation and working directory, inspect focused help or read-only state, and change the hypothesis before retrying; never repeat the same mutation unchanged.

Never read, print, copy, or parse raw credential files or secret values. Resolve the selected agent's exact provider and model before a model-backed run, then verify that provider through a supported redacted status surface when one exists; a configured environment-variable name or credential for another provider is not proof of readiness. Otherwise let the first approved minimal model call establish authentication. Do not silently switch the recipe's provider or model to make a smoke test pass.

Return the exact invocation that was used, the relevant loaded extension points, and any unresolved host-specific assumptions to the calling workflow.

## Firm boundaries

- Do not modify Pi core for ordinary agent construction.
- Do not install, upgrade, set up, or authenticate Pi before the workflow needs the corresponding command.
- Do not silently change provider, model, package manager, installation method, or authentication.
- Do not confuse Pi settings with portable recipe behavior.
- Let the Recipes capability own recipe manifests, agent composition, capabilities, validation, and distribution.
