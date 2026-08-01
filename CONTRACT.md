# Reference loading contract

This contract is binding on every public skill and capability module in this
plugin. They link here rather than restating it, so there is exactly one copy to
read and exactly one to change.

Resolve every reference and source through the plugin reference index at `https://docs.introspection.dev/plugin/index.json`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with `curl` when the host has none. Load an entry only when the work reaches the step its `load_when` describes, and report the key and `revision` you used. When a source declares a `pages` map, choose the page whose `read_for` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's `degradation`: `advisory` proceeds at reduced depth, `required-for-step` skips only that step and says so, and `gating` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the `version.txt` beside this plugin's `skills/` directory is below the index's `plugin.min_supported_version`, stop and require an upgrade rather than acting on content shaped for newer semantics.

## Not every entry is named by a skill

An entry does not have to be cited to be reachable. The index carries a
`load_when` for every reference and source, and matching that condition against
the work in progress is the ordinary way to find one — several entries are
reached no other way. Read the index's own entries rather than assuming the set
is whatever the active skill happens to mention.
