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

No manual publication step is required. Raise `plugin.min_supported_version` in
`plugin-index.source.json` in `introspection-docs` only when older installations
can no longer safely follow the published references; they will stop and require
an upgrade rather than act on content shaped for newer semantics.

## Validation

Before handing off a change, run the relevant repository checks:

```bash
node scripts/validate-references.mjs
npx --yes plugins@1.3.4 discover . --target codex
npx --yes plugins@1.3.4 discover . --target claude-code
```

For release automation changes, also validate the Release Please configuration with a dry run.

## References

Skills resolve all content through the reference index at
`https://docs.introspection.dev/plugin/index.json`, by key and never by a
hard-coded URL. Reference bodies live in the `introspection-docs` repository
under `public/plugin/v1/`, and their metadata in `plugin-index.source.json`.

This keeps content correctable without a plugin release. It matters because how
an update reaches an installation varies by host: Claude Code and Cursor may
auto-update the marketplace, while Codex requires a marketplace upgrade and
plugin reinstall. Reference content is fetched per session, so it reaches all
of them equally.

Consequences for changes here:

- Adding a new reference is a docs change, not a plugin change. Land it in
  `introspection-docs` first so the published index has the key.
- Adding a new *trigger* — a skill, or its `description` — does need a plugin
  release, because the routing surface cannot be fetched.
- Keep `skills/` limited to the five public autocomplete entry points:
  `create`, `migrate`, `deploy`, `improve`, and `operate`. Supporting Pi,
  Recipes, eval, Harbor, and Introspection behavior belongs in `capabilities/`
  and is loaded progressively by those entry points. The five split by what a
  request *ends in*: a new recipe (`create`), an existing agent ported into one
  (`migrate`), changed agent behavior landed through the repository
  (`improve`), a change to what an environment resolves to (`deploy`), and an
  answer or a changed live resource that leaves the recipe alone (`operate`).
  Adding a sixth needs that test to yield a genuinely new terminal state, not
  a new topic.
- Every public skill and capability module that cites the index must carry the
  reference-loading and degradation contract verbatim. `validate-references.mjs`
  enforces both this and the four-skill discovery surface, so the copies cannot
  drift.

To validate a skill against an unpublished reference, serve the docs branch and
point the validator at it instead of the published index:

```bash
(cd ../introspection-docs && pnpm generate:plugin-index)
python3 -m http.server 8899 --directory ../introspection-docs/public &
PLUGIN_INDEX_URL=http://127.0.0.1:8899/plugin/index.json \
  node scripts/validate-references.mjs
```
