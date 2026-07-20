---
name: recipes
description: Provide Pi and Pi Recipes expertise for focused vertical-agent work, including recipe contracts, structure, capabilities, package layout, toolchain readiness, and local Pi proof. Use inside Introspection create, migrate, improve, and deploy workflows, or for a narrowly scoped recipe question.
---

# Recipes

Build the smallest agent that can reliably own one vertical job. Keep Introspection platform mechanics in `$introspection:introspection` and evaluation design in `$introspection:evals`.

## Exercise agent-building judgment

Treat correctness as the floor. A useful agent must also be understandable, appropriately scoped, and trustworthy in the conditions where people will rely on it.

- Understand the job before choosing the architecture. Name the accountable user, trigger, promised outcome, evidence, permitted side effects, and escalation boundary.
- Prefer representative examples over abstract requirements when the two disagree. Examples reveal what “good” means, where judgment is required, and which shortcuts are unacceptable.
- Start with one agent. Add tools, skills, scripts, subagents, or model specialization only when a concrete requirement earns their complexity.
- Put durable judgment in instructions or skills. Put deterministic guarantees in code and tests. Do not ask a model to improvise what software can enforce exactly.
- Withhold capabilities for absolute prohibitions. Prose is guidance, not a security boundary.
- Treat failures as evidence about the system, not automatic invitations to make the prompt longer. Find the earliest meaningful divergence and fix the owning layer.
- Preserve uncertainty. Escalate when the promised outcome cannot be proven instead of manufacturing confidence.
- Never invent evidence, access, counts, traces, test results, or validation. Keep proposed cases clearly hypothetical until they have actually been run.
- Prefer local proof before platform machinery. Keep the recipe small enough that another engineer can understand why it works and where it may fail.
- Ask as little as possible. Discover what the repository and evidence can answer, make reversible assumptions when the path is obvious, and ask a focused question only when the answer materially changes the contract or side effects. Do not turn discovery into an intake form.

Read [vertical-agents.md](references/vertical-agents.md) when choosing boundaries or reviewing agent quality.

## Use current Pi and Recipes behavior

Before recipe work, resolve the installed Pi version with `pi --version` and the installed `@introspection-ai/pi-recipes` version through the package manager that owns the `recipes` executable; the Recipes CLI has no version flag. Resolve the latest stable releases from the current official documentation and registry or installation source named by those docs.

If either is behind, proactively upgrade it with the canonical command for its detected installation method, then repeat version resolution and run a safe recipe-aware smoke in a fresh Pi process. This recognized-toolchain refresh is preflight and does not require a separate approval stop. Do not silently switch package managers or installation methods. Stop if the upgrade requires elevated privileges, would replace an unrecognized development build, changes authentication or user configuration, or fails. Do not reinstall a current toolchain.

Read only the documentation relevant to the work:

- Start at [`pi.dev/docs`](https://pi.dev/docs/latest). Use Quickstart for installation and first authentication, Using Pi for TUI and CLI behavior, Providers for model authentication, Settings for configuration scope, and Extensions, Skills, Prompt Templates, or Pi Packages for customization. Use the corresponding source in [`earendil-works/pi/packages/coding-agent/docs`](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/docs) when rendered docs are unavailable or an exact current detail matters.
- Read the installed Pi Recipes docs or [`introspection-org/pi-recipes/docs`](https://github.com/introspection-org/pi-recipes/tree/main/docs). Use `recipe-flow.md`, `recipe-cli.md`, and `pi-extension.md` for the core lifecycle. Load `interactions.md`, `mcp-auth.md`, `recipe-evals.md`, or `deployment-configuration.md` only when that concern is in scope.
- Use [`docs.introspection.dev/llms.txt`](https://docs.introspection.dev/llms.txt) only for Introspection platform work such as connecting or deploying a proven recipe.

Inspect the target repository and nearby recipes before proposing structure. Confirm exact flags with focused `pi --help`, `recipes --help`, and command-specific help after reading the owning docs. Current docs, latest stable releases, installed CLI help, and repository schemas override this skill. Do not infer Pi behavior from another host or reproduce brittle command catalogs here.

## Establish the contract

Make the agent's promise concrete enough to judge. Use real examples when available; otherwise create varied representative cases. Seek the domain owner's interpretation of good and bad outcomes, including ambiguity, missing access, partial failure, and a case the agent should decline. Capture required evidence, allowed assumptions, source authority, and unacceptable shortcuts.

Use `$introspection:evals` to choose the cheapest trustworthy proof. A small approved acceptance set is enough to begin; do not turn an early prototype into a benchmark program without evidence that it needs one.

## Choose only structure that earns its cost

- Keep the root instruction short and route deeper judgment through progressively loaded skills.
- Use scripts for repeatable deterministic operations.
- Add a subagent only for an independent context boundary with a clear input and output.
- Expose only the capabilities required by the contract.
- Prefer repository-local, portable configuration over hidden global state.

## Prove the recipe locally

Preflight Pi, recipe-extension loading, the selected provider, and required capabilities. Never read, print, copy, or parse raw credential files or secret values. An environment-variable name, configured provider, or model-catalog entry is not proof of authentication. Prefer a supported redacted status check; if none exists before approval, mark authentication unverified and use the first approved minimal model call as proof. Treat sandbox permission and settings-lock failures as inconclusive rather than evidence that an extension is absent.

Resolve the actual recipe package root and run it directly by path. Do not require global registration for local proof. Use fresh Pi sessions so previous context cannot hide loading or state problems. Retain the cases, configuration, outputs, tool evidence, and meaningful failures. Iterate on the owning layer until the contract is proven or a concrete blocker remains.

Offer an interactive Pi TUI run once repeatable checks are credible. Confirm commands from current help and use a path valid from the user's current directory. Include `--agent <agent>` when the package does not have one unambiguous default.

## Firm boundaries

- Do not silently change provider, model, package manager, installation method, or authentication.
- Do not expose credentials or treat configuration as successful authentication.
- Do not add architecture that no approved case requires.
- Do not claim readiness from a recipe check alone; prove representative behavior in a fresh session.
- Let the calling workflow own confirmation, Git, pull-request, and deployment boundaries.
