Set up a routine (scheduled run) for the user's managed Introspection agent.

A routine is an Introspection automation: a cron schedule that creates a task
running one of the recipe's agents. Resolve the runtime, the agent variant
(offer to add a scheduled variant to the recipe if none exists), and the
schedule; translate the schedule to a cron expression and confirm it back in
plain words. Creating the automation is guided today: send the user to their
project's Automations page with the exact values to enter. Do not invent an
API for it — programmatic creation is tracked platform work.

Request: {{args}}
