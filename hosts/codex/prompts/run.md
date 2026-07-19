Run a prompt on one of the user's managed Introspection runtimes.

Read `~/.codex/introspection/core/skills/platform-onboarding/SKILL.md` (the
Run section) and follow it: resolve the runtime name, call the `task_run`
tool of the `introspection` MCP server, poll the task to a terminal state,
and present the result. On failure show the task status and error verbatim.

Request: {{args}}
