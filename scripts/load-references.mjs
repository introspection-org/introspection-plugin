#!/usr/bin/env node

/**
 * Resolve and load plugin references by index key.
 *
 * The cache holds the fetched index so a disposable agent environment downloads
 * it once. It deliberately does NOT persist which revisions were emitted: the
 * cache path is stable across processes, so on a developer workstation a later
 * unrelated session would be told `already-loaded` for content that session had
 * never seen. Suppression is therefore per-invocation only — it still collapses
 * the repeated keys of a multi-step call, which is where the duplication is.
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONTRACT_PATH = join(ROOT, 'CONTRACT.md')
const DEFAULT_CACHE = join(tmpdir(), 'introspection-plugin-reference-index.json')
// Long enough that a session never re-fetches mid-work, short enough that a
// published correction reaches the next one.
const CACHE_MAX_AGE_MS = 60 * 60 * 1000

function fail(message, code = 1) {
  console.error(`reference loader: ${message}`)
  process.exit(code)
}

function usage() {
  console.error(`Usage:
  node scripts/load-references.mjs --step <step-id> [--step <step-id> ...]
  node scripts/load-references.mjs --reference <key>
  node scripts/load-references.mjs --source-page <source-key>/<page-key>
  node scripts/load-references.mjs --list-source-pages <source-key>
  node scripts/load-references.mjs --search <words>

Options:
  --cache <path>       Cache path (default: $PLUGIN_INDEX_CACHE or a temporary file)
  --index-url <url>    Override the URL discovered from CONTRACT.md`)
}

const options = { steps: [], references: [], sourcePages: [], listSourcePages: [], searches: [] }
for (let i = 2; i < process.argv.length; i += 1) {
  const argument = process.argv[i]
  const value = process.argv[++i]
  if (!value) {
    usage()
    fail(`${argument} requires a value`)
  }
  if (argument === '--step') options.steps.push(value)
  else if (argument === '--reference') options.references.push(value)
  else if (argument === '--source-page') options.sourcePages.push(value)
  else if (argument === '--list-source-pages') options.listSourcePages.push(value)
  else if (argument === '--search') options.searches.push(value)
  else if (argument === '--cache') options.cache = value
  else if (argument === '--index-url') options.indexUrl = value
  else {
    usage()
    fail(`unknown option ${argument}`)
  }
}

if (
  options.steps.length + options.references.length + options.sourcePages.length
  + options.listSourcePages.length + options.searches.length === 0
) {
  usage()
  fail('choose at least one step, reference, or source page')
}

const contract = readFileSync(CONTRACT_PATH, 'utf8')
const discoveredUrl = contract.match(/https?:\/\/[^\s`)]+\/plugin\/index\.json/)?.[0]
const indexUrl = options.indexUrl ?? process.env.PLUGIN_INDEX_URL ?? discoveredUrl
if (!indexUrl) fail(`could not discover the plugin index URL from ${CONTRACT_PATH}`)

const cachePath = resolve(options.cache ?? process.env.PLUGIN_INDEX_CACHE ?? DEFAULT_CACHE)
let state = null
if (existsSync(cachePath)) {
  try {
    const candidate = JSON.parse(readFileSync(cachePath, 'utf8'))
    // The cache path is stable across processes, so on a persistent host an
    // unbounded cache would serve an indefinitely stale index to later
    // sessions — corrections, new keys, and a raised min_supported_version
    // would never reach them. Re-fetch once the entry ages past the window.
    const age = Date.now() - Date.parse(candidate.fetched_at ?? 0)
    const fresh = Number.isFinite(age) && age >= 0 && age < CACHE_MAX_AGE_MS
    if (candidate.index_url === indexUrl && candidate.index && fresh) state = candidate
  } catch {
    // A partial or obsolete cache is replaced below.
  }
}

if (!state) {
  const response = await fetch(indexUrl)
  if (!response.ok) fail(`index fetch failed (${response.status}) for ${indexUrl}`, 3)
  state = {
    index_url: indexUrl,
    fetched_at: new Date().toISOString(),
    index: await response.json(),
    loaded: {},
  }
}
// Per-invocation only; see the header note on cross-session reuse.
state.loaded = {}

// The contract's safety floor. CONTRACT.md forbids the caller from fetching or
// inspecting the index itself, so on a command-enabled host this loader is the
// only place the floor can be checked — without this it is unenforceable.
function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number)
  const pb = String(b).split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (d !== 0) return d < 0 ? -1 : 1
  }
  return 0
}
const floor = state.index?.plugin?.min_supported_version
if (floor) {
  let installed = null
  try {
    installed = readFileSync(join(ROOT, 'version.txt'), 'utf8').trim()
  } catch {
    // No version.txt: cannot prove the floor is met, so do not claim it is.
    fail(`cannot read version.txt to check the index floor of ${floor}`, 2)
  }
  if (compareVersions(installed, floor) < 0) {
    fail(
      `installed plugin ${installed} is below the index's min_supported_version ${floor}. ` +
        'Stop and require an upgrade rather than acting on content shaped for newer semantics.',
      2,
    )
  }
}

for (const key of options.listSourcePages) {
  const source = state.index.sources?.[key]
  if (!source) fail(`unknown source "${key}"`)
  const pages = Object.entries(source.pages ?? {})
  if (pages.length === 0) fail(`source "${key}" has no pages`)
  console.log(`--- source pages: ${key} ---`)
  for (const [pageKey, page] of pages) console.log(`${pageKey}\t${page.read_for}`)
}

for (const words of options.searches) {
  const query = words.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  const matchesQuery = value => {
    const haystack = value.toLowerCase().replace(/[^a-z0-9]+/g, ' ')
    return query.every(word => haystack.includes(word))
  }
  const matches = []
  for (const [key, entry] of Object.entries(state.index.references ?? {})) {
    if (matchesQuery(`${key} ${entry.load_when ?? ''}`)) matches.push(`reference\t${key}\t${entry.load_when}`)
  }
  for (const [key, source] of Object.entries(state.index.sources ?? {})) {
    if (matchesQuery(`${key} ${source.load_when ?? ''}`)) matches.push(`source\t${key}\t${source.load_when}`)
    for (const [pageKey, page] of Object.entries(source.pages ?? {})) {
      if (matchesQuery(`${key} ${pageKey} ${page.read_for ?? ''}`)) {
        matches.push(`source-page\t${key}/${pageKey}\t${page.read_for}`)
      }
    }
  }
  console.log(`--- search: ${words} ---`)
  if (matches.length === 0) console.log('no matches')
  else console.log(matches.join('\n'))
}

const selected = []
for (const step of options.steps) {
  const keys = state.index.steps?.[step]
  if (!Array.isArray(keys) || keys.length === 0) fail(`step "${step}" is absent or empty`)
  for (const key of keys) selected.push({ kind: 'reference', key, step })
}
for (const key of options.references) selected.push({ kind: 'reference', key })
for (const selector of options.sourcePages) {
  const [key, page, ...extra] = selector.split('/')
  if (!key || !page || extra.length > 0) fail(`source page must be <source-key>/<page-key>: ${selector}`)
  selected.push({ kind: 'source-page', key, page })
}

let exitCode = 0
for (const item of selected.filter((value, index, all) =>
  all.findIndex(other => other.kind === value.kind && other.key === value.key && other.page === value.page) === index
)) {
  const entry = item.kind === 'reference'
    ? state.index.references?.[item.key]
    : state.index.sources?.[item.key]?.pages?.[item.page]
  if (item.kind === 'reference' && !entry && state.index.sources?.[item.key]) {
    fail(`"${item.key}" is a source; use --list-source-pages ${item.key}, then --source-page ${item.key}/<page-key>`)
  }
  const parent = item.kind === 'source-page' ? state.index.sources?.[item.key] : entry
  const label = item.kind === 'source-page' ? `${item.key}/${item.page}` : item.key
  if (!entry) fail(`unknown ${item.kind === 'source-page' ? 'source page' : 'key'} "${label}"`)
  if (entry.audience === 'human') fail(`"${label}" is a human-only page and cannot be fetched`)

  const indexedRevision = entry.revision
  if (state.loaded[label] && (!indexedRevision || state.loaded[label] === indexedRevision)) {
    console.log(`--- ${label} revision=${state.loaded[label]} already-loaded ---`)
    continue
  }

  try {
    const response = await fetch(entry.url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const body = await response.text()
    const revision = indexedRevision ?? `sha256:${createHash('sha256').update(body).digest('hex').slice(0, 12)}`
    console.log(`--- ${label} revision=${revision} url=${entry.url} ---`)
    console.log(body)
    state.loaded[label] = revision
  } catch (error) {
    const degradation = parent?.degradation ?? 'required-for-step'
    console.error(`reference loader: ${label} failed (${error.message}); degradation=${degradation}`)
    if (degradation === 'gating') exitCode = Math.max(exitCode, 3)
    else if (degradation === 'required-for-step') exitCode = Math.max(exitCode, 2)
  }
}

const temporaryCache = `${cachePath}.${process.pid}.tmp`
// Persist the index only. `loaded` is per-invocation by design, and writing it
// would leave a record the next run must remember to ignore.
const { loaded: _discarded, ...persisted } = state
writeFileSync(temporaryCache, `${JSON.stringify(persisted, null, 2)}\n`, { mode: 0o600 })
renameSync(temporaryCache, cachePath)
process.exit(exitCode)
