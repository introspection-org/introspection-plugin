---
description: Attach a schedule ("routine") to your managed agent — e.g. a daily morning brief
argument-hint: <schedule and what it should do, e.g. "every weekday at 7am, send my priorities summary">
---

Set up a routine for the user's managed agent:

> $ARGUMENTS

A routine is an Introspection **automation**: a cron schedule that creates a
task running one of the recipe's agents, with results delivered to the
project's channel (e.g. Slack) and visible in the product UI.

1. **Resolve the pieces.** Which runtime, which agent within the recipe (a
   scheduled variant like `daily-brief` if one exists — offer to add one via
   the recipe repo if not), and the schedule. Translate the user's phrasing
   into a cron expression and confirm it back in plain words ("weekdays at
   7:00 in your timezone").
2. **Create the automation.** Routines are created through the **public
   `POST /v1/automations`** API (a control-plane resource) with a credential
   carrying `automations:write` — a member session. When the user has such a
   credential available, create it directly: body `{"name", "trigger_type":
   "cron", "cron_schedule", "prompt"}` with `?project=<slug>` and
   `metadata.runtime_group_id` set to the runtime group (find it via
   `mcp__introspection__list_runtimes`). Confirm the returned
   `next_trigger_at` back in plain words. Otherwise, guide the user through
   the Automations page of their Introspection project with the exact values
   to enter. Do not route this through internal endpoints — CP resources are
   public-API-or-UI only.
3. **Delivery.** If the user wants results in Slack, point them at connecting
   the Slack integration for the project; the scheduled agent's updates then
   flow through the existing channel path.
4. **Confirm.** Recap what will run, when, and where results will appear.
