# Standing boundaries

These hold in every workflow. A skill's own `Firm boundaries` section adds to
them; nothing overrides them.

They live here, in the released and version-pinned plugin, rather than in a
fetched page. A fetched document can be corrected without a release, which is
right for knowledge and wrong for permission: a change to what an agent is
allowed to do should not reach every installation without a version behind it.

## Interfaces

- The Introspection CLI is the only interface for **operating** the platform — creating, inspecting, or changing runtimes, versions, environment pins, bindings, judges, experiments, keys, and the evidence behind them. It owns login too. Never substitute the dashboard, a browser, browser automation, a direct API call, an SDK, or database access for an operator action the CLI owns, and never on the grounds that a page would be quicker.
- Organization administration is the one exception, because it has no CLI command group at all — no members, no integrations, no plan, usage, or billing. There a browser is not a substitute but the only surface. Guide the user to the page rather than reporting the operation as unsupported.
- Operating the platform and building on it are different jobs. Application code that runs tasks for end users is an SDK integration, and shelling out to the operator CLI from a product is the mirror-image mistake. Never treat the CLI-only rule as a reason to refuse an integration.

## Tooling and bootstrap

- Do not install, upgrade, set up, or authenticate tooling before the workflow needs the corresponding command. The Introspection CLI is the sole exception: every entry path needs it, so resolve it up front.
- Entering a workflow authorizes routine local bootstrap of the required runtime, CLI, Pi, Recipes, and detected-host plugin through the reviewed setup path. Explain required changes; do not ask whether to install them.
- Stop only for a concrete unsupported path, a failed command, a host permission gate, or a recovery that would replace an unrecognized development build.
- Do not silently change provider, model, package manager, installation method, or authentication.

## What may be edited

- Build through recipe-owned agents, extensions, skills, prompts, scripts, tests, and eval references using supported interfaces. Treat Pi, Pi Recipes, Harbor, and Introspection as external platform dependencies; never edit their source repositories unless the user explicitly asks for platform contribution work.
- Do not modify Pi core for ordinary agent construction, and do not confuse Pi settings with portable recipe behavior.
- Do not encode host secrets in a recipe, or infer undocumented `from:` merges, resource grammar, or CLI flags.

## Evidence and credentials

- Do not claim readiness from a recipe check alone; prove representative behavior in a fresh Pi process.
- Never read, print, copy, or parse raw credential files or secret values. Operate on credentials by reference.
- Do not fabricate or simulate evidence, counts, statuses, or causes when access is unavailable. State what remains unverified and what you would gather.

## Routing

Route by what the request ends in: a new recipe is `create`, an existing agent
ported into one is `migrate`, changed agent behavior landed through the
repository is `improve`, a change to what an environment resolves to is
`deploy`, and an answer or a changed live resource that leaves the recipe alone
is `operate`. Name the workflow you hand to; never stop at a mutation boundary
without one.
