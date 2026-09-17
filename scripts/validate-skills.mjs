/**
 * Validates that the plugin stays a pointer.
 *
 * Every workflow body lives in `introspection-docs` and is read through
 * `introspection skills <name>`, so a correction reaches every host without a
 * plugin release. This script enforces that shape offline:
 *
 *   1. Exactly the five intended public skills are discoverable.
 *   2. Each skill's frontmatter `name` matches its directory and it carries a
 *      `description` (the host reads both statically to trigger the skill).
 *   3. Each body runs `scripts/activate.mjs` (the capture hook's lifecycle
 *      signal), delegates to `introspection skills <name>`, and hard-codes no
 *      URL other than that skill's own published fallback and the shared
 *      boundaries and contract beside it.
 *
 * When the published manifest is reachable it also checks that every skill is
 * a workflow the bundle serves. A network failure skips that check rather than
 * failing the build; a reachable manifest that lacks a skill is a hard
 * failure, since the pointer would resolve to nothing.
 *
 * Run: node scripts/validate-skills.mjs
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SKILLS_DIR = join(ROOT, 'skills')
const MANIFEST_URL = 'https://docs.introspection.dev/skills/index.json'
const BUNDLE_URL = 'https://docs.introspection.dev/skills/v1'
// Point at a locally served docs branch to validate an unpublished workflow.
const RESOLVED_MANIFEST_URL = process.env.INTROSPECTION_SKILLS_INDEX_URL ?? MANIFEST_URL

const expectedSkills = ['create', 'deploy', 'improve', 'migrate', 'operate']
const errors = []

const skillNames = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)

for (const name of expectedSkills) {
  if (!skillNames.includes(name)) errors.push(`public skill skills/${name}/SKILL.md is missing`)
}
for (const name of skillNames) {
  if (!expectedSkills.includes(name)) errors.push(`unexpected discoverable skill: skills/${name}/SKILL.md`)
}

for (const name of skillNames) {
  const relativePath = `skills/${name}/SKILL.md`
  let body
  try {
    body = readFileSync(join(SKILLS_DIR, name, 'SKILL.md'), 'utf8')
  } catch {
    errors.push(`${relativePath} is missing or unreadable`)
    continue
  }

  const frontmatter = body.match(/^---\n([\s\S]*?)\n---\n/)
  if (!frontmatter) {
    errors.push(`${relativePath} has no frontmatter`)
    continue
  }
  const declaredName = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim()
  if (declaredName !== name) {
    errors.push(`${relativePath} declares name "${declaredName}", expected "${name}"`)
  }
  if (!frontmatter[1].match(/^description:\s*\S/m)) {
    errors.push(`${relativePath} has no frontmatter description`)
  }

  if (!body.includes(`introspection skills ${name}`)) {
    errors.push(`${relativePath} does not delegate to \`introspection skills ${name}\``)
  }
  // The activation request is the only lifecycle signal the capture hook trusts.
  if (!body.includes('scripts/activate.mjs')) {
    errors.push(`${relativePath} does not run scripts/activate.mjs before reading its bundle`)
  }

  const allowedUrls = new Set([
    `${BUNDLE_URL}/${name}/SKILL.md`,
    `${BUNDLE_URL}/BOUNDARIES.md`,
    `${BUNDLE_URL}/CONTRACT.md`,
  ])
  for (const [url] of body.matchAll(/https?:\/\/[^\s)`,]+/g)) {
    if (!allowedUrls.has(url)) {
      errors.push(`${relativePath} hard-codes a URL: ${url} (the CLI resolves content by selector)`)
    }
  }
}

// A reachable manifest must serve every skill as a workflow. Offline CI skips this.
let manifest = null
try {
  const response = await fetch(RESOLVED_MANIFEST_URL, { signal: AbortSignal.timeout(10_000) })
  if (response.ok) manifest = await response.json()
} catch {
  // Intentionally ignored: offline validation still enforces rules 1-3.
}

if (manifest) {
  const workflows = new Set(Object.keys(manifest.skills?.workflows ?? {}))
  for (const name of skillNames) {
    if (!workflows.has(name)) {
      errors.push(`the published bundle at ${RESOLVED_MANIFEST_URL} serves no "${name}" workflow`)
    }
  }
} else {
  console.log(`note: ${RESOLVED_MANIFEST_URL} unreachable; skipped the published-workflow check`)
}

if (errors.length > 0) {
  console.error('plugin validation failed:')
  for (const message of errors) console.error(`  - ${message}`)
  process.exit(1)
}

console.log(`✓ ${skillNames.length} skills point at the published bundle`)
