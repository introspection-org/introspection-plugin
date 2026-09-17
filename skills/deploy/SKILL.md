---
name: deploy
description: Deploy, stage, promote, release, roll back, or restore an Introspection agent recipe version. Use when the requested outcome changes which version an environment serves, including creating or verifying its runtime and configuring bindings required for that deployment.
---

# Deploy

This skill is a pointer. The workflow itself is published by Introspection and
read through the CLI, so a correction reaches every host and every
installation without a plugin release.

Run these once, at the start, and follow what the second returns from the
beginning. The first records that this workflow is active for the opt-in
session capture hook; it prints nothing and does nothing without consent.
`<plugin-root>` is the directory that holds this file's `skills/` parent.

```bash
node <plugin-root>/scripts/activate.mjs
introspection skills deploy
```

The output is one instruction bundle: the standing boundaries, the
reference-loading contract, and the `deploy` workflow, in that order. Treat all
three as one instruction set. When the workflow names a step selector
(`deploy/<step>`), read it the same way: `introspection skills deploy/<step>`.
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
https://docs.introspection.dev/skills/v1/deploy/SKILL.md, in that order, and
follow them as one bundle. That is the same content the CLI returns, without
hash verification or the step selectors.
