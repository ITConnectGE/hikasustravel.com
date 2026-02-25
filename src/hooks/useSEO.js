import { useEffect } from 'react'

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

export default function useSEO({ title, description, keywords, lang = 'en', path = '', image, jsonLd } = {}) {
  useEffect(() => {
    // Title
    if (title) document.title = title

    // Meta description
    setMeta('description', description)

    // Meta keywords
    setMeta('keywords', keywords)

    // Canonical
    const canonical = `${SITE_URL}/#/${lang}${path ? `/${path}` : ''}`
    setLink('canonical', canonical)

    // Open Graph
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonical, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:locale', localeMap[lang] || 'en_US', 'property')
    setMeta('og:site_name', 'Hikasus Travel', 'property')
    if (image) {
      const imgUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`
      setMeta('og:image', imgUrl, 'property')
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    if (image) {
      const imgUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`
      setMeta('twitter:image', imgUrl)
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
      scriptEl.textContent = JSON.stringify(jsonLd)
    } else {
      scriptEl?.remove()
    }

    return () => {
      // Clean up JSON-LD on unmount
      document.querySelector('script[data-seo-jsonld]')?.remove()
    }
  }, [title, description, keywords, lang, path, image, jsonLd])
}
