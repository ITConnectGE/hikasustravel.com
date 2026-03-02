import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const staticPages = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: 'about-us', changefreq: 'monthly', priority: '0.7' },
  { path: 'about-georgia', changefreq: 'monthly', priority: '0.7' },
  { path: 'private-tours', changefreq: 'weekly', priority: '0.9' },
  { path: 'group-tours', changefreq: 'weekly', priority: '0.9' },
  { path: 'shuttle-service', changefreq: 'monthly', priority: '0.8' },
  { path: 'embassies', changefreq: 'monthly', priority: '0.7' },
  { path: 'blog', changefreq: 'weekly', priority: '0.8' },
  { path: 'blog/ultimate-guide-to-traveling-to-georgia', changefreq: 'monthly', priority: '0.8' },
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

// Generate URL entries with hreflang alternates
const urlEntries = []

for (const lang of languages) {
  for (const { path, changefreq, priority } of allPaths) {
    const loc = path
      ? `${SITE_URL}/${lang}/${path}`
      : `${SITE_URL}/${lang}`

    // Build hreflang alternates
    const hreflangs = languages.map(altLang => {
      const altUrl = path
        ? `${SITE_URL}/${altLang}/${path}`
        : `${SITE_URL}/${altLang}`
      return `      <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`
    })
    // x-default points to English
    const xDefaultUrl = path ? `${SITE_URL}/en/${path}` : `${SITE_URL}/en`
    hreflangs.push(`      <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`)

    urlEntries.push({ loc, lastmod: today, changefreq, priority, hreflangs })
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
