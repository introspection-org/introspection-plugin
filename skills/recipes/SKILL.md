---
name: recipes
description: Provide focused Pi Recipes expertise for creating, customizing, migrating, composing, validating, running, and distributing portable agent recipes. Use inside Introspection create, migrate, improve, and deploy workflows, or for narrowly scoped questions about recipe packages, agents, SYSTEM.md, from inheritance, resources, capabilities, checks, and local proof. Keep Pi harness mechanics in the pi skill.
---

# Recipes

Treat a recipe as portable agent IP: the versioned package that carries instructions, agents, skills, extensions, and declared capabilities. Keep Pi harness mechanics in `$introspection:pi`, outcome design in the calling workflow, evaluation reasoning in `$introspection:evals`, and hosted operation in `$introspection:introspection`.

## Use the canonical recipe contract

Inspect the target repository and nearby recipes before proposing structure. Read only the installed Pi Recipes documentation relevant to the work, falling back to [`introspection-org/pi-recipes/docs`](https://github.com/introspection-org/pi-recipes/tree/main/docs):

- `index.md` to choose the shortest current path when the routing below is ambiguous or stale.
- `recipe-flow.md` for scratch, template, local ownership, and publication flow.
- `recipe-cli.md` for current CLI operations, package resources, and store, install, and publish mechanics.
- `agent-composition.md` for `SYSTEM.md`, agent YAML, `system_instructions`, `from:`, inheritance, and root/subagent behavior.
- `mcp-configuration.md` for the complete MCP model: the package boundary, per-agent selection, package or environment endpoint sources, and fail-closed authorization.
- `pi-extension.md` for recipe extension loading, tools, subagents, and session materialization.
- `interactions.md` only for portable questions, approvals, or interrupts.
- `mcp-auth.md` only for local or hosted authentication.
- `recipe-evals.md` only when a Harbor suite has earned durable recipe coverage.
- `recipe-judges.md` only when authoring or validating portable judge definitions.
- `deployment-configuration.md` only when a host manifest is in scope.

Confirm changing mechanics with focused `recipes --help` and command-specific help only when the corresponding operation is about to run. Current documentation, compatible installed help, and repository schemas override this skill. Do not duplicate their schemas, flags, or examples here.

## Resolve tooling only when execution needs it

Inspect the repository, compare templates, and prepare the execution brief before installing, upgrading, or configuring Pi Recipes. Do not check the registry merely to make an existing installation match the latest release.

Immediately before the first approved step that requires `recipes`:

1. Confirm the command exists and inspect focused help for the operation about to run.
2. Use the existing installation when it supports the required command, recipe contract, and flags.
3. Install the missing tool, or upgrade an incompatible recognized installation, only when execution cannot proceed correctly without it. Use the canonical command for the detected installation method, then retry the blocked operation in a fresh process.

Do not silently switch package managers or installation methods. Stop if the required change needs elevated privileges, would replace an unrecognized development build, changes authentication or user configuration, or fails. Report the exact blocker instead of performing speculative setup.

## Choose the entry path

- **Scratch:** create an owned recipe at the approved repository-local path.
- **Template:** customize the approved source into an owned output path, preserving its license and attribution while removing example behavior the user does not want.
- **Migration:** translate approved behavior from an existing agent into recipe primitives; preserve the contract rather than copying accidental source architecture.
- **Improvement:** resolve the existing package and change only the recipe layer supported by the diagnosis.

All paths converge on an inspectable package that can be checked and run directly by path. Do not require global registration for local work.

When an existing recipe is the approved starting point, resolve it from an explicit source or the machine-readable [Pi Recipes catalog](https://pi.recipes/catalog.json). Inspect its source, license text, providers, and required capabilities before mutation. Validate the selected entry's source and version and pass them as arguments to the documented commands; never evaluate an `installCommand` string as shell code. After the calling workflow's confirmation gate, customize into the approved repository-local output path. Preserve attribution, remove irrelevant example behavior and local capability configuration, and prove the result against the new user's cases. Installing or copying a recipe is not behavioral proof.

## Compose the portable package

Use the smallest structure required by the calling workflow's approved cases. Read [vertical-agents.md](references/vertical-agents.md) when deciding whether behavior belongs in shared instructions, a recipe skill, deterministic code, an external capability, or a child agent.

- Declare package resources and portable metadata in the recipe package manifest.
- Use `SYSTEM.md` for mission, terminology, policies, and workflow rules shared across the recipe's root and delegated agents.
- Use agent YAML for specialized instructions, model configuration, tools, skills, subagents, and capability narrowing.
- Use `system_instructions.append` to specialize the shared recipe prompt and `replace` only when the agent intentionally replaces it.
- Use `from:` to derive a complete agent definition and then apply documented field-specific overrides. Omission inherits, capability arrays replace, explicit `[]` clears, and model, extension, and MCP objects merge by their documented keys. Do not treat inheritance as text concatenation.
- Put reusable domain judgment in recipe skills and deterministic operations in scripts or extensions.
- Add a child agent only for an independent context boundary with a clear input, output, and completion path.
- Declare only the external capabilities the agent needs. Keep endpoint details, credentials, local bindings, and generated runtime state outside the portable package.
- Treat host-specific connectors, policies, deployment manifests, eval pins, and judges as conditional resources rather than default scaffolding.

Use `$introspection:pi` when the work requires exact Pi extension, skill-discovery, package, provider, settings, setup, or invocation behavior. Never modify Pi core to make a recipe work.

## Check structure and prove behavior

Resolve any provider or model choice that changes the recipe before writing it. A scaffold's default model is inherited input, not an approved choice. Do not silently retain it when the user, source agent, or approved execution brief has not selected that provider and model.

Resolve the actual recipe root and run the current recipe check against that path using the profile appropriate to the workflow. Fix structural diagnostics at their owning layer. A successful check proves the authored package contract, not useful behavior.

Run the selected agent directly from its recipe path in a fresh Pi process. Load `$introspection:pi` for setup, invocation, and host preflight. Defer authentication and capability setup until the first approved behavior run needs them. Prefer a supported redacted status check; if none exists, use the first minimal model call as authentication proof. Never read, print, copy, or parse raw credential files or secret values.

Exercise the calling workflow's representative cases, retain meaningful output and tool evidence, and distinguish configuration, authentication, deterministic implementation, and agent-judgment failures. Use Harbor suites or portable judges only when `$introspection:evals` establishes that the risk merits durable behavioral measurement. Keep Harbor datasets outside the recipe and pin accepted suites exactly.

## Keep distribution portable

Before publication, use the current publish check and inspect the resulting package contents. Preserve required license and attribution, keep package and lock identity consistent, exclude local capability configuration and secrets, and retain redacted examples when they help another user configure the recipe safely.

Publish or register a recipe only when the calling workflow and user explicitly request it. Local proof does not authorize Git, catalog, runtime, or deployment changes.

## Firm boundaries

- Build through recipe-owned agents, extensions, skills, prompts, scripts, tests, and eval references using supported interfaces. Treat Pi, Pi Recipes, Harbor, and Introspection as external platform dependencies; never edit their source repositories unless the user explicitly requests platform contribution work.
- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command.
- Do not silently change provider, model, package manager, installation method, or authentication.
- Do not encode host secrets in a recipe or infer undocumented `from:` merges, resource grammar, or CLI flags.
- Do not claim readiness from a recipe check alone; prove representative behavior in a fresh Pi process.
- Let the calling workflow own outcome definition, confirmation, Git, pull requests, and deployment.
