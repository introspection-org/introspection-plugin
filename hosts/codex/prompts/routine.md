Set up a routine (scheduled run) for the user's managed Introspection agent.

A routine is an Introspection automation: a cron schedule that creates a task
running one of the recipe's agents. Resolve the runtime, the agent variant
(offer to add a scheduled variant to the recipe if none exists), and the
schedule; translate the schedule to a cron expression and confirm it back in
plain words. Create it through the public `POST /v1/automations` API (trigger_type
"cron", cron_schedule, prompt, and metadata.runtime_group_id) when the user
holds a credential with automations:write; otherwise guide them through
their project's Automations page with the exact values to enter.

Request: {{args}}
