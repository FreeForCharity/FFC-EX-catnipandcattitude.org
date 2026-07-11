#!/usr/bin/env node
/**
 * Build-integrity guard: verify every first-party asset reference in the
 * static export carries the intended basePath.
 *
 * Why this exists
 * ---------------
 * This site deploys in two shapes:
 *   - github.io subpath  -> NEXT_PUBLIC_BASE_PATH=/<repo>, assets served from
 *     https://<org>.github.io/<repo>/...
 *   - custom domain root -> NEXT_PUBLIC_BASE_PATH="",     assets served from
 *     https://<domain>/...
 *
 * If the emitted asset paths ever disagree with how the site is actually
 * served, every /_next/ script + stylesheet 404s and the site renders naked
 * (this is exactly what happened once when a stale Pages custom domain made
 * actions/configure-pages derive an empty basePath while the build still
 * prefixed assets). That failure only surfaced in production. This guard
 * runs against the built ./out BEFORE the artifact is uploaded, so a
 * basePath mismatch fails the deploy instead of the live site — which is
 * the single biggest safety win for the custom-domain cutover.
 *
 * What it checks
 * --------------
 * For the intended basePath (from --base=<value> or NEXT_PUBLIC_BASE_PATH,
 * default ""), every reference to a first-party build asset
 * (/_next/static, /Images, /fonts, favicon/icon/apple-icon, manifest) must
 * be prefixed with exactly that basePath — no more (leakage), no less
 * (missing prefix). It scans every emitted .html plus manifest.webmanifest.
 *
 * Usage:
 *   node scripts/verify-basepath.mjs                 # base from env, scan ./out
 *   node scripts/verify-basepath.mjs --base=/repo    # explicit basePath
 *   node scripts/verify-basepath.mjs --dir=./out --base=""
 *
 * Exit codes:
 *   0  every asset reference matches the intended basePath
 *   1  one or more references have the wrong (or missing) basePath
 *   2  invalid usage / nothing to scan
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}

const DIR = arg('dir', './out')
// The intended basePath. Normalized to "" or "/something" (no trailing slash).
let BASE = arg('base', process.env.NEXT_PUBLIC_BASE_PATH ?? '')
BASE = BASE.replace(/\/+$/, '')
if (BASE && !BASE.startsWith('/')) BASE = `/${BASE}`

if (!existsSync(DIR)) {
  console.error(`verify-basepath: build dir "${DIR}" not found — run \`npm run build\` first.`)
  process.exit(2)
}

// First-party asset signals that MUST carry the basePath. Each is a path that
// appears verbatim in emitted markup; the correct reference is `${BASE}${sig}`.
const SIGNALS = [
  '/_next/static/',
  '/Images/',
  '/fonts/',
  '/downloads/',
  '/favicon.ico',
  '/icon.png',
  '/icon-192.png',
  '/apple-icon.png',
]

// Walk ./out for .html files plus the generated web manifest.
function collectFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      // Skip _next itself — we validate references TO it, not its innards.
      if (entry === '_next') continue
      out.push(...collectFiles(full))
    } else if (/\.html$/.test(entry) || entry === 'manifest.webmanifest') {
      out.push(full)
    }
  }
  return out
}

// For one signal, find every occurrence in `text`, walk back to the start of
// the surrounding URL token, and confirm the segment immediately before the
// signal equals BASE. Returns an array of violation objects. Signals that ARE
// seen with the correct BASE prefix (host-stripped) are recorded in
// `correctlyPrefixed` so the sanity check below can't false-fail on a build
// that emits same-origin absolute URLs.
const TOKEN_BOUNDARY = new Set(['"', "'", '(', ' ', '\t', '\n', ',', '=', '`'])
const correctlyPrefixed = new Set()
function violationsFor(text, signal) {
  const violations = []
  let idx = text.indexOf(signal)
  while (idx !== -1) {
    // Walk back to the token boundary to recover the full URL prefix, then
    // strip a same-origin absolute URL scheme+host if present, so
    // "https://host/repo/_next" is compared as "/repo".
    let start = idx
    while (start > 0 && !TOKEN_BOUNDARY.has(text[start - 1])) start--
    const prefix = text.slice(start, idx).replace(/^https?:\/\/[^/]+/i, '')
    if (prefix !== BASE) {
      violations.push({ signal, found: `${prefix}${signal}`, expected: `${BASE}${signal}` })
    } else {
      correctlyPrefixed.add(signal)
    }
    idx = text.indexOf(signal, idx + signal.length)
  }
  return violations
}

const files = collectFiles(DIR)
if (files.length === 0) {
  console.error(`verify-basepath: no .html files under "${DIR}".`)
  process.exit(2)
}

console.log(
  `verify-basepath: checking ${files.length} file(s) against basePath "${BASE || '(root)'}"\n`
)

const allViolations = []
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  for (const signal of SIGNALS) {
    // violationsFor also populates `correctlyPrefixed` for signals seen with
    // the intended BASE, using the same token-boundary + host-stripping logic.
    for (const v of violationsFor(text, signal)) {
      allViolations.push({ file, ...v })
    }
  }
}

// Sanity: a real Next.js export always references /_next/static/ from its HTML.
// If we never saw one with the intended basePath, the build shape is wrong
// (e.g. the basePath env was set but the build didn't pick it up).
if (!correctlyPrefixed.has('/_next/static/')) {
  console.error(
    `✗ No "${BASE}/_next/static/" reference found in any page — the build's ` +
      `basePath does not match the intended "${BASE || '(root)'}".`
  )
  process.exit(1)
}

if (allViolations.length === 0) {
  console.log(`✓ All first-party asset references use basePath "${BASE || '(root)'}".`)
  process.exit(0)
}

// Report grouped by file, de-duplicated (minified HTML repeats the same ref).
const byFile = new Map()
for (const v of allViolations) {
  const key = `${v.file}::${v.found}`
  if (byFile.has(key)) continue
  byFile.set(key, v)
}
console.error(`✗ ${byFile.size} basePath mismatch(es) — these assets would 404 when served:\n`)
for (const v of byFile.values()) {
  console.error(`  ${v.file.replace(DIR, '.')}`)
  console.error(`      found:    ${v.found}`)
  console.error(`      expected: ${v.expected}`)
}
console.error(
  `\nThe emitted asset paths do not match the intended basePath "${BASE || '(root)'}".\n` +
    `Root cause is usually NEXT_PUBLIC_BASE_PATH vs public/CNAME disagreeing at build time.`
)
process.exit(1)
