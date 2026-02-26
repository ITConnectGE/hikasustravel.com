# Pre-render SEO Meta Tags at Build Time — Vue + Vite Guide

A standalone reference for applying the same build-time template-injection approach to a Vue SPA. Everything here mirrors what was implemented in the React project (`scripts/prerender.js`), adapted for Vue's ecosystem.

---

## Why This Approach Works for Any SPA

The pre-render script runs **after** `vite build` and operates only on the output `dist/index.html`. It doesn't import any framework code — it uses Cheerio to manipulate static HTML. This means the exact same pattern works for React, Vue, Svelte, or any other SPA. The only things that change are:

1. Where your SEO data lives (data files, translation files)
2. How your router is configured
3. Which runtime head-management library you use (if any)

---

## Step 1: Switch Vue Router to History Mode

Vue Router uses `createWebHashHistory()` for hash mode and `createWebHistory()` for clean URLs.

### Before

```js
// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [/* ... */],
})
```

### After

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [/* ... */],
})
```

That's it. All `<router-link>` components and programmatic `router.push()` calls continue to work — Vue Router handles the transition automatically.

---

## Step 2: Add Hash-to-Clean URL Redirect

In your `index.html`, add a redirect script before the app mounts, so old `/#/` bookmarks still work:

```html
<body>
  <div id="app"></div>
  <script>if(location.hash.startsWith('#/'))location.replace(location.hash.slice(1))</script>
  <script type="module" src="/src/main.js"></script>
</body>
```

---

## Step 3: Create the Pre-render Script

### Install Cheerio (if not already a devDependency)

```bash
npm install -D cheerio
```

### Script: `scripts/prerender.js`

The structure is identical to the React version. Here's the skeleton adapted for a typical Vue project:

```js
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { load } from 'cheerio'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const SITE_URL = 'https://www.yoursite.com'
const LANGS = ['en', 'es', 'fr'] // your supported languages

const localeMap = { en: 'en_US', es: 'es_ES', fr: 'fr_FR' }

// ---------------------------------------------------------------------------
// 1. Load your data sources
// ---------------------------------------------------------------------------

// Option A: If your SEO data is in a plain JS/JSON file, read & parse it
// Option B: If it's in a .ts file, you may need to compile it first or
//           maintain a separate JSON copy for the build script

// Example: reading a JSON SEO data file
const seoData = JSON.parse(
  readFileSync(join(__dirname, '../src/data/seo.json'), 'utf-8')
)

// Example: reading translations
function loadTranslations(lang) {
  try {
    return JSON.parse(
      readFileSync(join(__dirname, `../src/locales/${lang}.json`), 'utf-8')
    )
  } catch {
    return {}
  }
}

// ---------------------------------------------------------------------------
// 2. Define your routes
// ---------------------------------------------------------------------------

// Mirror your Vue Router route definitions here.
// Only include routes that should be pre-rendered (skip catch-all / 404).

const staticRoutes = [
  { path: '', seoKey: 'home' },
  { path: 'about', seoKey: 'about' },
  { path: 'services', seoKey: 'services' },
  { path: 'contact', seoKey: 'contact' },
  // ...
]

// Dynamic routes — load from your data source
// e.g., product slugs, blog slugs, tour slugs
const dynamicRoutes = [] // populate from your data files

// ---------------------------------------------------------------------------
// 3. Write HTML files
// ---------------------------------------------------------------------------

const template = readFileSync(join(DIST, 'index.html'), 'utf-8')
let fileCount = 0

function writeHtml(filePath, lang, { title, description, keywords, canonical, image }) {
  const $ = load(template)

  $('html').attr('lang', lang)
  $('title').text(title)
  $('meta[name="description"]').attr('content', description)

  if (keywords) {
    if ($('meta[name="keywords"]').length) {
      $('meta[name="keywords"]').attr('content', keywords)
    } else {
      $('head').append(`<meta name="keywords" content="${keywords}">`)
    }
  }

  $('link[rel="canonical"]').attr('href', canonical)

  // OG tags
  $('meta[property="og:title"]').attr('content', title)
  $('meta[property="og:description"]').attr('content', description)
  $('meta[property="og:url"]').attr('content', canonical)
  $('meta[property="og:locale"]').attr('content', localeMap[lang])
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

  // Hreflang alternates
  $('link[rel="alternate"][hreflang]').remove()
  $('meta[property="og:locale:alternate"]').remove()

  const canonicalPath = canonical.replace(`${SITE_URL}/${lang}`, '')
  for (const altLang of LANGS) {
    const altUrl = `${SITE_URL}/${altLang}${canonicalPath}`
    $('head').append(`<link rel="alternate" hreflang="${altLang}" href="${altUrl}">`)
    if (altLang !== lang) {
      $('meta[property="og:locale"]').after(
        `<meta property="og:locale:alternate" content="${localeMap[altLang]}">`
      )
    }
  }
  $('head').append(
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/en${canonicalPath}">`
  )

  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, $.html(), 'utf-8')
  fileCount++
}

// ---------------------------------------------------------------------------
// 4. Generate all pages
// ---------------------------------------------------------------------------

