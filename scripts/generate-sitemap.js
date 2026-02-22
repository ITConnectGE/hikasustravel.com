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
  { path: 'taxi-service', changefreq: 'monthly', priority: '0.6' },
  { path: 'faq', changefreq: 'monthly', priority: '0.5' },
  { path: 'contact', changefreq: 'monthly', priority: '0.6' },
  { path: 'privacy-policy', changefreq: 'yearly', priority: '0.2' },
  { path: 'terms-and-conditions', changefreq: 'yearly', priority: '0.2' },
]

const urls = []

// Static pages for each language
for (const lang of languages) {
  for (const page of staticPages) {
    const loc = page.path
      ? `${SITE_URL}/#/${lang}/${page.path}`
      : `${SITE_URL}/#/${lang}`
    urls.push({ loc, lastmod: today, changefreq: page.changefreq, priority: page.priority })
  }
}

// Tour detail pages for each language
for (const lang of languages) {
  for (const tour of tours) {
    const prefix = tour.type === 'group' ? 'group-tours' : 'private-tours'
    const loc = `${SITE_URL}/#/${lang}/${prefix}/${tour.slug}`
    urls.push({ loc, lastmod: today, changefreq: 'monthly', priority: '0.8' })
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

const outPath = join(__dirname, '../public/sitemap.xml')
writeFileSync(outPath, xml, 'utf-8')
console.log(`Sitemap generated: ${urls.length} URLs written to public/sitemap.xml`)
