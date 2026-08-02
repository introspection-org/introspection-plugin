/**
 * Validates that the plugin stays a router.
 *
 * The plugin resolves all content through the reference index by key, so that
 * references can be corrected without a plugin release. This script enforces
 * that contract offline:
 *
 *   1. The only URL allowed in a skill is the index itself.
 *   2. Every public skill links the loading contract and the standing
 *      boundaries, both of which live on disk in exactly one copy.
 *   3. Exactly the five intended public skills are discoverable.
 *   4. Cited keys, including page keys, are well-formed.
 *
 * When the published index is reachable it also checks that every cited key
 * exists. A network failure skips that check rather than failing the build; a
 * reachable index that is missing a cited key is a hard failure.
 *
 * A new reference must land in introspection-docs before plugin content cites
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

Each host owns its own plugin updates, so do not prompt for one. The single exception is a safety floor: if the \`version.txt\` beside this plugin's \`skills/\` directory is below the index's \`plugin.min_supported_version\`, stop and require an upgrade rather than acting on content shaped for newer semantics.`

const errors = []
const citedKeys = new Set()
const citedPageKeys = new Set()
const citedStepIds = new Set()
const expectedSkills = new Set(['create', 'deploy', 'improve', 'migrate', 'operate'])

const skillNames = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)

for (const name of expectedSkills) {
  if (!skillNames.includes(name)) errors.push(`public skill skills/${name}/SKILL.md is missing`)
}
for (const name of skillNames) {
  if (!expectedSkills.has(name)) errors.push(`unexpected discoverable skill: skills/${name}/SKILL.md`)
}

// The single source of the loading contract. Everything else links to it, so if
// this drifts or disappears the whole plugin silently loses its fetch rules.
try {
  const contractBody = readFileSync(join(ROOT, 'CONTRACT.md'), 'utf8')
  if (!contractBody.includes(CONTRACT)) {
    errors.push('CONTRACT.md does not carry the reference loading and degradation contract verbatim')
  }
} catch {
  errors.push('CONTRACT.md is missing or unreadable')
}

// Permission lives in the released artifact, never in a fetched page. If this
// file goes missing the skills lose their standing limits silently.
try {
  const boundaries = readFileSync(join(ROOT, 'BOUNDARIES.md'), 'utf8')
  for (const required of ['## Interfaces', '## Tooling and bootstrap', '## Evidence and credentials']) {
    if (!boundaries.includes(required)) {
      errors.push(`BOUNDARIES.md is missing its "${required.replace('## ', '')}" section`)
    }
  }
} catch {
  errors.push('BOUNDARIES.md is missing or unreadable')
}

const contentFiles = skillNames.map(name => ({
  absolutePath: join(SKILLS_DIR, name, 'SKILL.md'),
  relativePath: `skills/${name}/SKILL.md`,
}))

for (const { absolutePath, relativePath } of contentFiles) {
  let body
  try {
    body = readFileSync(absolutePath, 'utf8')
  } catch {
    errors.push(`${relativePath} is missing or unreadable`)
    continue
  }

  const urls = [...body.matchAll(/https?:\/\/[^\s)`]+/g)].map(match => match[0].replace(/[.,]$/, ''))
  for (const url of urls) {
    if (url !== INDEX_URL) {
      errors.push(`${relativePath} hard-codes a content URL: ${url} (resolve it by index key instead)`)
    }
  }

  // The contract lives in one file and everything else links to it, so a copy
  // cannot drift because there are no copies. Carrying it inline still passes,
  // which keeps CONTRACT.md itself valid under the same rule.
  const linksContract = /\]\((?:\.\.\/)+CONTRACT\.md\)/.test(body)
  if (!linksContract && !body.includes(CONTRACT)) {
    errors.push(
      `${relativePath} neither links the reference loading contract (CONTRACT.md) nor carries it verbatim`,
    )
  }

  if (!/\]\((?:\.\.\/)+BOUNDARIES\.md\)/.test(body)) {
    errors.push(`${relativePath} does not link the standing boundaries (BOUNDARIES.md)`)
  }

  for (const [, key] of body.matchAll(/`([^`]+)` (?:source|reference)\b/g)) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(key)) {
      errors.push(`${relativePath} cites malformed key "${key}"`)
      continue
    }
    citedKeys.add(key)
  }

  // Page-level citations ("the `security` page of the `introspection-docs`
  // source") route as precisely as a reference does, so they are held to the
  // same existence check rather than being invisible to it.
  for (const [, key] of body.matchAll(/`([^`]+)` page\b/g)) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(key)) {
      errors.push(`${relativePath} cites malformed page key "${key}"`)
      continue
    }
    citedPageKeys.add(key)
  }

  // A section announces the step it is entering; the index says what to load
  // there. A step id that no longer exists routes to nothing and fails silently
  // at exactly the moment the content was needed, so hold it to the same
  // existence check as a key.
  for (const [, stepId] of body.matchAll(/^Step `([^`]+)`\.$/gm)) {
    for (const one of stepId.split(/,\s*(?:then\s*)?/)) {
      if (!/^(\*|[a-z0-9-]+)\/[a-z0-9-]+$/.test(one)) {
        errors.push(`${relativePath} declares malformed step id "${one}"`)
        continue
      }
      citedStepIds.add(one)
    }
  }
}

if (citedKeys.size === 0) {
  errors.push('no reference or source keys are cited by any public skill')
}

// A reachable index must contain every cited key. Offline CI skips this.
let index = null
try {
  const response = await fetch(RESOLVED_INDEX_URL, { signal: AbortSignal.timeout(10_000) })
  if (response.ok) index = await response.json()
} catch {
  // Intentionally ignored: offline validation still enforces rules 1-4.
}

if (index) {
  const known = new Set([...Object.keys(index.references ?? {}), ...Object.keys(index.sources ?? {})])
  const knownPages = new Set()
  for (const source of Object.values(index.sources ?? {})) {
    for (const page of Object.keys(source.pages ?? {})) knownPages.add(page)
  }
  // An index with no `steps` field predates step routing entirely, which is a
  // published index older than this plugin content rather than a broken route.
  // Skip, the same way an unreachable index is skipped. Once the field exists,
  // a missing id is a real dangling route and fails.
  if (index.steps === undefined) {
    console.warn('note: published index predates step routing; skipped step-existence check')
  } else {
    const knownSteps = new Set(Object.keys(index.steps))
    for (const stepId of [...citedStepIds].sort()) {
      if (!knownSteps.has(stepId)) {
        errors.push(`step "${stepId}" is declared by plugin content but absent from the published index`)
      }
    }
  }

  for (const key of [...citedPageKeys].sort()) {
    if (!knownPages.has(key)) {
      errors.push(`page key "${key}" is cited by plugin content but no indexed source declares it`)
    }
  }
  for (const key of [...citedKeys].sort()) {
    if (!known.has(key)) {
      errors.push(`key "${key}" is cited by plugin content but absent from the published index`)
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
  `✓ plugin resolves content by key only (${citedKeys.size} keys and ${citedPageKeys.size} pages cited${index ? ', all present in the published index' : ''})`,
)
