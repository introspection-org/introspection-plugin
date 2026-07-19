---
description: Run a prompt on one of your managed Introspection runtimes and show the result
argument-hint: <prompt to send, optionally starting with the runtime name, e.g. "email-assistant: draft a reply to the latest thread">
---

Run a prompt on a managed Introspection runtime:

> $ARGUMENTS

1. If the `mcp__introspection__task_run` tool is unavailable, stop and point
   the user at the Auth section of the plugin README (`INTROSPECTION_MCP_URL`
   and `INTROSPECTION_TOKEN` must be set).
2. Determine the runtime: if the arguments start with `<runtime-name>:`, use
   that. Otherwise, if the current directory is a recipe repo, default to its
   recipe name. Otherwise ask the user which runtime to use.
3. Call `mcp__introspection__task_run` with the prompt and `runtime`. The
   server resolves the runtime name to its latest ready deployment.
4. Poll the returned task handle (`tasks/get`) until it reaches a terminal
   state, then fetch `tasks/result` and present the agent's answer. If the
   result is not ready yet (retryable not-ready error), keep polling briefly
   rather than reporting failure.
5. On failure, show the task status and error verbatim — do not paper over it.
