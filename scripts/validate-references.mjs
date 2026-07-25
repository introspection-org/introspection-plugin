/**
 * Validates that the plugin stays a router.
 *
 * The plugin resolves all content through the reference index by key, so that
 * references can be corrected without a plugin release. This script enforces
 * that contract offline:
 *
 *   1. The only URL allowed in a skill is the index itself.
 *   2. Every skill that resolves content carries the reference-loading and
 *      degradation contract verbatim, so a copy cannot drift.
 *   3. Cited keys are well-formed.
 *
 * When the published index is reachable it also checks that every cited key
 * exists. A network failure skips that check rather than failing the build; a
 * reachable index that is missing a cited key is a hard failure.
 *
 * A new reference must land in introspection-docs before the skill that cites
 * it, or this check fails on the published index. To validate both sides
 * together first, serve the docs branch and point this script at it:
 *
 *   (cd ../introspection-docs && pnpm generate:plugin-index)
 *   python3 -m http.server 8899 --directory ../introspection-docs/public &
 *   PLUGIN_INDEX_URL=http://127.0.0.1:8899/plugin/index.json \
 *     node scripts/validate-references.mjs
 *
 * Run: node scripts/validate-references.mjs
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SKILLS_DIR = join(ROOT, 'skills')
const INDEX_URL = 'https://docs.introspection.dev/plugin/index.json'
// Point at a locally served docs branch to validate an unpublished reference.
const RESOLVED_INDEX_URL = process.env.PLUGIN_INDEX_URL ?? INDEX_URL

const CONTRACT = `Resolve every reference and source through the plugin reference index at \`${INDEX_URL}\`, by key and never by a hard-coded content URL. Fetch it once per session with the host's web-fetch tool, or with \`curl\` when the host has none. Load an entry only when the work reaches the step its \`load_when\` describes, and report the key and \`revision\` you used. When a source declares a \`pages\` map, choose the page whose \`read_for\` matches the question instead of recalling a filename; the set of pages is not fixed.

On a failed fetch, honor the entry's \`degradation\`: \`advisory\` proceeds at reduced depth, \`required-for-step\` skips only that step and says so, and \`gating\` stops. Never reconstruct, paraphrase, or improvise a reference you could not load; name the key that failed.

Compare the index's \`plugin.current_version\` with the \`version.txt\` beside this plugin's \`skills/\` directory. If the index is newer, mention its upgrade command once; if this installation is below \`plugin.min_supported_version\`, stop and require the upgrade.`

const errors = []
const citedKeys = new Set()

for (const skill of readdirSync(SKILLS_DIR, { withFileTypes: true })) {
  if (!skill.isDirectory()) continue
  const relativePath = `skills/${skill.name}/SKILL.md`
  let body
  try {
    body = readFileSync(join(SKILLS_DIR, skill.name, 'SKILL.md'), 'utf8')
  } catch {
    errors.push(`${relativePath} is missing`)
    continue
  }

  const urls = [...body.matchAll(/https?:\/\/[^\s)`]+/g)].map(match => match[0].replace(/[.,]$/, ''))
  for (const url of urls) {
    if (url !== INDEX_URL) {
      errors.push(`${relativePath} hard-codes a content URL: ${url} (resolve it by index key instead)`)
    }
  }

  const resolvesContent = urls.includes(INDEX_URL)
  if (resolvesContent && !body.includes(CONTRACT)) {
    errors.push(
      `${relativePath} cites the reference index but does not carry the loading and degradation contract verbatim`,
    )
  }

  for (const [, key] of body.matchAll(/`([^`]+)` (?:source|reference)\b/g)) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(key)) {
      errors.push(`${relativePath} cites malformed key "${key}"`)
      continue
    }
    citedKeys.add(key)
  }
}

if (citedKeys.size === 0) {
  errors.push('no reference or source keys are cited by any skill')
}

// A reachable index must contain every cited key. Offline CI skips this.
let index = null
try {
  const response = await fetch(RESOLVED_INDEX_URL, { signal: AbortSignal.timeout(10_000) })
  if (response.ok) index = await response.json()
} catch {
  // Intentionally ignored: offline validation still enforces rules 1-3.
}

if (index) {
  const known = new Set([...Object.keys(index.references ?? {}), ...Object.keys(index.sources ?? {})])
  for (const key of [...citedKeys].sort()) {
    if (!known.has(key)) {
      errors.push(`key "${key}" is cited by a skill but absent from the published index`)
    }
  }
} else {
  console.log('note: published index unreachable; skipped key-existence check')
}

if (errors.length > 0) {
  console.error('reference validation failed:')
  for (const message of errors) console.error(`  - ${message}`)
  process.exit(1)
}

console.log(
  `✓ plugin resolves content by key only (${citedKeys.size} keys cited${index ? ', all present in the published index' : ''})`,
)
