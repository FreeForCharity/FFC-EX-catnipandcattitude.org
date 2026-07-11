#!/usr/bin/env node
/**
 * DNS / HTTPS cutover preflight.
 *
 * Run this BEFORE and AFTER pointing the custom domain at GitHub Pages so the
 * cutover is a checked, reversible step instead of a hope. It reads live DNS
 * over DoH (works anywhere — no `dig`, no local resolver config) and probes
 * HTTPS, then prints a go / no-go verdict.
 *
 * It answers the questions that actually make a cutover risky:
 *   - Where does the apex (and www) resolve right now? GitHub Pages, Cloudflare,
 *     or still the old host?
 *   - Do CAA records let GitHub's certificate authority (Let's Encrypt) issue,
 *     or would HTTPS provisioning silently fail?
 *   - Is the GitHub Pages origin we're cutting TO actually healthy and serving
 *     the new site?
 *   - Once DNS is changed: is the custom domain live over HTTPS and serving the
 *     new site (not a stale cache or the old GoDaddy page)?
 *
 * Usage:
 *   node scripts/preflight-cutover.mjs
 *   node scripts/preflight-cutover.mjs --domain=catnipandcattitude.org \
 *        --origin=https://freeforcharity.github.io/FFC-EX-catnipandcattitude.org/ \
 *        --marker="Catnip and Cattitude"
 *
 * Exit codes:
 *   0  ready to cut over (or already cut over and healthy) — no blockers
 *   1  one or more blockers found
 *   2  invalid usage / network unavailable
 */

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}

const DOMAIN = arg('domain', 'catnipandcattitude.org')
  .replace(/^https?:\/\//, '')
  .replace(/\/.*$/, '')
const ORIGIN = arg('origin', 'https://freeforcharity.github.io/FFC-EX-catnipandcattitude.org/')
const MARKER = arg('marker', 'Catnip and Cattitude')

// GitHub Pages apex A records (documented, stable). A domain served by Pages
// at the apex resolves to these; a www host CNAMEs to <org>.github.io.
const GH_PAGES_IPV4 = new Set([
  '185.199.108.153',
  '185.199.109.153',
  '185.199.110.153',
  '185.199.111.153',
])
// Cloudflare proxies return addresses in these ranges (104.16.0.0/13 &
// 172.64.0.0/13 are the common ones); enough to *label* the current host.
function isCloudflare(ip) {
  return /^104\.(1[6-9]|2[0-9]|3[01])\./.test(ip) || /^172\.(6[4-9]|7[0-9])\./.test(ip)
}

const results = []
function record(ok, name, detail = '') {
  results.push({ ok, name, detail })
  const mark = ok === true ? '✓' : ok === false ? '✗' : 'ℹ'
  console.log(detail ? `${mark} ${name} — ${detail}` : `${mark} ${name}`)
}

async function doh(name, type) {
  // Cloudflare first, Google as fallback — both speak the JSON DoH API.
  const endpoints = [
    `https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`,
    `https://dns.google/resolve?name=${name}&type=${type}`,
  ]
  let lastErr = null
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: { accept: 'application/dns-json' } })
      if (!res.ok) {
        lastErr = `HTTP ${res.status}`
        continue
      }
      const json = await res.json()
      return (json.Answer || []).map((a) => ({ type: a.type, data: a.data.replace(/\.$/, '') }))
    } catch (err) {
      lastErr = err?.message || String(err)
    }
  }
  throw new Error(`DoH lookup failed for ${name}/${type}: ${lastErr}`)
}

// Follow CNAME chains to the terminal A records, collecting the chain.
// DoH JSON answers carry a numeric record `type`; a single response can mix
// types (e.g. a CNAME followed by the A records it resolves to), so always
// filter by type (CNAME = 5, A = 1) rather than trusting Answer[0] — otherwise
// an IP could be mistaken for the next hostname.
async function resolveHost(host) {
  const chain = []
  let current = host
  for (let hops = 0; hops < 6; hops++) {
    const cname = (await doh(current, 'CNAME')).find((r) => r.type === 5)
    if (cname) {
      chain.push({ from: current, cname: cname.data })
      current = cname.data
      continue
    }
    const a = await doh(current, 'A')
    return { chain, terminal: current, ips: a.filter((r) => r.type === 1).map((r) => r.data) }
  }
  return { chain, terminal: current, ips: [] }
}

function classify(host) {
  if (host.ips.some((ip) => GH_PAGES_IPV4.has(ip))) return 'GitHub Pages'
  if (host.chain.some((c) => /\.github\.io$/i.test(c.cname))) return 'GitHub Pages (CNAME)'
  if (host.ips.some(isCloudflare)) return 'Cloudflare (proxied)'
  if (host.ips.length) return `other (${host.ips.join(', ')})`
  return 'unresolved'
}

