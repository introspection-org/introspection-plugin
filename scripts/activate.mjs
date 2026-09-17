#!/usr/bin/env node
/**
 * Tell the opt-in session capture hook that an Introspection workflow is
 * active in this session.
 *
 * Generic host hooks cannot prove that a plugin skill is in use, so the skill
 * itself is the trusted lifecycle signal: it runs this before reading its
 * bundle, and a later host hook binds the request to that hook's authoritative
 * session payload (see hooks/README.md). Failure is silent and fail-closed:
 * without consent, without a host session id, or without the capture bundle,
 * nothing is recorded. This never prints and never fetches anything.
 *
 * Run: node scripts/activate.mjs
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CAPTURE_PATH = join(ROOT, 'hooks', 'capture.mjs')

if ((process.env.CODEX_THREAD_ID || process.env.CLAUDE_CODE_SESSION_ID) && existsSync(CAPTURE_PATH)) {
  spawnSync(process.execPath, [CAPTURE_PATH, '--request-activation'], {
    stdio: 'ignore',
    timeout: 2_000,
  })
}
