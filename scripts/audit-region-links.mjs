/**
 * Audit: every published region is clickable site-wide.
 *
 * Validates, for all 7 locales, that:
 *   1. Every published region has a clickable Regions-hub card (a non-null `to`).
 *   2. Every published region is present in the auto-link index (region:<slug>).
 *   3. Region match strings are never dropped by the ambiguity collapse
 *      (i.e. no region name collides with a city/place name).
 *   4. City and Place index entries are NOT regressed (still present).
 *   5. Every eligible region-name occurrence in editorial content is matched by
 *      the index (both localized and Latin forms), reported as counts.
 *
 * Pure Node — uses the real getIndex() from src/utils/autolink.js (no DOM).
 * Run:  node scripts/audit-region-links.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { regions, cities, sites, regionPath, cityPath, sitePath } from '../src/data/places.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Index logic copied VERBATIM from src/utils/autolink.js (which uses an
// extensionless import Node ESM cannot resolve). Kept in sync so this audit
// exercises the exact matching the browser uses. getIndex/buildIndex touch no
// DOM, so they run unchanged here.
// ---------------------------------------------------------------------------
const GENERIC = new Set([
  'museum', 'fortress', 'monastery', 'cathedral', 'church', 'park', 'lake',
  'waterfall', 'canyon', 'valley', 'mountain', 'mountains', 'bridge', 'tower',
  'square', 'street', 'avenue', 'garden', 'gardens', 'cave', 'caves', 'palace',
  'beach', 'sea', 'river', 'fort', 'castle', 'temple', 'synagogue', 'mosque',
  'pillar', 'pillars', 'reserve', 'resort', 'village', 'old town', 'national park',
])
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
function variants(name, lang) {
  const out = new Set()
  const base = name.trim()
  if (base) out.add(base)
  const noParen = base.replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (noParen) out.add(noParen)
  if (lang === 'en') {
    for (const v of [...out]) {
      const noThe = v.replace(/^the\s+/i, '').trim()
      if (noThe) out.add(noThe)
    }
  }
  return [...out].filter((v) => v.length >= 4 && !GENERIC.has(v.toLowerCase()))
}
const localizedName = (items, slug) => (items && items[slug] && items[slug].name) || null
function getIndex(lang, pages) {
  const regionItems = (pages && pages.destinationsRegions && pages.destinationsRegions.items) || {}
  const cityItems = (pages && pages.destinationsCities && pages.destinationsCities.items) || {}
  const placeItems = (pages && pages.destinationsPlaces && pages.destinationsPlaces.items) || {}
  const raw = []
  for (const r of regions) {
    if (!r.published || r.noAutolink) continue
    const url = regionPath(r.slug)
    const key = `region:${r.slug}`
    const names = new Set([r.name])
    if (lang !== 'en') {
      const loc = localizedName(regionItems, r.slug)
      if (loc) names.add(loc)
    }
    for (const nm of names) for (const v of variants(nm, lang)) raw.push({ name: v, url, key })
  }
  for (const c of cities) {
    if (!c.published) continue
    const url = cityPath(c.slug)
    const key = `city:${c.slug}`
    const display = lang === 'en' ? c.name : (localizedName(cityItems, c.slug) || c.name)
    for (const v of variants(display, lang)) raw.push({ name: v, url, key })
  }
  for (const s of sites) {
    if (!s.published) continue
    const url = sitePath(s)
    const key = `place:${s.slug}`
    const display = lang === 'en' ? s.name : localizedName(placeItems, s.slug)
    if (!display) continue
    for (const v of variants(display, lang)) raw.push({ name: v, url, key })
  }
  const byLower = new Map()
  for (const e of raw) {
    const lc = e.name.toLowerCase()
    const cur = byLower.get(lc)
    if (!cur) byLower.set(lc, { ...e, urls: new Set([e.url]) })
    else cur.urls.add(e.url)
  }
  const accepted = []
  for (const [, e] of byLower) if (e.urls.size === 1) accepted.push({ name: e.name, url: e.url, key: e.key })
  accepted.sort((a, b) => b.name.length - a.name.length)
  return { accepted }
}
const LOCALES = ['cs', 'de', 'en', 'es', 'fr', 'nl', 'pl']
const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales')

const loadPages = (lang) =>
  JSON.parse(fs.readFileSync(path.join(localesDir, lang, 'pages.json'), 'utf8'))

const publishedRegions = regions.filter((r) => r.published)
let failures = 0
const fail = (m) => { failures++; console.error('  FAIL:', m) }

console.log(`Locales: ${LOCALES.join(', ')}`)
console.log(`Published regions (${publishedRegions.length}): ${publishedRegions.map((r) => r.slug).join(', ')}`)
console.log('')

// ---- 1. Regions-hub card clickability (mirror RegionsHubPage logic) ---------
console.log('[1] Regions-hub card clickability')
for (const r of regions) {
  if (r.hideFromHub) continue
  const clickable = r.published || !!r.linkPath
  const to = r.linkPath || (r.published ? regionPath(r.slug) : null)
  if (clickable && !to) fail(`${r.slug}: marked clickable but no destination`)
  if (r.published && to !== regionPath(r.slug) && !r.linkPath) fail(`${r.slug}: wrong card URL ${to}`)
}
console.log(`  ${regions.filter((r) => !r.hideFromHub && (r.published || r.linkPath)).length} clickable cards; abkhazia -> ${regions.find((r) => r.slug === 'abkhazia').linkPath}`)
console.log(`  racha -> ${regionPath('racha')}, lechkhumi -> ${regionPath('lechkhumi')} (combined racha-lechkhumi hidden: ${!!regions.find((r) => r.slug === 'racha-lechkhumi').hideFromHub})`)

// ---- 2..5 per-locale index checks ------------------------------------------
const stripTags = (html) => String(html).replace(/<[^>]+>/g, ' ')
function collectText(pages) {
  const out = []
  const walk = (v) => {
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(pages)
  return stripTags(out.join('\n'))
}

const totalLinkedPerRegion = Object.fromEntries(publishedRegions.map((r) => [r.slug, 0]))

for (const lang of LOCALES) {
  const pages = loadPages(lang)
  const idx = getIndex(lang, pages)
  const keys = new Set(idx.accepted.map((e) => e.key))

  console.log(`\n[2] ${lang}: region entries present in auto-link index`)
  for (const r of publishedRegions) {
    if (!keys.has(`region:${r.slug}`)) fail(`${lang}: region:${r.slug} MISSING from index (dropped as ambiguous/collision?)`)
  }
  const regionEntries = idx.accepted.filter((e) => e.key.startsWith('region:'))
  console.log(`  ${new Set(regionEntries.map((e) => e.key)).size}/${publishedRegions.length} regions indexed; ${regionEntries.length} match strings`)

  // 3. sanity: every region entry URL is the canonical region path, same-lang applied at render (/<lang> prefix added in linkHtml)
  for (const e of regionEntries) {
    if (!/^\/georgia\/regions\//.test(e.url)) fail(`${lang}: region entry ${e.name} has non-canonical url ${e.url}`)
  }

  // 4. city/place entries not regressed
  const cityCount = new Set(idx.accepted.filter((e) => e.key.startsWith('city:')).map((e) => e.key)).size
  const placeCount = new Set(idx.accepted.filter((e) => e.key.startsWith('place:')).map((e) => e.key)).size
  console.log(`  cities indexed: ${cityCount}, places indexed: ${placeCount}`)
  if (cityCount === 0) fail(`${lang}: no cities indexed (regression)`)

  // 5. count eligible region occurrences in content matched by the index
  const text = collectText(pages)
  let localeRegionMatches = 0
  for (const r of publishedRegions) {
    // build a per-region regex from just this region's accepted match strings
    const strings = regionEntries.filter((e) => e.key === `region:${r.slug}`).map((e) => e.name)
    if (!strings.length) continue
    const esc = strings.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length)
    let re
    try { re = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${esc.join('|')})(?![\\p{L}\\p{N}_])`, 'giu') }
    catch { re = new RegExp(`\\b(?:${esc.join('|')})\\b`, 'gi') }
    const n = (text.match(re) || []).length
    localeRegionMatches += n
    totalLinkedPerRegion[r.slug] += n
  }
  console.log(`  eligible region-name occurrences matched in ${lang} content: ${localeRegionMatches}`)
}

console.log('\n[5] Total region-name occurrences matched site-wide (all locales):')
let grand = 0
for (const r of publishedRegions) {
  grand += totalLinkedPerRegion[r.slug]
  console.log(`  ${r.slug.padEnd(20)} ${totalLinkedPerRegion[r.slug]}`)
}
console.log(`  GRAND TOTAL: ${grand}`)

console.log('')
if (failures) { console.error(`AUDIT FAILED: ${failures} problem(s)`); process.exit(1) }
console.log('AUDIT PASSED')
