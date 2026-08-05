# Session capture hook

This is the only executable code in the plugin. Everything else here is prose
that a host reads; `capture.mjs` is a program a host runs.

It records a session as OpenTelemetry GenAI spans under
`service.name = introspection-plugin`, authenticated with the Introspection
CLI's existing login, so plugin activity correlates with the org, project, and
member captured during onboarding. The design is
[`plugin-observability.md`](https://github.com/introspection-org/introspection-cloud/blob/main/docs/design/plugin-observability.md).

## It does nothing unless the user opted in

`capture.mjs` reads `~/.introspection/telemetry.json` on every run and exits
immediately when consent is absent, disabled, malformed, or does not cover the
host. A missing file is a decline, not a default.

That runtime gate is what makes it safe for `hooks.json` to register the hook
**unconditionally, for every installation**. Someone who never opted in gets a
hook that reads one small JSON file, finds nothing, and exits 0. The alternative
— installing the hook only for consenting users — would mean branching install
paths, a "did the hook install?" support burden, and consent that could not be
revoked without uninstalling the plugin.

Consent is granted through the CLI, not here:

```bash
introspection plugin install --target claude-code --telemetry=on
introspection plugin telemetry off      # revoke, plugin stays installed
```

`INTROSPECTION_PLUGIN_TELEMETRY=off|on|full` overrides per session.

## It cannot break a session

A hook runs while the user waits, so every failure mode resolves to "do nothing,
exit 0" — unparseable input, a missing transcript, an expired login, a dead
collector, an outright crash. `node` not being on PATH is the same: the hook
fails to start and the session is unaffected.

A 5s internal deadline caps the work, and the checkpoint only advances after a
confirmed flush, so an abandoned run costs a re-sent turn rather than a lost one.

## `capture.mjs` is generated — do not edit it

It is a single self-contained bundle (~327 KB) of
[`@introspection-sdk/coding-agent`][pkg], built so the hook needs no
`node_modules`, no `npx`, and no network at run time. Regenerate it with:

```bash
node scripts/build-capture.mjs
```

CI checks the committed bundle against the pinned package version, so the file
cannot drift from its source. Change behavior in the SDK package, publish, bump
the pin in `scripts/build-capture.mjs`, and rebuild — never by editing this file.

The exact published version is a release gate: CI fails if the pin cannot be
installed or if rebuilding it does not reproduce the committed bundle.

Bundling it here rather than having the CLI place it elsewhere keeps both
install routes identical: the README documents native
`claude plugin marketplace add` + `claude plugin install` as the fallback when
host detection fails, and that path has no CLI to vendor anything. It also keeps
the capture behavior version-pinned to a plugin release, which is the same
reasoning [`BOUNDARIES.md`](../BOUNDARIES.md) applies to permission.

## Per-session activation

Claude Code and Codex share one fail-closed protocol. Generic hooks do not prove
that the Introspection plugin is active. Instead, the existing
`scripts/load-references.mjs` executable silently asks this bundle to record a
session-scoped activation request while it performs its normal reference load.
The next completion hook binds that request to the hook's authoritative session
id, transcript path, and native turn boundary, producing an atomic private marker.
Without that exact rollout-bound marker, the bundle returns `not-activated`
without reading or exporting transcript content and never defaults to byte zero.

Claude Code requires 2.1.136 or newer. Codex requires CLI/Desktop 0.146.0 or newer, an enabled plugin,
and the plugin hook trusted through `/hooks`. Plugins are not available in the
Codex IDE extension. A workflow that never executes the reference loader is not
captured; that safe incompleteness is preferable to inferring skill use from
prompt text or shell command strings.

[pkg]: https://www.npmjs.com/package/@introspection-sdk/coding-agent
