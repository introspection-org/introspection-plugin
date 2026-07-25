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

The `plugins` CLI clones the default branch with no ref, so a release tag does
not reach anyone by itself and there is no update command to prompt them. The
only signal users get is the index.

Update `plugin.current_version` in `plugin-index.source.json` in
`introspection-docs` to the released version and regenerate the index. Raise
`min_supported_version` only when older installations can no longer safely
follow the published references; they will stop and require an upgrade rather
than act on content shaped for newer semantics.

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

This keeps content correctable without a plugin release, which matters because
the `plugins` CLI has no update command: an installation stays at the commit it
was installed from until a user re-runs `plugins add`.

Consequences for changes here:

- Adding a new reference is a docs change, not a plugin change. Land it in
  `introspection-docs` first so the published index has the key.
- Adding a new *trigger* — a skill, or its `description` — does need a plugin
  release, because the routing surface cannot be fetched.
- Every skill that cites the index must carry the reference-loading and
  degradation contract verbatim. `validate-references.mjs` enforces this, so
  the copies cannot drift.

To validate a skill against an unpublished reference, serve the docs branch and
point the validator at it instead of the published index:

```bash
(cd ../introspection-docs && pnpm generate:plugin-index)
python3 -m http.server 8899 --directory ../introspection-docs/public &
PLUGIN_INDEX_URL=http://127.0.0.1:8899/plugin/index.json \
  node scripts/validate-references.mjs
```
