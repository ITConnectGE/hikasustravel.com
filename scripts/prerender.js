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
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { load } from 'cheerio'

const __dirname = dirname(fileURLToPath(import.meta.url))
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
  // Match each tour object to extract key fields
  const slugRegex = /"slug":\s*"([^"]+)"/g
  const typeRegex = /"type":\s*"([^"]+)"/g
  const titleRegex = /"title":\s*"([^"]+)"/g
  const descRegex = /"description":\s*"([^"]+)"/g
  const heroRegex = /"heroImage":\s*"([^"]+)"/g
  const daysRegex = /"days":\s*(\d+)/g

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
    const daysM = chunk.match(/"days":\s*(\d+)/)

    // Extract itinerary day titles for keywords
    const itineraryTitles = []
    const itinMatches = chunk.matchAll(/"title":\s*"(Day \d+[^"]+)"/g)
    for (const m of itinMatches) itineraryTitles.push(m[1])

    tours.push({
      slug,
      type: typeM?.[1] || 'private',
      title: titleM?.[1] || slug,
      description: descM?.[1] || '',
      heroImage: heroM?.[1] || '',
      days: daysM ? parseInt(daysM[1]) : 0,
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
    title: 'The Ultimate Guide to Traveling to Georgia: Everything You Need to Know Before You Go',
    excerpt: 'From visa requirements and the best time to visit, to must-try dishes, ancient wine traditions, and hidden gems most tourists never find — this is the only Georgia travel guide you will ever need.',
    heroImage: '/images/files/georgia-home.jpg',
    tags: ['travel-guide', 'visa', 'food', 'wine', 'culture'],
  },
]

// Blog translations from ui.json files
function loadBlogTitle(lang) {
  try {
    const ui = JSON.parse(readFileSync(join(__dirname, `../src/i18n/locales/${lang}/ui.json`), 'utf-8'))
    return ui['blog.article1.title'] || null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// 2. Define all routes
// ---------------------------------------------------------------------------

const seoPageMap = {
  '': 'home',
  'about-us': 'aboutUs',
  'about-georgia': 'aboutGeorgia',
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

// ---------------------------------------------------------------------------
// 3. Build per-route HTML
// ---------------------------------------------------------------------------

const template = readFileSync(join(DIST, 'index.html'), 'utf-8')
let fileCount = 0

function writeHtml(filePath, lang, { title, description, keywords, canonical, image, ogLocale }) {
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
  if (image) {
    const imgUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`
    $('meta[property="og:image"]').attr('content', imgUrl)
  }

  // Twitter Card
  $('meta[name="twitter:title"]').attr('content', title)
  $('meta[name="twitter:description"]').attr('content', description)
  if (image) {
    const imgUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`
    $('meta[name="twitter:image"]').attr('content', imgUrl)
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

// ---------------------------------------------------------------------------
// 4. Generate all pages
// ---------------------------------------------------------------------------

console.log('Pre-rendering SEO HTML files...')

for (const lang of LANGS) {
  const tourTrans = loadTourTranslations(lang)
  const blogTitle = loadBlogTitle(lang)
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
      image: '/images/files/georgia-home.jpg',
      ogLocale,
    })
  }

  // --- Tour detail pages ---
  for (const tour of tours) {
    const tt = tourTrans[tour.slug]
    const prefix = tour.type === 'group' ? 'group-tours' : 'private-tours'
    const title = `${tt?.title || tour.title} | Hikasus Travel`
    const description = (tt?.description || tour.description || '').slice(0, 160)

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
      ogLocale,
    })
  }

  // --- Blog article pages ---
  for (const article of blogArticles) {
    const translatedTitle = blogTitle || article.title
    const title = `${translatedTitle} | Hikasus Travel Blog`
    const tagKeywords = article.tags.flatMap(tag => [
      `Georgia ${tag.replace(/-/g, ' ')}`,
    ])
    const keywords = [...tagKeywords, 'travel tips Georgia'].join(', ')

    const canonical = `${SITE_URL}/${lang}/blog/${article.slug}`
    const filePath = join(DIST, lang, 'blog', article.slug, 'index.html')

    writeHtml(filePath, lang, {
      title,
      description: article.excerpt,
      keywords,
      canonical,
      image: article.heroImage,
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
