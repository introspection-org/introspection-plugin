---
description: Build a custom managed agent from a prompt — interview, scaffold a Pi recipe repo, commit, publish, and wire it up to Introspection
argument-hint: <describe the agent you want, e.g. "an email agent that drafts replies and sends me a morning priorities summary">
---

Build a custom agent for the user from this prompt:

> $ARGUMENTS

Follow the `agent-builder-flow` skill end to end — it defines the whole flow
(preflight → interview → scaffold → validate → review/commit →
publish/wire-up → first run → wrap-up) and the hard rules.

Delegate the interview, scaffold, and validate steps to the `builder` agent;
you own the commit, publish, wire-up, and first-run steps and **all user
confirmations** — nothing is committed, pushed, published, or registered
without the user approving what they've seen.
