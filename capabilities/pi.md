# Pi

Treat Pi as an extensible agent harness. Keep portable agent packaging in the [Recipes capability](recipes.md), outcome design in the calling workflow, and hosted operation in the [Introspection capability](introspection.md).

## Load references

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

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

Keep extensions narrow. Register deterministic behavior in code and keep domain judgment in instructions or skills. Avoid global state when project-local configuration or package resources can express the behavior. Treat settings, extensions, skills, and packages as distinct scopes; confirm precedence and discovery from the current documentation instead of guessing.

## Operate Pi locally

Resolve the intended working directory, package or recipe path, selected agent, provider, and configuration scopes before launching. Use focused help for the intended mode and flags. Prefer a fresh process when proving extension loading or behavioral changes so prior sessions cannot hide state.

Never read, print, copy, or parse raw credential files or secret values. A configured provider or environment-variable name is not proof of authentication. Use a supported redacted status surface when one exists; otherwise let the first approved minimal model call establish authentication.

Return the exact invocation that was used, the relevant loaded extension points, and any unresolved host-specific assumptions to the calling workflow.

## Firm boundaries

- Do not modify Pi core for ordinary agent construction.
- Do not install, upgrade, set up, or authenticate Pi before the workflow needs the corresponding command.
- Do not silently change provider, model, package manager, installation method, or authentication.
- Do not confuse Pi settings with portable recipe behavior.
- Let the Recipes capability own recipe manifests, agent composition, capabilities, validation, and distribution.
