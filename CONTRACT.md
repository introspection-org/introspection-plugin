# Reference loading contract

This contract is binding on every public skill and capability module in this
plugin. They link here rather than restating it, so there is exactly one copy to
read and exactly one to change.

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. When command execution is available, use `scripts/load-references.mjs` beside this contract: it discovers the effective index URL from this file, caches the index, resolves step and page keys without `jq`, and reports provenance. Do not fetch the index or content URLs yourself after using it. If command execution is unavailable, fetch the index once per session with the host's web-fetch tool and retain it for later step lookups. Load an entry only when the work reaches the step its `load_when` describes. For indexed references report the key and `revision`; for an external source without an indexed revision report the content hash the loader emits. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Steps decide what to load

The index carries a `steps` map: step id to the keys that step needs. A skill
names the step it is entering. With command execution, pass that id to
`node <plugin-root>/scripts/load-references.mjs --step <step-id>` before doing
the step; otherwise look it up in the retained index and load what it lists.
This is the primary routing mechanism, and it is a lookup rather than a
judgement.

A step id is `<skill>/<step>`, or `*/<step>` when the same work is reached from
more than one workflow. `*/capability-set` and `improve/read-evidence` both
apply when improving an agent whose capability set is in question; load the
union, not the first match.

Do this at the moment you enter the step, not at the start of the session. A
step you never reach costs nothing.

## Discovery still applies

Not every entry is routed by a step. Every reference and source also carries a
`load_when`, and matching that condition against the work is a legitimate second
way in — advisory entries in particular are often reached no other way. Read the
index's own entries rather than assuming the set is whatever the active skill
mentions.

Where the two disagree, the step map wins: it is maintained against the
workflows, and `load_when` is prose you have to interpret.
