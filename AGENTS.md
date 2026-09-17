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

### After a release

Release Please bumps `version` in `.claude-plugin/plugin.json`,
`.codex-plugin/plugin.json`, and `stable-channel.json`. That version *is* the release signal:
Claude Code pins an installation to it and ships a new one only when it changes. Keep the two
manifests, the stable-channel document, and the marketplace entry in agreement — CI checks the
marketplace with `claude plugin tag --dry-run`, and the release workflow checks all three published
versions before advancing `stable`.

After Release Please creates `vX.Y.Z`, the release workflow creates Claude's
immutable `introspection--vX.Y.Z` tag at the same commit and fast-forwards the
`stable` branch to it. Never move `stable` by hand, force-push it, or reuse a
version tag. Marketplace installation instructions must target `stable`, not
`main`, so unreleased commits cannot be installed under the previous version.

No manual publication step is required. The compatibility floor for workflow
content is the bundle's `skills.minimum_cli_version` in
`skills-index.source.json` in `introspection-docs`, enforced by the CLI: raise
it only when an older CLI can no longer safely follow the published bundle.

## Validation

Before handing off a change, run the relevant repository checks:

```bash
node scripts/validate-skills.mjs
npx --yes plugins@1.3.4 discover . --target codex
npx --yes plugins@1.3.4 discover . --target claude-code
```

For release automation changes, also validate the Release Please configuration with a dry run.

## Skills are pointers

Every workflow body lives in `introspection-docs` under `skills/<name>/SKILL.md`
and is published as the Introspection Agent Skills bundle at
`https://docs.introspection.dev/skills/index.json`. A plugin skill here carries
only what a host reads statically — the frontmatter `name` and `description`
that trigger it — and a body that runs `introspection skills <name>` and follows
the bundle that returns. The CLI resolves the manifest, verifies every body
against its published hash, merges the shared step routes, caches the last
known-good bundle and refuses one newer than it can follow.

This keeps content correctable without a plugin release, and keeps one body
for every reader: the same bundle serves the platform's own Operator sandbox.

Consequences for changes here:

- Changing what a workflow says, adding a reference, or adding a step is a
  docs change, not a plugin change. Land it in `introspection-docs`; nothing
  here needs to move.
- Adding a new *trigger* — a skill, or its `description` — does need a plugin
  release, because the routing surface cannot be fetched. The new skill's body
  is the same pointer as the others, and the workflow must exist in the
  published bundle first or `validate-skills.mjs` fails against it.
- Keep `skills/` limited to the five public entry points: `create`, `migrate`,
  `deploy`, `improve`, and `operate`. The five split by what a request *ends
  in*: a new recipe (`create`), an existing agent ported into one (`migrate`),
  changed agent behavior landed through the repository (`improve`), a change to
  what an environment resolves to (`deploy`), and an answer or a changed live
  resource that leaves the recipe alone (`operate`). Adding a sixth needs that
  test to yield a genuinely new terminal state, not a new topic.
- Do not put workflow prose, boundaries, or reference routing back into a
  skill body. `validate-skills.mjs` fails on any URL other than the skill's
  own published fallback (`…/skills/v1/<name>/SKILL.md` and the boundaries and
  contract beside it), and on a body that does not delegate to the CLI.

To validate against an unpublished bundle, serve the docs branch and point the
validator at it:

```bash
(cd ../introspection-docs && pnpm generate:skills-index)
python3 -m http.server 8899 --directory ../introspection-docs/public &
INTROSPECTION_SKILLS_INDEX_URL=http://127.0.0.1:8899/skills/index.json \
  node scripts/validate-skills.mjs
```
