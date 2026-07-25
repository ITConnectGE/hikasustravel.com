/**
 * Split the SEO authoring source into one file per locale.
 *
 * src/data/seoData.source.js holds every page's title/description/keywords for
 * all seven languages in a single 1.16 MB object. It used to be imported at
 * runtime by ~28 components, so every visitor downloaded all seven languages to
 * render one page in one language.
 *
 * This writes src/data/seo/<lang>.json — the same keys, but only that locale's
 * strings, with English folded in per key wherever a translation is missing.
 * Folding the fallback in here means the runtime getSEO() needs no `|| page.en`
 * branch, and the resolved value is byte-identical to what it used to return.
 *
 * Committed so `npm run dev` works from a clean checkout, and regenerated as
 * part of `npm run build` so it cannot drift.
 *
 *   node scripts/generate-seo-locales.js
 */

import { mkdirSync, statSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'seo')
const SOURCE = join(__dirname, '..', 'src', 'data', 'seoData.source.js')

const LANGS = ['en', 'es', 'fr', 'de', 'pl', 'cs', 'nl']

const { seo } = await import(pathToFileURL(SOURCE).href)

mkdirSync(OUT, { recursive: true })

const keys = Object.keys(seo)
const fellBack = {}
for (const lang of LANGS) {
  const table = {}
  fellBack[lang] = 0
  for (const key of keys) {
    const page = seo[key]
    if (!page) continue
    // Exactly the old getSEO resolution: the locale's entry, else English.
    const entry = page[lang] || page.en
    if (!entry) continue
    if (!page[lang]) fellBack[lang]++
    table[key] = entry
  }
  writeFileSync(join(OUT, `${lang}.json`), JSON.stringify(table, null, 2) + '\n', 'utf-8')
}

const kb = (p) => (statSync(p).size / 1024).toFixed(1)
console.log(`SEO locales: ${keys.length} keys x ${LANGS.length} languages`)
for (const lang of LANGS) {
  console.log(`   ${lang}.json  ${String(kb(join(OUT, `${lang}.json`))).padStart(7)} KB   ${fellBack[lang]} keys fall back to English`)
}
console.log(`   source     ${kb(SOURCE)} KB (authoring only, never shipped)`)
