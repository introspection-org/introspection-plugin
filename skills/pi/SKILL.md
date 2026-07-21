---
name: pi
description: Provide focused expertise for the Pi coding-agent harness, including supported extension points, packages, extensions, skills, prompt templates, settings, providers, and local CLI operation. Use for a narrowly scoped Pi question or inside Introspection workflows that need to extend or run Pi. Keep portable recipe composition in the recipes skill.
---

# Pi

Treat Pi as an extensible agent harness. Keep portable agent packaging in `$introspection:recipes`, outcome design in the calling workflow, and hosted operation in `$introspection:introspection`.

## Resolve only the behavior the task needs

Inspect the target repository and its package metadata before assuming how Pi is installed or extended. When exact current behavior matters, start at [`pi.dev/docs`](https://pi.dev/docs/latest) and read only the relevant page: Using Pi, Providers, Settings, Extensions, Skills, Prompt Templates, or Pi Packages. Use the corresponding source in [`earendil-works/pi/packages/coding-agent/docs`](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/docs) when the rendered documentation is unavailable or implementation-level precision is required.

Do not install or upgrade Pi merely to answer a question, inspect a repository, or design a change. When an approved operation actually requires Pi, inspect the available executable, its version, and focused command help. Install or upgrade only when it is missing or demonstrably incompatible, using the canonical method for the detected installation. Do not switch package managers or installation methods. Stop before elevated privileges, replacement of an unrecognized development build, or authentication and user-configuration changes.

Current official documentation, compatible installed CLI help, and the target repository override this skill. Do not reproduce a command catalog here.

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
- Let `$introspection:recipes` own recipe manifests, agent composition, capabilities, validation, and distribution.