async function probeHttps(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'ffc-cutover-preflight' },
    })
    const body = await res.text()
    clearTimeout(timer)
    return { status: res.status, server: res.headers.get('server') || '', body }
  } catch (err) {
    clearTimeout(timer)
    return { error: err?.message || String(err) }
  }
}

async function main() {
  console.log(`Cutover preflight for ${DOMAIN}\n`)

  // 1. Confirm the GitHub Pages origin we're cutting TO is healthy first.
  console.log('— Source origin (cutting TO) —')
  const originProbe = await probeHttps(ORIGIN)
  if (originProbe.error) {
    record(false, `Pages origin reachable (${ORIGIN})`, originProbe.error)
  } else {
    record(
      originProbe.status === 200,
      `Pages origin returns 200 (${ORIGIN})`,
      `HTTP ${originProbe.status}`
    )
    record(
      originProbe.body.includes(MARKER),
      'Pages origin serves the new site',
      `marker "${MARKER}" ${originProbe.body.includes(MARKER) ? 'present' : 'MISSING'}`
    )
  }

  // 2. Where does the apex resolve now, and is it Pages-ready?
  console.log('\n— Target domain DNS —')
  let apexClass = 'unresolved'
  try {
    const apex = await resolveHost(DOMAIN)
    apexClass = classify(apex)
    for (const c of apex.chain) record('info', `CNAME ${c.from} → ${c.cname}`)
    record('info', `${DOMAIN} A → ${apex.ips.join(', ') || '(none)'}`)
    record('info', `${DOMAIN} currently served by: ${apexClass}`)
  } catch (err) {
    record(false, `${DOMAIN} resolves`, err.message)
  }

  try {
    const www = await resolveHost(`www.${DOMAIN}`)
    record('info', `www.${DOMAIN} served by: ${classify(www)}`)
  } catch {
    record('info', `www.${DOMAIN} — no record`)
  }

  // 3. CAA — will Let's Encrypt (GitHub Pages' CA) be allowed to issue?
  console.log('\n— Certificate authority (CAA) —')
  try {
    const caa = await doh(DOMAIN, 'CAA')
    if (!caa.length) {
      record(true, 'CAA policy', 'none set — any CA may issue (Let’s Encrypt OK)')
    } else {
      const issuers = caa.map((r) => r.data)
      const letsEncryptOk = issuers.some((d) => /letsencrypt\.org/i.test(d))
      record(letsEncryptOk, 'CAA allows Let’s Encrypt (GitHub Pages HTTPS)', issuers.join(' | '))
    }
  } catch (err) {
    record('info', 'CAA lookup', err.message)
  }

  // 4. If DNS already points at Pages, verify the live domain over HTTPS.
  console.log('\n— Live domain over HTTPS —')
  const live = await probeHttps(`https://${DOMAIN}/`)
  const pointedAtPages = apexClass.startsWith('GitHub Pages')
  if (live.error) {
    record(!pointedAtPages ? 'info' : false, `https://${DOMAIN}/ reachable`, live.error)
  } else {
    record(
      live.status < 400,
      `https://${DOMAIN}/ responds`,
      `HTTP ${live.status}${live.server ? ` (server: ${live.server})` : ''}`
    )
    const servesNew = live.body.includes(MARKER)
    if (pointedAtPages) {
      record(
        servesNew,
        'Custom domain serves the new site',
        servesNew ? `marker present` : 'still the OLD site / stale cache'
      )
    } else {
      record(
        'info',
        'Custom domain content',
        servesNew ? 'new site' : 'old host (expected pre-cutover)'
      )
    }
  }

  // Verdict.
  console.log('\n— Verdict —')
  const blockers = results.filter((r) => r.ok === false)
  const originHealthy =
    !originProbe.error && originProbe.status === 200 && originProbe.body.includes(MARKER)

  if (!originHealthy) {
    console.log(
      '✗ NOT READY — the GitHub Pages origin is not healthy; fix the deploy before cutting over.'
    )
    process.exit(1)
  }
  if (pointedAtPages && blockers.length === 0) {
    console.log(
      '✓ CUTOVER COMPLETE — custom domain points at GitHub Pages, HTTPS is live, and it serves the new site.'
    )
    process.exit(0)
  }
  if (!pointedAtPages) {
    console.log(
      `ℹ READY TO CUT OVER — Pages origin is healthy. ${DOMAIN} is currently on "${apexClass}".\n` +
        '  Next: point the apex/www at GitHub Pages (add public/CNAME + set the custom domain in\n' +
        '  Settings → Pages), wait for the Let’s Encrypt cert, then re-run this preflight to confirm.'
    )
    process.exit(blockers.length ? 1 : 0)
  }
  console.log(`✗ NOT READY — ${blockers.length} blocker(s) above need attention.`)
  process.exit(1)
}

main().catch((err) => {
  console.error('\npreflight crashed:', err?.stack || err)
  process.exit(2)
})
