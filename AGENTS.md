# Repository guidance

## Releases and commit messages

This repository uses Release Please and squash merges. Pull request titles become the commits on
`main`, so every pull request title and direct commit subject must follow Conventional Commits:

```text
<type>(optional-scope)!: <imperative summary>
```

Use these release-bearing types deliberately:

- `fix:` for a backwards-compatible bug fix; this requests a patch release.
- `feat:` for a backwards-compatible capability; this requests a minor release.
- Add `!` after the type or scope, and explain the break under a `BREAKING CHANGE:` footer, for an
  incompatible change; this requests a major release.
- `deps:` may be used for a dependency update that should request a patch release.

Use `docs:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:`, `style:`, or `revert:` only
when the change should not independently trigger a release. Do not disguise user-visible behavior
changes under a non-release type.

Keep the summary concise, imperative, and free of a trailing period. Prefer scopes such as
`skills`, `release`, `claude`, or `codex` when they add useful context. Examples:

```text
feat(skills): add template migration guidance
fix(codex): preserve marketplace cache identity
ci(release): validate Conventional Commit titles
feat(skills)!: rename the deploy workflow
```

Use a `Release-As: x.y.z` footer only when a maintainer explicitly requests a version override.
Never commit local Codex cachebuster versions such as `1.2.3+codex.<token>`; published manifests
must use the same clean SemVer version.

## Validation

Before handing off a change, run the relevant repository checks:

```bash
npx --yes plugins@1.3.4 discover . --target codex
npx --yes plugins@1.3.4 discover . --target claude-code
```

For release automation changes, also validate the Release Please configuration with a dry run.
