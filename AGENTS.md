# Repository guidance

## Changes and commit messages

Pull request titles become squash commits on `main`, so every pull request title
and direct commit subject must follow Conventional Commits:

```text
<type>(optional-scope)!: <imperative summary>
```

Use `feat:` for a new capability, `fix:` for a backwards-compatible correction,
and `!` plus a `BREAKING CHANGE:` footer for incompatible behavior. Prefer
scopes such as `skills`, `references`, or `install` when they add useful context.

## Validation

Before handing off a change:

```bash
node scripts/validate-references.mjs
```

Validate every changed `skills/*` directory with the Agent Skill validator.

## References

Skills resolve supporting content through the reference index at
`https://docs.introspection.dev/plugin/index.json`, by key and never by a
hard-coded content URL. Reference bodies live in `introspection-docs` under
`public/plugin/v1/`, with metadata in `plugin-index.source.json`.

This keeps detailed guidance correctable without a CLI release. Consequences:

- Land a new reference in `introspection-docs` before citing it here.
- A new skill or trigger description changes the CLI-managed bundle and must be
  validated as an Agent Skill.
- Prefer discovery through `load_when` for advisory material. Cite required or
  gating entries at the step that needs them.
- Keep `skills/` limited to `introspection-create`, `introspection-migrate`,
  `introspection-deploy`, `introspection-improve`, and `introspection-operate`.
  They split by the request's terminal state.
- Keep the shared loading contract in `CONTRACT.md` and standing permissions in
  `BOUNDARIES.md`; skills link them rather than copying them.

To validate an unpublished reference:

```bash
(cd ../introspection-docs && pnpm generate:plugin-index)
python3 -m http.server 8899 --directory ../introspection-docs/public &
PLUGIN_INDEX_URL=http://127.0.0.1:8899/plugin/index.json \
  node scripts/validate-references.mjs
```
