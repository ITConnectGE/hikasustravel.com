/**
 * Pre-render SEO meta tags at build time.
 *
 * Reads dist/index.html as a template, then for every route × language
 * combination writes a directory-based HTML file with correct <title>,
 * <meta description>, <meta keywords>, OG tags, Twitter Card tags,
 * canonical URL, hreflang alternates, and <html lang>.
 *
 * Run after `vite build`:  node scripts/prerender.js
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'
import { load } from 'cheerio'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Canonical-URL helper (trailing-slash normalisation to match how the static
// host actually serves each page).
const { withTrailingSlash } = await import(
  pathToFileURL(join(__dirname, '../src/utils/url.js')).href
)

// Destination registry (regions / cities / sites) — published detail pages and
// the legacy flat-city URLs that must redirect to their new nested location.
const { publishedDestinationPages, legacyRedirects } = await import(
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
const DIST = join(__dirname, '..', 'dist')
const SITE_URL = 'https://www.hikasustravel.com'
const LANGS = ['en', 'es', 'fr', 'de', 'pl', 'cs', 'nl']

const localeMap = {
  en: 'en_US', es: 'es_ES', fr: 'fr_FR',
  de: 'de_DE', pl: 'pl_PL', cs: 'cs_CZ', nl: 'nl_NL',
}

// ---------------------------------------------------------------------------
// 1. Load data sources
// ---------------------------------------------------------------------------

// --- seoData.js (static page SEO) ---
// Parse the JS object manually since it uses `export function`
const seoFile = readFileSync(join(__dirname, '../src/data/seoData.js'), 'utf-8')

// Extract the seo object by evaluating it in a controlled way
function parseSeoData(source) {
  // Remove the export function at the bottom
  const objMatch = source.match(/const seo = (\{[\s\S]*?\n\})\s*\n/)
  if (!objMatch) throw new Error('Could not parse seoData.js')
  // Use Function constructor to evaluate the object literal
  const fn = new Function(`return ${objMatch[1]}`)
  return fn()
}

const seo = parseSeoData(seoFile)

function getSEO(pageKey, lang = 'en') {
  const page = seo[pageKey]
  if (!page) return { title: 'Hikasus Travel', description: '', keywords: '' }
  return page[lang] || page.en
}

// --- tours.js (tour slugs, types, titles, descriptions, images, days, itinerary) ---
const toursFile = readFileSync(join(__dirname, '../src/data/tours.js'), 'utf-8')

function parseTours(source) {
  const tours = []
  // Match each tour object to extract key fields, splitting the source by slug.
  // Split by slug to get chunks
  const slugMatches = [...source.matchAll(/"slug":\s*"([^"]+)"/g)]
  for (let i = 0; i < slugMatches.length; i++) {
    const start = slugMatches[i].index
    const end = i + 1 < slugMatches.length ? slugMatches[i + 1].index : source.length
    const chunk = source.slice(start, end)

    const slug = slugMatches[i][1]
    const typeM = chunk.match(/"type":\s*"([^"]+)"/)
    const titleM = chunk.match(/"title":\s*"([^"]+)"/)
    const descM = chunk.match(/"description":\s*"([^"]+)"/)
    const heroM = chunk.match(/"heroImage":\s*"([^"]+)"/)
    // Optional dedicated 1.91:1 social image + dimensions (e.g. the Gudauri ski
    // tour). `ogImage` is `{ src, width, height }`; when absent, og:image falls
    // back to the hero below.
    const ogImageM = chunk.match(/"ogImage":\s*\{\s*"src":\s*"([^"]+)",\s*"width":\s*(\d+),\s*"height":\s*(\d+)/)
    // Per-locale hero alt text from imageMeta.alt (the first "alt": {...} block in
    // the tour object). Used as og:image:alt when a social image is defined.
    const altBlockM = chunk.match(/"alt":\s*\{([\s\S]*?)\}/)
    const imageAlt = {}
    if (altBlockM) {
      for (const m of altBlockM[1].matchAll(/"(\w+)":\s*"([^"]*)"/g)) imageAlt[m[1]] = m[2]
    }
    const daysM = chunk.match(/"days":\s*(\d+)/)
    const seoTitleM = chunk.match(/"seoTitle":\s*"([^"]+)"/)
    const metaDescM = chunk.match(/"metaDescription":\s*"([^"]+)"/)
    const formerSlugM = chunk.match(/"formerSlug":\s*"([^"]+)"/)
    // A tour renamed more than once carries an array of every prior slug so
    // each old URL keeps redirecting. Both `formerSlug` (single) and
    // `formerSlugs` (array) are supported and merged into one list.
    const formerSlugsM = chunk.match(/"formerSlugs":\s*\[([\s\S]*?)\]/)
    const formerSlugs = [
      ...(formerSlugM ? [formerSlugM[1]] : []),
      ...(formerSlugsM ? [...formerSlugsM[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : []),
    ]

    // Extract itinerary day titles for keywords
    const itineraryTitles = []
    const itinMatches = chunk.matchAll(/"title":\s*"(Day \d+[^"]+)"/g)
    for (const m of itinMatches) itineraryTitles.push(m[1])

    tours.push({
      slug,
      type: typeM?.[1] || 'private',
      title: titleM?.[1] || slug,
      description: descM?.[1] || '',
      seoTitle: seoTitleM?.[1] || '',
      metaDescription: metaDescM?.[1] || '',
      heroImage: heroM?.[1] || '',
      ogImage: ogImageM?.[1] || '',
      ogImageWidth: ogImageM?.[2] || '',
      ogImageHeight: ogImageM?.[3] || '',
      imageAlt,
      days: daysM ? parseInt(daysM[1]) : 0,
      formerSlugs,
      itineraryTitles,
    })
  }
  return tours
}

const tours = parseTours(toursFile)

// --- Tour translations (per language) ---
function loadTourTranslations(lang) {
  try {
    const filePath = join(__dirname, `../src/i18n/locales/${lang}/tours.json`)
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch {
    return {}
  }
}

// --- Blog data ---
const blogArticles = [
  {
    slug: 'ultimate-guide-to-traveling-to-georgia',
    titleKey: 'blog.article1.title',
    title: 'The Ultimate Guide to Traveling to Georgia: Everything You Need to Know Before You Go',
    excerpt: 'From visa requirements and the best time to visit, to must-try dishes, ancient wine traditions, and hidden gems most tourists never find — this is the only Georgia travel guide you will ever need.',
    heroImage: '/images/files/georgia-home.jpg',
    tags: ['travel-guide', 'visa', 'food', 'wine', 'culture'],
  },
  {
    slug: 'essential-georgian-words-phrases',
    titleKey: 'blog.article2.title',
    descKey: 'blog.article2.desc',
    title: '25 Essential Georgian Words and Phrases for Travelers',
    seoTitle: '25 Essential Georgian Words & Phrases for Travelers',
    excerpt: 'Learn 25 essential Georgian words and phrases — hello, thank you, cheers, and more — with simple pronunciation, for travelers to Georgia (the country).',
    metaDescription: 'Learn 25 essential Georgian words and phrases — hello, thank you, cheers, and more — with simple pronunciation, for travelers to Georgia (the country).',
    heroImage: '/images/files/sulfur-baths-wine-tour.jpg',
    tags: ['language', 'culture', 'travel-tips'],
  },
  {
    slug: 'why-georgia-is-called-georgia-sakartvelo',
    titleKey: 'blog.article3.title',
    descKey: 'blog.article3.desc',
    title: "Why Is Georgia Called Georgia — and Why Do Georgians Call It Sakartvelo?",
    seoTitle: "Why Is Georgia Called Georgia — and Why Sakartvelo? | Hikasus Travel",
    excerpt: "Georgia is not named after St George — that's a medieval mistake that stuck. The real story runs through Persian, and Georgians call it Sakartvelo.",
    metaDescription: "Georgia is not named after St George — that's a medieval mistake that stuck. The real story runs through Persian, and Georgians call it Sakartvelo.",
    heroImage: '/images/files/georgia-home.jpg',
    tags: ['history', 'culture', 'language'],
  },
  {
    slug: 'georgian-flag-history-meaning',
    titleKey: 'blog.article4.title',
    descKey: 'blog.article4.desc',
    title: 'The Georgian Flag: Five Crosses, Eight Centuries, and One Revolution',
    seoTitle: 'The Georgian Flag: History, Meaning & the Five Crosses | Hikasus Travel',
    excerpt: "Georgia's five-cross flag looks medieval and is — but it only became the national flag in 2004, carried first as a protest banner. The real story is stranger than the legend.",
    metaDescription: "Georgia's five-cross flag looks medieval and is — but it only became the national flag in 2004, carried first as a protest banner. The real story is stranger than the legend.",
    heroImage: '/images/files/georgian-flag-five-cross-flag-georgia-1600.webp',
    ogImage: '/images/files/georgian-flag-five-cross-flag-georgia-og.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: {
      en: 'The national flag of Georgia, the Five Cross Flag, with a central red cross and four smaller crosses, waving against a blue sky',
      de: 'Die Nationalflagge Georgiens, die Fünf-Kreuz-Flagge, mit einem zentralen roten Kreuz und vier kleineren Kreuzen, vor blauem Himmel',
      fr: 'Le drapeau national de la Géorgie, le drapeau aux cinq croix, avec une grande croix rouge centrale et quatre petites croix, flottant sur un ciel bleu',
      es: 'La bandera nacional de Georgia, la bandera de las cinco cruces, con una cruz roja central y cuatro cruces más pequeñas, ondeando contra un cielo azul',
      nl: 'De nationale vlag van Georgië, de vijfkruisenvlag, met een centraal rood kruis en vier kleinere kruisen, wapperend tegen een blauwe lucht',
      cs: 'Státní vlajka Gruzie, vlajka pěti křížů, s ústředním červeným křížem a čtyřmi menšími kříži, vlající proti modré obloze',
      pl: 'Flaga narodowa Gruzji, flaga pięciu krzyży, z centralnym czerwonym krzyżem i czterema mniejszymi krzyżami, powiewająca na tle błękitnego nieba',
    },
    tags: ['history', 'culture', 'flag'],
  },
]

// Blog title translation for a given article key from ui.json
function loadBlogTitle(lang, key) {
  try {
    const ui = JSON.parse(readFileSync(join(__dirname, `../src/i18n/locales/${lang}/ui.json`), 'utf-8'))
    return ui[key] || null
  } catch {
    return null
  }
}

// Full ui.json for a locale (used for the entity-tours listing meta templates).
function loadUi(lang) {
  try {
    return JSON.parse(readFileSync(join(__dirname, `../src/i18n/locales/${lang}/ui.json`), 'utf-8'))
  } catch {
    return {}
  }
}
const interp = (tpl, name) => (tpl || '').replace(/\{name\}/g, name)

// ---------------------------------------------------------------------------
// 2. Define all routes
// ---------------------------------------------------------------------------

const seoPageMap = {
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
  'abkhazia': 'abkhazia',
  'georgia': 'destinations',
  'georgia/regions': 'destinationsRegions',
  'georgia/cities': 'destinationsCities',
  'georgia/places-to-visit': 'destinationsPlaces',
  // City detail pages + their things-to-do guides are emitted from the
  // destination registry (publishedDestinationPages), not from this map.
  'private-tours': 'privateTours',
  'group-tours': 'groupTours',
  'shuttle-service': 'shuttle',
  'embassies': 'embassies',
  'blog': 'blog',
  'faq': 'faq',
  'contact': 'contact',
  'privacy-policy': 'privacy',
  'terms-and-conditions': 'terms',
}

// Per-path og:image overrides for static pages (default is georgia-home.jpg).
const staticPageImages = {
  'kutaisi-international-airport': '/images/files/kutaisi-airport.jpg',
  'tbilisi-international-airport': '/images/files/tbilisi.jpg',
  'tbilisi-metro': '/images/files/tbilisi-metekhi-mtatsminda.jpg',
  'tbilisi-railway-station': '/images/files/old-tbilisi.jpg',
}

// ---------------------------------------------------------------------------
// 3. Build per-route HTML
// ---------------------------------------------------------------------------

const template = readFileSync(join(DIST, 'index.html'), 'utf-8')
let fileCount = 0

// Set a meta tag's content, appending the tag if the template doesn't have it.
// Used for the optional image-SEO tags (og:image:alt / width / height) that the
// base template doesn't ship. No-op when content is empty.
function setOrAppendMeta($, name, content, attr = 'property') {
  if (content === undefined || content === null || content === '') return
  const sel = `meta[${attr}="${name}"]`
  if ($(sel).length) $(sel).attr('content', String(content))
  else $('head').append(`<meta ${attr}="${name}" content="${escAttr(String(content))}">`)
}

function writeHtml(filePath, lang, { title, description, keywords, canonical, image, ogImage, ogImageAlt, ogImageWidth, ogImageHeight, ogLocale }) {
  // Use the trailing-slash form the host serves at 200; this also flows through
  // to the hreflang/x-default alternates and og:url derived from it below.
  canonical = withTrailingSlash(canonical)
  const $ = load(template)

  // html lang
  $('html').attr('lang', lang)

  // title
  $('title').text(title)

  // meta description
  $('meta[name="description"]').attr('content', description)

  // meta keywords
  if (keywords) {
    if ($('meta[name="keywords"]').length) {
      $('meta[name="keywords"]').attr('content', keywords)
    } else {
      $('head').append(`<meta name="keywords" content="${escAttr(keywords)}">`)
    }
  }

  // canonical
  $('link[rel="canonical"]').attr('href', canonical)

  // OG tags
  $('meta[property="og:title"]').attr('content', title)
  $('meta[property="og:description"]').attr('content', description)
  $('meta[property="og:url"]').attr('content', canonical)
  $('meta[property="og:locale"]').attr('content', ogLocale)
  // Prefer a dedicated 1.91:1 social image when supplied, otherwise the hero.
  const ogImg = ogImage || image
  if (ogImg) {
    const imgUrl = ogImg.startsWith('http') ? ogImg : `${SITE_URL}${ogImg}`
    $('meta[property="og:image"]').attr('content', imgUrl)
    setOrAppendMeta($, 'og:image:alt', ogImageAlt, 'property')
    setOrAppendMeta($, 'og:image:width', ogImageWidth, 'property')
    setOrAppendMeta($, 'og:image:height', ogImageHeight, 'property')
  }

  // Twitter Card
  $('meta[name="twitter:title"]').attr('content', title)
  $('meta[name="twitter:description"]').attr('content', description)
  if (ogImg) {
    const imgUrl = ogImg.startsWith('http') ? ogImg : `${SITE_URL}${ogImg}`
    $('meta[name="twitter:image"]').attr('content', imgUrl)
    setOrAppendMeta($, 'twitter:image:alt', ogImageAlt, 'name')
  }

  // Remove existing og:locale:alternate tags
  $('meta[property="og:locale:alternate"]').remove()

  // Add hreflang alternates
  // Remove any existing hreflang links
  $('link[rel="alternate"][hreflang]').remove()

  // Build the path portion from canonical (everything after SITE_URL/{lang})
  const canonicalPath = canonical.replace(`${SITE_URL}/${lang}`, '')

  for (const altLang of LANGS) {
    const altUrl = `${SITE_URL}/${altLang}${canonicalPath}`
    $('head').append(`<link rel="alternate" hreflang="${altLang}" href="${altUrl}">`)
    if (altLang !== lang) {
      const altLocale = localeMap[altLang]
      $('meta[property="og:locale"]').after(`<meta property="og:locale:alternate" content="${altLocale}">`)
    }
  }
  // x-default points to English version
  $('head').append(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}/en${canonicalPath}">`)

  // Write file
  const dir = dirname(filePath)
  mkdirSync(dir, { recursive: true })
  writeFileSync(filePath, $.html(), 'utf-8')
  fileCount++
}

function escAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Static redirect stub for an old URL -> its new canonical location. Crawlers
// without JS follow the meta-refresh + canonical; the SPA router redirects
// in-browser. Used for the legacy flat city URLs after the move under /cities.
function writeRedirectStub(filePath, target) {
  target = withTrailingSlash(target)
  const $ = load(template)
  $('head').prepend(`<meta http-equiv="refresh" content="0; url=${target}">`)
  $('link[rel="canonical"]').attr('href', target)
  $('meta[name="robots"]').remove()
  $('head').append('<meta name="robots" content="noindex, follow">')
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, $.html(), 'utf-8')
  fileCount++
}

// ---------------------------------------------------------------------------
// 4. Generate all pages
// ---------------------------------------------------------------------------

console.log('Pre-rendering SEO HTML files...')

for (const lang of LANGS) {
  const tourTrans = loadTourTranslations(lang)
  const ogLocale = localeMap[lang]

  // --- Static pages ---
  for (const [path, seoKey] of Object.entries(seoPageMap)) {
    const data = getSEO(seoKey, lang)
    const canonical = path
      ? `${SITE_URL}/${lang}/${path}`
      : `${SITE_URL}/${lang}`
    const filePath = path
      ? join(DIST, lang, path, 'index.html')
      : join(DIST, lang, 'index.html')

    writeHtml(filePath, lang, {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      canonical,
      image: staticPageImages[path] || '/images/files/georgia-home.jpg',
      ogLocale,
    })
  }

  // --- Destination detail pages (regions / cities / sites) from the registry ---
  for (const dest of publishedDestinationPages()) {
    const data = getSEO(dest.seoKey, lang)
    const canonical = `${SITE_URL}/${lang}/${dest.path}`
    const filePath = join(DIST, lang, dest.path, 'index.html')
    writeHtml(filePath, lang, {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      canonical,
      image: dest.image || '/images/files/georgia-home.jpg',
      // Optional image-SEO extras (only sites that define them, e.g. Batonis
      // Tsikhe): dedicated social image + dimensions + per-locale alt text.
      ogImage: dest.ogImage,
      ogImageAlt: dest.imageAlt?.[lang],
      ogImageWidth: dest.ogImageWidth,
      ogImageHeight: dest.ogImageHeight,
      ogLocale,
    })
  }

  // --- Border-crossing pages (overview guide + individual crossings) ---
  for (const bp of publishedBorderPages()) {
    const data = getSEO(bp.seoKey, lang)
    const canonical = `${SITE_URL}/${lang}/${bp.path}`
    const filePath = join(DIST, lang, bp.path, 'index.html')
    writeHtml(filePath, lang, {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      canonical,
      image: bp.image || '/images/files/georgia-home.jpg',
      ogLocale,
    })
  }

  // --- Old URLs (the /destinations tree + flat things-to-do) -> redirect
  //     stubs pointing at their new /georgia home. ---
  for (const { from, to } of legacyRedirects()) {
    const filePath = join(DIST, lang, from, 'index.html')
    writeRedirectStub(filePath, `${SITE_URL}/${lang}/${to}`)
  }

  // --- Tour detail pages ---
  for (const tour of tours) {
    const tt = tourTrans[tour.slug]
    const prefix = tour.type === 'group' ? 'group-tours' : 'private-tours'
    const title = `${tt?.seoTitle || tour.seoTitle || tt?.title || tour.title} | Hikasus Travel`
    const description = tt?.metaDescription || tour.metaDescription || (tt?.description || tour.description || '').slice(0, 160)

    // Generate keywords matching the runtime logic
    const typeLabel = tour.type === 'group' ? 'group tour' : 'private tour'
    const daysLabel = tour.days ? `${tour.days}-day Georgia tour` : 'Georgia tour'
    const itinKeywords = tour.itineraryTitles.map(loc => `${loc} tour`)
    const keywords = [
      `book ${typeLabel} Georgia`,
      daysLabel,
      ...itinKeywords,
      `Georgia ${typeLabel} itinerary`,
      'book Georgia adventure',
    ].join(', ')

    const canonical = `${SITE_URL}/${lang}/${prefix}/${tour.slug}`
    const filePath = join(DIST, lang, prefix, tour.slug, 'index.html')

    writeHtml(filePath, lang, {
      title,
      description,
      keywords,
      canonical,
      image: tour.heroImage,
      // When the tour ships a dedicated social image (1.91:1 og.jpg), use it for
      // og:image with a per-locale alt; otherwise og:image falls back to the hero
      // (no alt), matching the previous behaviour for every other tour.
      ogImage: tour.ogImage || undefined,
      ogImageAlt: tour.ogImage ? (tour.imageAlt?.[lang] || tour.imageAlt?.en || undefined) : undefined,
      ogImageWidth: tour.ogImage ? tour.ogImageWidth : undefined,
      ogImageHeight: tour.ogImage ? tour.ogImageHeight : undefined,
      ogLocale,
    })

    // Renamed tour slug(s): every old URL 301-redirects to the new canonical
    // (mirrors the client-side TourSlugRedirect routes in App.jsx).
    for (const former of tour.formerSlugs) {
      const oldFilePath = join(DIST, lang, prefix, former, 'index.html')
      writeRedirectStub(oldFilePath, canonical)
    }
  }

  // --- Destination/attraction "<Entity> Tours" listing pages ---
  const ui = loadUi(lang)
  for (const ep of entityTourPages) {
    const title = interp(ui['tours.listMetaTitle'], ep.name)
    const description = interp(ui['tours.listMetaDescription'], ep.name)
    const canonical = `${SITE_URL}/${lang}/${ep.path}`
    const filePath = join(DIST, lang, ep.path, 'index.html')
    writeHtml(filePath, lang, {
      title,
      description,
      canonical,
      image: '/images/files/georgia-tour-01.jpg',
      ogLocale,
    })
  }

  // --- Blog article pages ---
  for (const article of blogArticles) {
    const translatedTitle = loadBlogTitle(lang, article.titleKey) || article.title
    const title = (lang === 'en' && article.seoTitle)
      ? article.seoTitle
      : `${translatedTitle} | Hikasus Travel Blog`
    const description = (article.descKey && loadBlogTitle(lang, article.descKey)) || article.metaDescription || article.excerpt
    const tagKeywords = article.tags.flatMap(tag => [
      `Georgia ${tag.replace(/-/g, ' ')}`,
    ])
    const keywords = [...tagKeywords, 'travel tips Georgia'].join(', ')

    const canonical = `${SITE_URL}/${lang}/blog/${article.slug}`
    const filePath = join(DIST, lang, 'blog', article.slug, 'index.html')

    writeHtml(filePath, lang, {
      title,
      description,
      keywords,
      canonical,
      image: article.heroImage,
      ogImage: article.ogImage,
      ogImageAlt: article.ogImageAlt?.[lang],
      ogImageWidth: article.ogImageWidth,
      ogImageHeight: article.ogImageHeight,
      ogLocale,
    })
  }
}

// ---------------------------------------------------------------------------
// 5. Generate 404.html (SPA fallback)
// ---------------------------------------------------------------------------
copyFileSync(join(DIST, 'index.html'), join(DIST, '404.html'))
console.log('Created dist/404.html (SPA fallback)')

console.log(`Pre-render complete: ${fileCount} HTML files generated.`)
