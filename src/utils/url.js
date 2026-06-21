// Canonical-URL helpers.
//
// The site is served from a static host (GitHub Pages) where every page lives at
// `<path>/index.html` and is therefore served at a URL *with* a trailing slash;
// the slashless form 301-redirects to it. So every crawl-facing URL we emit —
// canonical, og:url, hreflang/x-default, sitemap <loc>, and JSON-LD item/url —
// must use the trailing-slash form, otherwise it points at the redirecting URL
// instead of the actual 200 page (which confuses canonical/hreflang validation).

export const SITE_URL = 'https://www.hikasustravel.com'

// Add a single trailing slash to a page URL if it doesn't already have one.
// Leaves the bare origin (`https://www.hikasustravel.com`) and asset URLs that
// end in a file extension (e.g. `.jpg`, `.svg`) untouched.
export function withTrailingSlash(url) {
  if (typeof url !== 'string') return url
  if (url.endsWith('/')) return url
  // Only page paths get a slash — never the bare origin or a file asset.
  if (!url.startsWith(`${SITE_URL}/`)) return url
  const lastSegment = url.split('/').pop()
  if (/\.[a-z0-9]{2,5}$/i.test(lastSegment)) return url
  return `${url}/`
}

// Keys in a JSON-LD graph that hold a navigable page URL (as opposed to an image
// or other asset). Used to normalise breadcrumb/entity URLs to the trailing-slash
// canonical form without touching `image`/`logo` asset URLs.
const PAGE_URL_KEYS = new Set(['item', 'url', '@id'])

// Recursively return a copy of a JSON-LD value with every page URL normalised to
// the trailing-slash form. Non-URL values and asset URLs are left unchanged.
export function normalizeJsonLdUrls(node) {
  if (Array.isArray(node)) return node.map(normalizeJsonLdUrls)
  if (node && typeof node === 'object') {
    const out = {}
    for (const [key, value] of Object.entries(node)) {
      out[key] =
        PAGE_URL_KEYS.has(key) && typeof value === 'string'
          ? withTrailingSlash(value)
          : normalizeJsonLdUrls(value)
    }
    return out
  }
  return node
}
