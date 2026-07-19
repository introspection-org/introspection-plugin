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
2. **Create the automation.** In the current phase this is guided: send the
   user to the Automations page of their Introspection project with the exact
   values to enter (runtime, agent name, cron expression, prompt). Do not
   invent an API path for this — programmatic creation is a tracked phase-2
   item, and this command will be upgraded to do it directly when that lands.
3. **Delivery.** If the user wants results in Slack, point them at connecting
   the Slack integration for the project; the scheduled agent's updates then
   flow through the existing channel path.
4. **Confirm.** Recap what will run, when, and where results will appear.
