/**
 * Central registry for the Destinations section.
 *
 * One source of truth for which region / city / tourist-site pages exist,
 * how they relate, and what their canonical URLs are. Routing, the build
 * scripts (prerender.js, generate-sitemap.js) and the destination components
 * all read from here, so adding a new place is a data edit — set
 * `published: true` and add its content to pages.json + SEO to seoData.js.
 *
 * URL scheme (all language-prefixed at runtime, e.g. /en/...):
 *   Hub:    /destinations/regions | /destinations/cities | /destinations/places-to-visit
 *   Region: /destinations/regions/<slug>
 *   City:   /destinations/cities/<slug>
 *   Site:   /destinations/<cities|regions>/<parent>/places-to-visit/<slug>
 *
 * A tourist site nests under its parent CITY when it is clearly inside that
 * city, otherwise under its REGION. Each site therefore has exactly ONE
 * canonical URL; other pages (a nearby city, the global places-to-visit hub)
 * link to that single URL rather than duplicating it.
 */

export const SITE_URL = 'https://www.hikasustravel.com'

// ---------------------------------------------------------------------------
// Regions of Georgia (tourism taxonomy). `name` is the English/house-style
// proper name used for schema + fallback; localized names come from pages.json.
// ---------------------------------------------------------------------------
export const regions = [
  { slug: 'kakheti', name: 'Kakheti', published: false },
  { slug: 'imereti', name: 'Imereti', published: false },
  { slug: 'adjara', name: 'Adjara', published: false },
  { slug: 'samtskhe-javakheti', name: 'Samtskhe-Javakheti', published: false },
  { slug: 'racha-lechkhumi', name: 'Racha-Lechkhumi', published: false },
  { slug: 'mtskheta-mtianeti', name: 'Mtskheta-Mtianeti', published: false },
  { slug: 'samegrelo', name: 'Samegrelo', published: false },
  { slug: 'svaneti', name: 'Svaneti', published: false },
  { slug: 'guria', name: 'Guria', published: false },
  { slug: 'shida-kartli', name: 'Shida Kartli', published: false },
  { slug: 'kvemo-kartli', name: 'Kvemo Kartli', published: false },
]

// ---------------------------------------------------------------------------
// Cities. Published cities carry the keys their detail page needs:
//   seoKey     -> key in src/data/seoData.js
//   contentKey -> key in src/i18n/locales/<lang>/pages.json (HTML body + FAQ)
//   image      -> hero image path
//   region     -> parent region slug (for breadcrumbs / cross-links)
// ---------------------------------------------------------------------------
export const cities = [
  { slug: 'tbilisi', name: 'Tbilisi', region: null, published: true, seoKey: 'tbilisi', contentKey: 'tbilisi', image: '/images/files/tbilisi.jpg' },
  { slug: 'akhaltsikhe', name: 'Akhaltsikhe', region: 'samtskhe-javakheti', published: true, seoKey: 'akhaltsikhe', contentKey: 'akhaltsikhe', image: '/images/files/georgia-home.jpg' },
  { slug: 'ambrolauri', name: 'Ambrolauri', region: 'racha-lechkhumi', published: true, seoKey: 'ambrolauri', contentKey: 'ambrolauri', image: '/images/files/georgia-home.jpg' },
  { slug: 'bakuriani', name: 'Bakuriani', region: 'samtskhe-javakheti', published: true, seoKey: 'bakuriani', contentKey: 'bakuriani', image: '/images/files/georgia-home.jpg' },
  { slug: 'kutaisi', name: 'Kutaisi', region: 'imereti', published: false },
  { slug: 'batumi', name: 'Batumi', region: 'adjara', published: false },
  { slug: 'mtskheta', name: 'Mtskheta', region: 'mtskheta-mtianeti', published: false },
  { slug: 'telavi', name: 'Telavi', region: 'kakheti', published: false },
  { slug: 'sighnaghi', name: 'Sighnaghi', region: 'kakheti', published: false },
  { slug: 'borjomi', name: 'Borjomi', region: 'samtskhe-javakheti', published: false },
  { slug: 'stepantsminda', name: 'Stepantsminda (Kazbegi)', region: 'mtskheta-mtianeti', published: false },
]

