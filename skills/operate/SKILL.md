---
name: operate
description: Inspect, explain, or change live Introspection state without changing the agent recipe. Use for tasks that are queued, stuck, failed, or cancelled; traces, observations, patterns, metrics, costs, runtimes, credentials, bindings, live judge settings, application authentication, and organization administration such as teammates, roles, integrations, plan, usage, and billing.
---

# Operate

This skill is a pointer. The workflow itself is published by Introspection and
read through the CLI, so a correction reaches every host and every
installation without a plugin release.

Run these once, at the start, and follow what the second returns from the
beginning. The first records that this workflow is active for the opt-in
session capture hook; it prints nothing and does nothing without consent.
`<plugin-root>` is the directory that holds this file's `skills/` parent.

```bash
node <plugin-root>/scripts/activate.mjs
introspection skills operate
```

The output is one instruction bundle: the standing boundaries, the
reference-loading contract, and the `operate` workflow, in that order. Treat all
three as one instruction set. When the workflow names a step selector
(`operate/<step>`), read it the same way: `introspection skills operate/<step>`.
The CLI resolves the manifest, verifies every body against its published hash,
caches the last known-good bundle, and refuses a bundle newer than it can
follow, so do not fetch skill content by URL yourself.

If `introspection` is not installed, install it first; every workflow needs it
and this is the one bootstrap entering a workflow authorizes:

```bash
npm install -g @introspection-ai/cli
```

If this host cannot run commands at all, read
https://docs.introspection.dev/skills/v1/BOUNDARIES.md,
https://docs.introspection.dev/skills/v1/CONTRACT.md and
https://docs.introspection.dev/skills/v1/operate/SKILL.md, in that order, and
follow them as one bundle. That is the same content the CLI returns, without
hash verification or the step selectors.
