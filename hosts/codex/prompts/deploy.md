Publish the current Pi recipe repo and wire it up as a managed Introspection
runtime.

Read `~/.codex/introspection/core/skills/platform-onboarding/SKILL.md` and
follow it: validate with `recipes check`, help the user commit, publish with
`recipes publish` (private by default, after user confirmation), ensure the
`.introspection/<name>.yaml` manifest exists, connect via the staged GitHub
wire-up (`gh` path first, product UI fallback), and verify with a smoke
`task_run` once the runtime is ready.

Target: {{args}}
