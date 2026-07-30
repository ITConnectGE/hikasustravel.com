import { existsSync, readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Canonical-URL helper (trailing-slash form matching how the host serves pages).
const { withTrailingSlash } = await import(
  pathToFileURL(join(__dirname, '../src/utils/url.js')).href
)

// Published destination detail pages (regions / cities / sites) from the registry.
const { publishedDestinationPages } = await import(
  pathToFileURL(join(__dirname, '../src/data/places.js')).href
)

// Published border-crossing pages (overview guide + individual crossings).
const { publishedBorderPages } = await import(
  pathToFileURL(join(__dirname, '../src/data/borders.js')).href
)

// Generated "<Entity> Tours" listing pages (destination/attraction -> tours).
const { entityTourPages } = await import(
  pathToFileURL(join(__dirname, '../src/data/entityTours.js')).href
)

// Parse tours data from the source file
const toursFile = readFileSync(join(__dirname, '../src/data/tours.js'), 'utf-8')
const slugTypeRegex = /"slug":\s*"([^"]+)"[\s\S]*?"type":\s*"([^"]+)"/g
const tours = []
let match
while ((match = slugTypeRegex.exec(toursFile)) !== null) {
  tours.push({ slug: match[1], type: match[2] })
}

const SITE_URL = 'https://www.hikasustravel.com'
const languages = ['en', 'es', 'fr', 'de', 'pl', 'cs', 'nl']
const today = new Date().toISOString().split('T')[0]

// ---------------------------------------------------------------------------
// <lastmod> — real per-route dates, not the build date.
//
// Stamping every URL with `today` on each build told Google that all 2,695
// pages changed daily, which makes the signal worthless. Instead each route is
// fingerprinted from the content that actually renders it (its SEO entry plus
// its body in all seven locale files). The fingerprint and the date it was
// first seen live in scripts/sitemap-lastmod.json, which is committed: a route
// keeps its stored date until its content genuinely changes.
//
// The manifest is keyed by the language-independent path, so one entry covers
// all seven locale URLs. That matches how this project changes content — every
// edit ships in all 7 locales in the same commit (see the multilingual rule) —
// and keeps the manifest at 385 entries instead of 2,695.
//
// GENERATED FILE: scripts/sitemap-lastmod.json is written by this script.
// Do not hand-edit it; editing a date there is how you would fake a lastmod.
// ---------------------------------------------------------------------------
const MANIFEST_PATH = join(__dirname, 'sitemap-lastmod.json')

const readJson = (p) => {
  try { return JSON.parse(readFileSync(p, 'utf-8')) } catch { return {} }
}
const localeFile = (name) => Object.fromEntries(
  languages.map((l) => [l, readJson(join(__dirname, `../src/i18n/locales/${l}/${name}.json`))]),
)
const pagesByLang = localeFile('pages')
const toursByLang = localeFile('tours')
const uiByLang = localeFile('ui')

// SEO copy is authored here (src/data/seo/*.json are generated from it).
const { seo } = await import(
  pathToFileURL(join(__dirname, '../src/data/seoData.source.js')).href
)

const blogSource = readFileSync(join(__dirname, '../src/data/blogData.js'), 'utf-8')

// Per-slug slice of a data file, so a tour/article fingerprint only moves when
// that entry changes rather than whenever any neighbour in the file does.
// blogData.js mixes quoting styles (`slug: '…'` for the first article, `"slug":
// "…"` for the rest), so both are accepted. `formerSlug`/`formerSlugs` carry a
// capital S and therefore cannot be caught by this lowercase pattern.
function chunkForSlug(source, slug) {
  const marks = [...source.matchAll(/["']?slug["']?\s*:\s*["']([^"']+)["']/g)]
  for (let i = 0; i < marks.length; i++) {
    if (marks[i][1] !== slug) continue
    const end = i + 1 < marks.length ? marks[i + 1].index : source.length
    return source.slice(marks[i].index, end)
  }
  return ''
}

// Static path -> SEO key. Mirrors seoPageMap in scripts/prerender.js; the guard
// below fails the build if a sitemap path has no fingerprint source, which is
// what would happen if a new page were added to one file and not the other.
const STATIC_SEO_KEYS = {
  '': 'home',
  'about-us': 'aboutUs',
  'about-georgia': 'aboutGeorgia',
  'georgian-lari-currency-guide': 'lariGuide',
  'georgia-visa-entry-requirements': 'visaGuide',
  'languages-of-georgia': 'languagesGuide',
  'kutaisi-international-airport': 'airportGuide',
  'tbilisi-international-airport': 'tbilisiAirportGuide',
  'tbilisi-metro': 'tbilisiMetro',
  'tbilisi-railway-station': 'tbilisiRailwayStation',
  abkhazia: 'abkhazia',
  georgia: 'destinations',
  'georgia/regions': 'destinationsRegions',
  'georgia/cities': 'destinationsCities',
  'georgia/places-to-visit': 'destinationsPlaces',
  'private-tours': 'privateTours',
  'group-tours': 'groupTours',
  'shuttle-service': 'shuttle',
  embassies: 'embassies',
  blog: 'blog',
  faq: 'faq',
  contact: 'contact',
  'privacy-policy': 'privacy',
  'terms-and-conditions': 'terms',
}

// Everything that renders a given route, in every locale. Anything the visitor
// can read should be in here, so an edit to it moves the date.
function contentSourcesFor(path, seoKeyByPath, entityByPath, tourByPath) {
  const parts = []
  const seoKey = seoKeyByPath.get(path)
  if (seoKey) {
    parts.push(seo[seoKey] ?? null)
    for (const l of languages) parts.push(pagesByLang[l]?.[seoKey] ?? null)
  }

  const tour = tourByPath.get(path)
  if (tour) {
    parts.push(chunkForSlug(toursFile, tour.slug))
    for (const l of languages) parts.push(toursByLang[l]?.[tour.slug] ?? null)
  }

  const entity = entityByPath.get(path)
  if (entity) {
    parts.push(entity.name, entity.tourSlugs)
    for (const l of languages) {
      parts.push(uiByLang[l]?.['tours.listMetaTitle'] ?? null)
      parts.push(uiByLang[l]?.['tours.listMetaDescription'] ?? null)
    }
  }

  if (path.startsWith('blog/')) {
    const slug = path.slice('blog/'.length)
    parts.push(chunkForSlug(blogSource, slug))
  }

  return parts.filter((p) => p !== null && p !== '' && p !== undefined)
}

const staticPages = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: 'about-us', changefreq: 'monthly', priority: '0.7' },
  { path: 'about-georgia', changefreq: 'monthly', priority: '0.7' },
  { path: 'georgian-lari-currency-guide', changefreq: 'monthly', priority: '0.6' },
  { path: 'georgia-visa-entry-requirements', changefreq: 'monthly', priority: '0.7' },
  { path: 'languages-of-georgia', changefreq: 'monthly', priority: '0.6' },
  { path: 'kutaisi-international-airport', changefreq: 'monthly', priority: '0.6' },
  { path: 'tbilisi-international-airport', changefreq: 'monthly', priority: '0.6' },
  { path: 'tbilisi-metro', changefreq: 'monthly', priority: '0.6' },
  { path: 'tbilisi-railway-station', changefreq: 'monthly', priority: '0.6' },
  { path: 'abkhazia', changefreq: 'monthly', priority: '0.5' },
  { path: 'georgia', changefreq: 'monthly', priority: '0.7' },
  { path: 'georgia/regions', changefreq: 'monthly', priority: '0.7' },
  { path: 'georgia/cities', changefreq: 'monthly', priority: '0.7' },
  { path: 'georgia/places-to-visit', changefreq: 'monthly', priority: '0.7' },
  // City detail pages and their things-to-do guides come from the destination
  // registry below (publishedDestinationPages), so they are not listed here.
  { path: 'private-tours', changefreq: 'weekly', priority: '0.9' },
  { path: 'group-tours', changefreq: 'weekly', priority: '0.9' },
  { path: 'shuttle-service', changefreq: 'monthly', priority: '0.8' },
  { path: 'embassies', changefreq: 'monthly', priority: '0.7' },
  { path: 'blog', changefreq: 'weekly', priority: '0.8' },
  { path: 'blog/ultimate-guide-to-traveling-to-georgia', changefreq: 'monthly', priority: '0.8' },
  { path: 'blog/essential-georgian-words-phrases', changefreq: 'monthly', priority: '0.8' },
  { path: 'blog/why-georgia-is-called-georgia-sakartvelo', changefreq: 'monthly', priority: '0.8' },
  { path: 'blog/georgian-flag-history-meaning', changefreq: 'monthly', priority: '0.8' },
  { path: 'faq', changefreq: 'monthly', priority: '0.5' },
  { path: 'contact', changefreq: 'monthly', priority: '0.6' },
  { path: 'privacy-policy', changefreq: 'yearly', priority: '0.2' },
  { path: 'terms-and-conditions', changefreq: 'yearly', priority: '0.2' },
]

// Build all route paths (language-independent)
const allPaths = []

for (const page of staticPages) {
  allPaths.push({ path: page.path, changefreq: page.changefreq, priority: page.priority })
}

for (const tour of tours) {
  const prefix = tour.type === 'group' ? 'group-tours' : 'private-tours'
  allPaths.push({ path: `${prefix}/${tour.slug}`, changefreq: 'monthly', priority: '0.8' })
}

// Published destination detail pages (cities/regions/sites) at their nested URLs.
for (const dest of publishedDestinationPages()) {
  allPaths.push({ path: dest.path, changefreq: 'monthly', priority: '0.7' })
}

// Published border-crossing pages (overview + individual crossings).
for (const ep of entityTourPages) {
  allPaths.push({ path: ep.path, changefreq: 'monthly', priority: '0.6' })
}

for (const bp of publishedBorderPages()) {
  allPaths.push({ path: bp.path, changefreq: 'monthly', priority: '0.7' })
}

// A path emitted twice would become a duplicate <url> for all seven locales.
const seenPaths = new Set()
for (const p of allPaths) {
  if (seenPaths.has(p.path)) throw new Error(`Duplicate sitemap path: "${p.path}"`)
  seenPaths.add(p.path)
}

// ---------------------------------------------------------------------------
// Resolve each path to its content, fingerprint it, and carry forward the date
// from the manifest when nothing changed.
// ---------------------------------------------------------------------------
const seoKeyByPath = new Map(Object.entries(STATIC_SEO_KEYS))
for (const dest of publishedDestinationPages()) seoKeyByPath.set(dest.path, dest.seoKey)
for (const bp of publishedBorderPages()) seoKeyByPath.set(bp.path, bp.seoKey)

const entityByPath = new Map(entityTourPages.map((ep) => [ep.path, ep]))
const tourByPath = new Map(tours.map((t) => [
  `${t.type === 'group' ? 'group-tours' : 'private-tours'}/${t.slug}`, t,
]))

const previous = existsSync(MANIFEST_PATH) ? readJson(MANIFEST_PATH) : {}
const manifest = {}
const lastmodByPath = new Map()
const unfingerprinted = []
let changedCount = 0

for (const { path } of allPaths) {
  const sources = contentSourcesFor(path, seoKeyByPath, entityByPath, tourByPath)
  if (!sources.length) unfingerprinted.push(path)

  const hash = createHash('sha1').update(JSON.stringify(sources)).digest('hex').slice(0, 16)
  const prior = previous[path]
  // Unchanged content keeps the date it was last actually edited.
  const lastmod = prior && prior.hash === hash ? prior.lastmod : today
  if (!prior || prior.hash !== hash) changedCount++

  manifest[path] = { hash, lastmod }
  lastmodByPath.set(path, lastmod)
}

// A route with no resolvable content would silently freeze on the build date,
// which is the exact failure this change exists to remove.
if (unfingerprinted.length) {
  console.error('Paths with no content source (add them to STATIC_SEO_KEYS or a registry):')
  unfingerprinted.forEach((p) => console.error(`  /${p}`))
  throw new Error(`${unfingerprinted.length} sitemap path(s) could not be fingerprinted`)
}

// Sorted so the committed manifest diffs cleanly instead of reordering.
const sortedManifest = Object.fromEntries(
  Object.keys(manifest).sort().map((k) => [k, manifest[k]]),
)
writeFileSync(MANIFEST_PATH, JSON.stringify(sortedManifest, null, 2) + '\n', 'utf-8')

const droppedFromManifest = Object.keys(previous).filter((p) => !(p in manifest))

// Generate URL entries with hreflang alternates
const urlEntries = []

for (const lang of languages) {
  for (const { path, changefreq, priority } of allPaths) {
    const loc = withTrailingSlash(path
      ? `${SITE_URL}/${lang}/${path}`
      : `${SITE_URL}/${lang}`)

    // Build hreflang alternates
    const hreflangs = languages.map(altLang => {
      const altUrl = withTrailingSlash(path
        ? `${SITE_URL}/${altLang}/${path}`
        : `${SITE_URL}/${altLang}`)
      return `      <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`
    })
    // x-default points to English
    const xDefaultUrl = withTrailingSlash(path ? `${SITE_URL}/en/${path}` : `${SITE_URL}/en`)
    hreflangs.push(`      <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`)

    urlEntries.push({ loc, lastmod: lastmodByPath.get(path), changefreq, priority, hreflangs })
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${u.hreflangs.join('\n')}
  </url>`).join('\n')}
</urlset>
`

const outPath = join(__dirname, '../public/sitemap.xml')
writeFileSync(outPath, xml, 'utf-8')
console.log(`Sitemap generated: ${urlEntries.length} URLs written to public/sitemap.xml`)

const distinctDates = new Set(lastmodByPath.values()).size
console.log(
  `lastmod: ${allPaths.length} routes, ${distinctDates} distinct date(s); `
  + `${changedCount} route(s) re-dated to ${today}, `
  + `${allPaths.length - changedCount} kept their stored date`,
)
if (droppedFromManifest.length) {
  console.log(`pruned ${droppedFromManifest.length} route(s) no longer published from the manifest`)
}
