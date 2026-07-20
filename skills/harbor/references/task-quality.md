# Harbor task quality

## Fairness

The instruction, environment, and verifier must describe the same task. Any behavior required for reward must be inferable from the instruction or normal domain conventions. Do not grade hidden preferences.

Allow any valid strategy. Verify durable outcomes such as files, tests, service behavior, or persisted state rather than a command transcript.

## Isolation

The starting environment contains only legitimate inputs. Hidden tests, expected outputs, and the reference solution must not be readable by the agent. Avoid secrets and ambient host state.

Pin images and dependencies. Make service readiness explicit. If external access is unavoidable, distinguish its failures from task failures.

## Verifier discipline

The verifier must:

- terminate on every path
- emit a valid reward on every path
- explain failures sufficiently for maintainers
- resist hardcoded outputs and accidental leakage
- fail the untouched environment for a meaningful reason
- pass the real reference solution from a clean start

Prefer multiple independent assertions over one brittle text comparison.

## Diagnose results

A failed agent run is meaningful only after the environment started, inputs were present, the agent received the intended instruction, and verification completed. Preserve these distinctions in result analysis:

- infrastructure failure
- task-definition failure
- agent capability failure
- nondeterministic or inconclusive run

Repeat noisy tasks and report variance. Do not turn infrastructure recovery into an agent benchmark unless that recovery is the capability under test.
