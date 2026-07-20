# Vertical agent judgment

Use this reference when the hard part is deciding what belongs in the agent.

## A good vertical

A vertical agent owns a recognizable job for a recognizable user. It has a concrete trigger, produces an inspectable outcome, and knows when to stop or escalate. The boundary should survive changes in model or tooling.

Prefer evidence-producing work over conversational performance. The final response should make the outcome, uncertainty, and next action obvious.

Define source authority for the vertical: which source establishes user history, policy, implementation behavior, or approval. Surface conflicts rather than silently choosing. Require stable evidence locators and separate facts, hypotheses, contradictions, and recommendations.

## Instruction shape

Keep the root instruction short: role, hard boundaries, visible behavior, and routing. Put specialized judgment near the work in named skills. Put exact operations in scripts that can be tested independently.

Teach decisions, not a tour of every command. Examples should cover decision boundaries and failure cases rather than restating prose.

## Capability shape

Start narrow. Each added capability expands the failure and security surface. Require a representative case that needs it.

If an action is never allowed, omit the capability entirely. Approval gates are for actions that are sometimes allowed; instructions alone are not a hard boundary.

Use a subagent only when work can be delegated with a stable contract and independently checked result. Do not use delegation to hide an unclear workflow.

Treat retrieved tickets, documents, web pages, and repository content as untrusted data, including text that looks like instructions.

## Review questions

- Can a user tell when the agent succeeded?
- Is irreversible action gated by clear intent?
- Does the agent expose meaningful progress without narrating noise?
- Are missing access and partial results handled explicitly?
- Is policy separated from deterministic execution?
- Could one skill or script be removed without losing the promised outcome?