for (const lang of LANGS) {
  const t = loadTranslations(lang)

  for (const route of staticRoutes) {
    const data = seoData[route.seoKey]?.[lang] || seoData[route.seoKey]?.en || {}
    const canonical = route.path
      ? `${SITE_URL}/${lang}/${route.path}`
      : `${SITE_URL}/${lang}`
    const filePath = route.path
      ? join(DIST, lang, route.path, 'index.html')
      : join(DIST, lang, 'index.html')

    writeHtml(filePath, lang, {
      title: data.title || 'My Site',
      description: data.description || '',
      keywords: data.keywords || '',
      canonical,
      image: data.image || '/images/default-og.jpg',
    })
  }

  for (const route of dynamicRoutes) {
    // Use translations if available, fallback to default language
    // Build title, description, keywords from your data
    // writeHtml(...)
  }
}

// 404 fallback
copyFileSync(join(DIST, 'index.html'), join(DIST, '404.html'))

console.log(`Pre-render complete: ${fileCount} HTML files generated.`)
```

### Key Adaptation Points

| React project | Your Vue project |
|---------------|-----------------|
| `src/data/seoData.js` | Your equivalent SEO data file (JSON or JS) |
| `src/data/tours.js` | Your dynamic content data files |
| `src/i18n/locales/{lang}/tours.json` | Your i18n translation files (vue-i18n JSON, etc.) |
| `src/data/blogData.js` | Any other dynamic content sources |

If your data files are **TypeScript**, you have two options:
1. Keep a parallel `.json` copy that the build script reads (simplest)
2. Use `tsx` or `ts-node` to run the prerender script (adds a devDependency)

---

## Step 4: Update the Build Pipeline

```json
{
  "scripts": {
    "build": "vite build && node scripts/prerender.js"
  }
}
```

If you also have a sitemap generator, run it before `vite build`:

```json
{
  "scripts": {
    "build": "node scripts/generate-sitemap.js && vite build && node scripts/prerender.js"
  }
}
```

---

## Step 5: Runtime Head Management

The pre-rendered HTML handles the **initial page load** (what crawlers and "View Source" see). For **client-side navigation** after the app mounts, you still need a runtime head manager.

### Option A: `@unhead/vue` (recommended, modern)

```bash
npm install @unhead/vue
```

```js
// src/main.js
import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from './App.vue'

const app = createApp(App)
const head = createHead()
app.use(head)
app.mount('#app')
```

```vue
<!-- In any component or page -->
<script setup>
import { useHead } from '@unhead/vue'

useHead({
  title: 'About Us – My Site',
  meta: [
    { name: 'description', content: 'Learn about our company.' },
    { property: 'og:title', content: 'About Us – My Site' },
  ],
})
</script>
```

### Option B: `@vueuse/head`

Same API as `@unhead/vue` (it's the predecessor). If your project already uses it, no need to switch.

### Option C: Manual DOM manipulation

If you prefer not to add a dependency, you can write a composable similar to the React `useSEO` hook:

```js
// src/composables/useSEO.js
import { watchEffect, onUnmounted } from 'vue'

export function useSEO({ title, description, keywords, lang, path, image }) {
  watchEffect(() => {
    if (title) document.title = title

    setMeta('description', description)
    setMeta('keywords', keywords)
    // ... same pattern as the React useSEO hook
  })
}

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!content) { el?.remove(); return }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
```

The key point: **the runtime head manager and the build-time prerender are complementary, not competing**. The prerender sets the initial HTML; the runtime updates it during SPA navigation.

---

## Vue-Specific Alternative: `vite-ssg`

[`vite-ssg`](https://github.com/antfu/vite-ssg) is a Vue-native SSG plugin that pre-renders pages by actually running your Vue app in Node.js at build time.

### Pros

- Uses your actual Vue components and router — no separate data parsing
- Automatically discovers routes from Vue Router
- Works with `@unhead/vue` out of the box
- Generates correct HTML including rendered component markup (not just meta tags)

### Cons

- Adds build complexity — your components must be SSR-compatible (no `window` or `document` access at the top level)
- Slower build (renders each page through Vue's SSR pipeline)
- May need workarounds for libraries that aren't SSR-friendly (e.g., Mapbox, Swiper)
- More dependencies and configuration

### When to Use `vite-ssg` Instead

- If you want **full page content** pre-rendered (not just meta tags) — e.g., for a content-heavy blog or marketing site
- If all your third-party libraries are SSR-compatible
- If you're starting a new project and can design for SSR from the beginning

### When to Stick with Template Injection

- If you only need **meta tags** pre-rendered (Google renders JS fine for content; social crawlers just need meta tags)
- If your app uses browser-only libraries (maps, carousels, etc.)
- If you want a zero-risk addition that doesn't touch your app code
- If build speed matters (template injection: <1 second; vite-ssg: seconds to minutes)

---

## Deployment: SPA Fallback Configuration

Since you're using `createWebHistory()` (clean URLs), the server must serve `index.html` (or `404.html`) for all unmatched routes.

### GitHub Pages

GitHub Pages automatically serves `404.html` for missing paths. The prerender script already creates `dist/404.html` as a copy of the SPA shell — this handles it.

### Netlify

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Apache (.htaccess)

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## Checklist

- [ ] Switch Vue Router from `createWebHashHistory()` to `createWebHistory()`
- [ ] Add hash redirect script to `index.html`
- [ ] Install `cheerio` as a devDependency
- [ ] Create `scripts/prerender.js` adapted to your data sources
- [ ] Ensure `index.html` has placeholder OG/Twitter/canonical meta tags (so Cheerio can find and replace them)
- [ ] Update `package.json` build script to run prerender after vite build
- [ ] Add runtime head management (`@unhead/vue` or manual composable)
- [ ] Configure server/hosting for SPA fallback
- [ ] Run `npm run build` and verify HTML files have correct meta tags
- [ ] Test that old `/#/` URLs redirect to clean URLs
