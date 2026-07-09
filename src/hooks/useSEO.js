import { useEffect } from 'react'
import { withTrailingSlash, normalizeJsonLdUrls } from '../utils/url'

const SITE_URL = 'https://www.hikasustravel.com'

const localeMap = {
  en: 'en_US', es: 'es_ES', fr: 'fr_FR',
  de: 'de_DE', pl: 'pl_PL', cs: 'cs_CZ', nl: 'nl_NL',
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

function setLink(rel, href, attrs = {}) {
  const selector = Object.entries(attrs)
    .map(([k, v]) => `[${k}="${v}"]`)
    .join('')
  let el = document.querySelector(`link[rel="${rel}"]${selector}`)
  if (!href) { el?.remove(); return }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function useSEO({ title, description, keywords, lang = 'en', path = '', image, imageAlt, ogImage, ogImageWidth, ogImageHeight, jsonLd } = {}) {
  useEffect(() => {
    // Title
    if (title) document.title = title

    // Meta description
    setMeta('description', description)

    // Meta keywords
    setMeta('keywords', keywords)

    // Canonical — trailing-slash form matches the URL the host actually serves
    // (200), instead of the slashless form that 301-redirects to it.
    const canonical = withTrailingSlash(`${SITE_URL}/${lang}${path ? `/${path}` : ''}`)
    setLink('canonical', canonical)

    // Open Graph
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonical, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:locale', localeMap[lang] || 'en_US', 'property')
    setMeta('og:site_name', 'Hikasus Travel', 'property')
    // Prefer a dedicated social image (1.91:1) when supplied; fall back to the
    // page hero. og:image:alt / width / height are set when known and cleared
    // otherwise (setMeta removes the tag for empty content).
    const ogImg = ogImage || image
    if (ogImg) {
      const imgUrl = ogImg.startsWith('http') ? ogImg : `${SITE_URL}${ogImg}`
      setMeta('og:image', imgUrl, 'property')
      setMeta('og:image:alt', imageAlt, 'property')
      setMeta('og:image:width', ogImageWidth ? String(ogImageWidth) : '', 'property')
      setMeta('og:image:height', ogImageHeight ? String(ogImageHeight) : '', 'property')
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    if (ogImg) {
      const imgUrl = ogImg.startsWith('http') ? ogImg : `${SITE_URL}${ogImg}`
      setMeta('twitter:image', imgUrl)
      setMeta('twitter:image:alt', imageAlt)
    }

    // JSON-LD
    let scriptEl = document.querySelector('script[data-seo-jsonld]')
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script')
        scriptEl.setAttribute('type', 'application/ld+json')
        scriptEl.setAttribute('data-seo-jsonld', '')
        document.head.appendChild(scriptEl)
      }
      scriptEl.textContent = JSON.stringify(normalizeJsonLdUrls(jsonLd))
    } else {
      scriptEl?.remove()
    }

    return () => {
      // Clean up JSON-LD on unmount
      document.querySelector('script[data-seo-jsonld]')?.remove()
    }
  }, [title, description, keywords, lang, path, image, imageAlt, ogImage, ogImageWidth, ogImageHeight, jsonLd])
}
