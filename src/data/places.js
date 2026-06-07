/**
 * Central registry for the Destinations section.
 *
 * One source of truth for which region / city / tourist-site pages exist,
 * how they relate, and what their canonical URLs are. Routing, the build
 * scripts (prerender.js, generate-sitemap.js) and the destination components
 * all read from here, so adding a new place is a data edit — set
 * `published: true` and add its content to pages.json + SEO to seoData.js.
 *
 * URL scheme (all language-prefixed at runtime, e.g. /en/...). The whole
 * Georgia destinations tree is rooted at /georgia:
 *   Hub:        /georgia | /georgia/regions | /georgia/cities | /georgia/places-to-visit
 *   Region:     /georgia/regions/<slug>
 *   City:       /georgia/<slug>
 *   Things to do: /georgia/<city>/things-to-do-in-<city>
 *   Site:       /georgia/<city>/places-to-visit/<slug>   (city-parented)
 *               /georgia/regions/<region>/places-to-visit/<slug>   (region-parented)
 *
 * The previous scheme lived under /destinations/... and the city/things-to-do
 * pages under /destinations/cities/<slug> and /things-to-do-in-<slug>; those
 * old URLs now 301-redirect here (see legacyRedirects()).
 *
 * A tourist site nests under its parent CITY when it is clearly inside that
 * city, otherwise under its REGION. Each site therefore has exactly ONE
 * canonical URL; other pages (a nearby city, the global places-to-visit hub)
 * link to that single URL rather than duplicating it.
 *
 * A city's "things to do" guide is data-driven too: give the city a
 * `thingsToDo` block (seoKey + contentKey + image + attractions list) and the
 * route, sitemap, prerender, and the city page's CTA card all pick it up.
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
  {
    slug: 'tbilisi', name: 'Tbilisi', region: null, published: true,
    seoKey: 'tbilisi', contentKey: 'tbilisi', image: '/images/files/tbilisi.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoTbilisi', contentKey: 'thingsToDoTbilisi', image: '/images/files/tbilisi.jpg',
      address: { addressLocality: 'Tbilisi' },
      attractions: [
        'Old Town (Dzveli Tbilisi)', 'Abanotubani Sulfur Baths', 'Narikala Fortress',
        'Holy Trinity Cathedral (Sameba)', 'Georgian National Museum', 'Rustaveli Avenue', 'Mtatsminda',
      ],
    },
  },
  {
    slug: 'akhaltsikhe', name: 'Akhaltsikhe', region: 'samtskhe-javakheti', published: true,
    seoKey: 'akhaltsikhe', contentKey: 'akhaltsikhe', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoAkhaltsikhe', contentKey: 'thingsToDoAkhaltsikhe', image: '/images/files/georgia-home.jpg',
      address: { addressRegion: 'Samtskhe-Javakheti' },
      attractions: ['Rabati Castle', 'Vardzia cave monastery', 'Khertvisi Fortress', 'Sapara Monastery', 'Borjomi'],
    },
  },
  {
    slug: 'ambrolauri', name: 'Ambrolauri', region: 'racha-lechkhumi', published: true,
    seoKey: 'ambrolauri', contentKey: 'ambrolauri', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoAmbrolauri', contentKey: 'thingsToDoAmbrolauri', image: '/images/files/georgia-home.jpg',
      address: { addressRegion: 'Racha' },
      attractions: ['Khvanchkara wineries', 'Nikortsminda Cathedral', 'Shaori Lake', 'Racha villages', 'Rioni River'],
    },
  },
  {
    slug: 'bakuriani', name: 'Bakuriani', region: 'samtskhe-javakheti', published: true,
    seoKey: 'bakuriani', contentKey: 'bakuriani', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoBakuriani', contentKey: 'thingsToDoBakuriani', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Bakuriani' },
      attractions: [
        'Didveli Ski Area', 'Kokhta Ski Area', 'Ski and Snowboard Lessons',
        'Snow Activities (Sledding and Snowmobiling)', 'Forest Hiking Trails', 'Mountain Biking',
        'Kukushka Narrow-Gauge Railway', 'Borjomi',
      ],
    },
  },
  {
    slug: 'kutaisi', name: 'Kutaisi', region: 'imereti', published: true,
    seoKey: 'kutaisi', contentKey: 'kutaisi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoKutaisi', contentKey: 'thingsToDoKutaisi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Kutaisi' },
      attractions: ['Gelati Monastery', 'Bagrati Cathedral', 'Motsameta Monastery', 'Prometheus Cave', 'Martvili Canyon', 'Okatse Canyon', 'Sataplia Nature Reserve', 'Tskaltubo'],
    },
  },
  {
    slug: 'tskaltubo', name: 'Tskaltubo', region: 'imereti', published: true,
    seoKey: 'tskaltubo', contentKey: 'tskaltubo', image: '/images/files/georgia-home.jpg',
  },
  {
    slug: 'chiatura', name: 'Chiatura', region: 'imereti', published: true,
    seoKey: 'chiatura', contentKey: 'chiatura', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoChiatura', contentKey: 'thingsToDoChiatura', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Chiatura' },
      attractions: ['Chiatura Cable Cars', 'Katskhi Pillar', 'Mghvimevi Monastery', 'Kvirila River Canyon'],
    },
  },
  {
    slug: 'batumi', name: 'Batumi', region: 'adjara', published: true,
    seoKey: 'batumi', contentKey: 'batumi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoBatumi', contentKey: 'thingsToDoBatumi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Batumi' },
      attractions: [
        'Batumi Boulevard', 'Ali and Nino Sculpture', 'Batumi Botanical Garden',
        'Old Batumi (Europe Square)', 'Gonio Fortress', 'Argo Cable Car', 'Makhuntseti Waterfall',
      ],
    },
  },
  {
    slug: 'mtskheta', name: 'Mtskheta', region: 'mtskheta-mtianeti', published: true,
    seoKey: 'mtskheta', contentKey: 'mtskheta', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoMtskheta', contentKey: 'thingsToDoMtskheta', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Mtskheta' },
      attractions: ['Svetitskhoveli Cathedral', 'Jvari Monastery', 'Samtavro Monastery', 'Shio-Mgvime Monastery', 'Armaztsikhe-Bagineti', 'Zedazeni Monastery', 'Bebristsikhe Fortress'],
    },
  },
  {
    slug: 'mestia', name: 'Mestia', region: 'svaneti', published: true,
    seoKey: 'mestia', contentKey: 'mestia', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoMestia', contentKey: 'thingsToDoMestia', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Mestia' },
      attractions: ['Svan Towers', 'Svaneti History and Ethnography Museum', 'Margiani House Museum', 'Chalaadi Glacier', 'Ushguli', 'Hatsvali Cable Car', 'Tetnuldi Ski Resort'],
    },
  },
  {
    slug: 'martvili', name: 'Martvili', region: 'samegrelo', published: true,
    seoKey: 'martvili', contentKey: 'martvili', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoMartvili', contentKey: 'thingsToDoMartvili', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Martvili' },
      attractions: ['Martvili Canyon', 'Martvili Monastery', 'Balda Canyon', 'Abasha River'],
    },
  },
  {
    slug: 'telavi', name: 'Telavi', region: 'kakheti', published: true,
    seoKey: 'telavi', contentKey: 'telavi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoTelavi', contentKey: 'thingsToDoTelavi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Telavi' },
      attractions: ['Batonis Tsikhe', 'Alaverdi Monastery', 'Ikalto Monastery', 'Tsinandali Estate', 'Gremi', 'Shuamta Monasteries', 'Nadikvari Viewpoint'],
    },
  },
  {
    slug: 'oni', name: 'Oni', region: 'racha-lechkhumi', published: true,
    seoKey: 'oni', contentKey: 'oni', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoOni', contentKey: 'thingsToDoOni', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Oni' },
      attractions: ['Oni Synagogue', 'Rioni River Valley', 'Shovi Mountain Resort', 'Racha Villages'],
    },
  },
  {
    slug: 'gurjaani', name: 'Gurjaani', region: 'kakheti', published: true,
    seoKey: 'gurjaani', contentKey: 'gurjaani', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoGurjaani', contentKey: 'thingsToDoGurjaani', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Gurjaani' },
      attractions: ['Gurjaani Kvelatsminda Church', 'Velistsikhe Wine Museum', 'Nekresi Monastery', 'Alazani Valley'],
    },
  },
  {
    slug: 'sighnaghi', name: 'Sighnaghi', region: 'kakheti', published: true,
    seoKey: 'sighnaghi', contentKey: 'sighnaghi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoSighnaghi', contentKey: 'thingsToDoSighnaghi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Sighnaghi' },
      attractions: ['Sighnaghi City Walls', 'Bodbe Monastery', 'Alazani Valley Viewpoint', 'Sighnaghi Museum'],
    },
  },
  {
    slug: 'rustavi', name: 'Rustavi', region: 'kvemo-kartli', published: true,
    seoKey: 'rustavi', contentKey: 'rustavi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoRustavi', contentKey: 'thingsToDoRustavi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Rustavi' },
      attractions: ['Rustavi International Motorpark', 'Rustavi Central Park', 'Rustavi History Museum', 'David Gareja Monastery'],
    },
  },
  {
    slug: 'kvareli', name: 'Kvareli', region: 'kakheti', published: true,
    seoKey: 'kvareli', contentKey: 'kvareli', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoKvareli', contentKey: 'thingsToDoKvareli', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Kvareli' },
      attractions: ['Khareba Winery Wine Tunnel', 'Nekresi Monastery', 'Kvareli Lake', 'Ilia Chavchavadze Museum'],
    },
  },
  {
    slug: 'gori', name: 'Gori', region: 'shida-kartli', published: true,
    seoKey: 'gori', contentKey: 'gori', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoGori', contentKey: 'thingsToDoGori', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Gori' },
      attractions: ['Joseph Stalin Museum', 'Gori Fortress', 'Uplistsikhe Cave Town', 'Great Patriotic War Museum'],
    },
  },
  {
    slug: 'borjomi', name: 'Borjomi', region: 'samtskhe-javakheti', published: true,
    seoKey: 'borjomi', contentKey: 'borjomi', image: '/images/files/borjomi-town.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoBorjomi', contentKey: 'thingsToDoBorjomi', image: '/images/files/borjomi-town.jpg',
      address: { addressLocality: 'Borjomi' },
      attractions: [
        'Borjomi Central Park', 'Borjomi Mineral Water Spring', 'Borjomi Sulfur Pools',
        'Borjomi Cable Car', 'Borjomi-Kharagauli National Park', 'Likani Romanov Palace Grounds',
      ],
    },
  },
  {
    slug: 'kazbegi-stepantsminda', name: 'Kazbegi (Stepantsminda)', region: 'mtskheta-mtianeti', published: true,
    seoKey: 'kazbegiStepantsminda', contentKey: 'kazbegiStepantsminda', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoKazbegiStepantsminda', contentKey: 'thingsToDoKazbegiStepantsminda', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Stepantsminda' },
      attractions: ['Gergeti Trinity Church', 'Juta Valley & Chaukhi Mountains', 'Truso Valley', 'Gergeti Glacier', 'Gveleti Waterfalls', 'Dariali Gorge', 'Russia-Georgia Friendship Monument'],
    },
  },
  {
    slug: 'gudauri', name: 'Gudauri', region: 'mtskheta-mtianeti', published: true,
    seoKey: 'gudauri', contentKey: 'gudauri', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoGudauri', contentKey: 'thingsToDoGudauri', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Gudauri' },
      attractions: ['Gudauri Ski Resort', 'Russia-Georgia Friendship Monument', 'Ananuri Fortress', 'Kazbegi (Stepantsminda)'],
    },
  },
  {
    slug: 'dmanisi', name: 'Dmanisi', region: 'kvemo-kartli', published: true,
    seoKey: 'dmanisi', contentKey: 'dmanisi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoDmanisi', contentKey: 'thingsToDoDmanisi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Dmanisi' },
      attractions: ['Dmanisi Archaeological Site', 'Dmanisi Medieval Town Ruins', 'Dmanisi Sioni Cathedral', 'Dmanisi Museum-Reserve'],
    },
  },
  {
    slug: 'bolnisi', name: 'Bolnisi', region: 'kvemo-kartli', published: true,
    seoKey: 'bolnisi', contentKey: 'bolnisi', image: '/images/files/georgia-home.jpg',
    thingsToDo: {
      seoKey: 'thingsToDoBolnisi', contentKey: 'thingsToDoBolnisi', image: '/images/files/georgia-home.jpg',
      address: { addressLocality: 'Bolnisi' },
      attractions: [
        'Bolnisi Sioni Cathedral', 'German Heritage (Katharinenfeld)', 'Dmanisi Archaeological Site',
        'Kvemo Kartli Countryside', 'Local Markets and Life', 'Kvemo Kartli Wineries',
      ],
    },
  },
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
// Canonical path builders (NOT language-prefixed — callers add /<lang>).
// The whole tree is rooted at /georgia.
// ---------------------------------------------------------------------------
export const destinationsBase = '/georgia'
export const regionsHubPath = '/georgia/regions'
export const citiesHubPath = '/georgia/cities'
export const placesHubPath = '/georgia/places-to-visit'

export const regionPath = (slug) => `/georgia/regions/${slug}`
export const cityPath = (slug) => `/georgia/${slug}`
export const thingsToDoPath = (citySlug) => `/georgia/${citySlug}/things-to-do-in-${citySlug}`
export const sitePath = (site) => {
  const base = site.parentType === 'city'
    ? `/georgia/${site.parent}`
    : `/georgia/regions/${site.parent}`
  return `${base}/places-to-visit/${site.slug}`
}

// ---------------------------------------------------------------------------
// Build-pipeline helpers: published destination detail pages, plus the legacy
// flat city URLs that must redirect to their new nested location.
// ---------------------------------------------------------------------------
export function publishedDestinationPages() {
  const pages = []
  for (const r of regions) if (r.published) pages.push({ path: cleanPath(regionPath(r.slug)), seoKey: r.seoKey, image: r.image })
  for (const c of cities) if (c.published) {
    pages.push({ path: cleanPath(cityPath(c.slug)), seoKey: c.seoKey, image: c.image })
    if (c.thingsToDo) {
      pages.push({
        path: cleanPath(thingsToDoPath(c.slug)),
        seoKey: c.thingsToDo.seoKey,
        image: c.thingsToDo.image || c.image,
      })
    }
  }
  for (const s of sites) if (s.published) pages.push({ path: cleanPath(sitePath(s)), seoKey: s.seoKey, image: s.image })
  return pages
}

// Old URLs -> their new /georgia home. Consumed by the build (static redirect
// stubs in prerender.js) and mirrored client-side by the SPA router.
//   `from` = old path (no leading slash); `to` = new path (no leading slash).
export function legacyRedirects() {
  const out = [
    { from: 'destinations', to: cleanPath(destinationsBase) },
    { from: 'destinations/regions', to: cleanPath(regionsHubPath) },
    { from: 'destinations/cities', to: cleanPath(citiesHubPath) },
    { from: 'destinations/places-to-visit', to: cleanPath(placesHubPath) },
  ]
  for (const c of cities) {
    if (!c.published) continue
    out.push({ from: `destinations/cities/${c.slug}`, to: cleanPath(cityPath(c.slug)) }) // old nested city
    out.push({ from: `destinations/${c.slug}`, to: cleanPath(cityPath(c.slug)) })        // legacy flat city
    if (c.thingsToDo) out.push({ from: `things-to-do-in-${c.slug}`, to: cleanPath(thingsToDoPath(c.slug)) })
  }
  for (const r of regions) if (r.published) out.push({ from: `destinations/regions/${r.slug}`, to: cleanPath(regionPath(r.slug)) })
  return out
}

const cleanPath = (p) => p.replace(/^\//, '')