// ---------------------------------------------------------------------------
// Tourist sites. `parentType` = 'city' | 'region', `parent` = that slug.
// None are published yet; they appear on the places-to-visit hub as plain
// text (no link) until their detail page is created.
// ---------------------------------------------------------------------------
export const sites = [
  { slug: 'narikala-fortress', name: 'Narikala Fortress', parentType: 'city', parent: 'tbilisi', published: false },
  { slug: 'jvari-monastery', name: 'Jvari Monastery', parentType: 'city', parent: 'mtskheta', published: false },
  { slug: 'uplistsikhe-cave-town', name: 'Uplistsikhe Cave Town', parentType: 'region', parent: 'shida-kartli', published: false },
  { slug: 'prometheus-cave', name: 'Prometheus Cave', parentType: 'region', parent: 'imereti', published: false },
  { slug: 'gelati-monastery', name: 'Gelati Monastery', parentType: 'region', parent: 'imereti', published: false },
  { slug: 'vardzia', name: 'Vardzia', parentType: 'region', parent: 'samtskhe-javakheti', published: false },
  { slug: 'gergeti-trinity-church', name: 'Gergeti Trinity Church', parentType: 'region', parent: 'mtskheta-mtianeti', published: false },
  { slug: 'batumi-botanical-garden', name: 'Batumi Botanical Garden', parentType: 'region', parent: 'adjara', published: false },
  { slug: 'martvili-canyon', name: 'Martvili Canyon', parentType: 'region', parent: 'samegrelo', published: false },
  { slug: 'katskhi-pillar', name: 'Katskhi Pillar', parentType: 'region', parent: 'imereti', published: false },
]

// Wineries are intentionally an empty, scaffolded list — no winery pages are
// published yet. Add entries here (same shape as sites) when ready.
export const wineries = []

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------
export const getRegion = (slug) => regions.find((r) => r.slug === slug) || null
export const getCity = (slug) => cities.find((c) => c.slug === slug) || null
export const getSite = (slug) => sites.find((s) => s.slug === slug) || null

// ---------------------------------------------------------------------------
// Canonical path builders (NOT language-prefixed — callers add /<lang>)
// ---------------------------------------------------------------------------
export const regionPath = (slug) => `/destinations/regions/${slug}`
export const cityPath = (slug) => `/destinations/cities/${slug}`
export const sitePath = (site) => {
  const base = site.parentType === 'city'
    ? `/destinations/cities/${site.parent}`
    : `/destinations/regions/${site.parent}`
  return `${base}/places-to-visit/${site.slug}`
}

// ---------------------------------------------------------------------------
// Build-pipeline helpers: published destination detail pages, plus the legacy
// flat city URLs that must redirect to their new nested location.
// ---------------------------------------------------------------------------
export function publishedDestinationPages() {
  const pages = []
  for (const r of regions) if (r.published) pages.push({ path: cleanPath(regionPath(r.slug)), seoKey: r.seoKey, image: r.image })
  for (const c of cities) if (c.published) pages.push({ path: cleanPath(cityPath(c.slug)), seoKey: c.seoKey, image: c.image })
  for (const s of sites) if (s.published) pages.push({ path: cleanPath(sitePath(s)), seoKey: s.seoKey, image: s.image })
  return pages
}

// Old flat city URLs (e.g. destinations/tbilisi) -> new nested path.
export function legacyCityRedirects() {
  return cities
    .filter((c) => c.published)
    .map((c) => ({ from: `destinations/${c.slug}`, to: cleanPath(cityPath(c.slug)) }))
}

const cleanPath = (p) => p.replace(/^\//, '')
