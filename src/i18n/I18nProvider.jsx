import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { langCodes, defaultLang } from './languages'
import { I18nContext } from './I18nContext'
import { registerSEO } from '../data/seoData'

const translationCache = {}

async function loadLocale(lang) {
  if (translationCache[lang]) return translationCache[lang]

  // `en-fallback.json` carries only what a translated locale actually needs from
  // English — the keys it has no translation for, plus the destination-hub keys
  // whose English item names are used as a per-card fallback. English itself
  // needs none of it: its own pages.json already is the fallback. See
  // scripts/generate-en-fallback.js.
  const [ui, pages, faq, enFallback, seo] = await Promise.all([
    import(`./locales/${lang}/ui.json`),
    import(`./locales/${lang}/pages.json`),
    import(`./locales/${lang}/faq.json`),
    lang === defaultLang ? null : import('./locales/en-fallback.json'),
    // Per-locale page metadata, split out of the 1.16 MB seoData source so a
    // visitor downloads only their own language. Registered on the module
    // before this promise resolves, so the synchronous getSEO() calls in the
    // page components (and in the search index) always find their table.
    import(`../data/seo/${lang}.json`),
  ])

  registerSEO(lang, seo.default)

  const result = {
    ui: ui.default,
    pages: pages.default,
    faq: faq.default,
    enPages: enFallback ? enFallback.default : pages.default,
  }
  translationCache[lang] = result
  return result
}

const tourCache = {}

async function loadTours(lang) {
  if (tourCache[lang]) return tourCache[lang]

  // `hotels.json` carries the translated hotel copy shown in the accommodation
  // modal (description, amenity labels, location highlights, image alt text).
  // English reads straight from hotelData.js, so it has no file of its own; a
  // locale that has not been translated yet simply falls back to English.
  const [tours, hotels] = await Promise.all([
    import(`./locales/${lang}/tours.json`),
    lang === defaultLang
      ? null
      : import(`./locales/${lang}/hotels.json`).catch(() => null),
  ])

  const result = { tours: tours.default, hotels: hotels ? hotels.default : null }
  tourCache[lang] = result
  return result
}

export default function I18nProvider({ children }) {
  const { lang: paramLang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const lang = langCodes.includes(paramLang) ? paramLang : defaultLang

  const [data, setData] = useState(null)
  // Store the loaded tour translations together with the language they belong to,
  // so a language change drops stale translations during render (no reset effect).
  const [tourState, setTourState] = useState({ lang: null, tours: null, hotels: null })
  const tourTranslations = tourState.lang === lang ? tourState.tours : null
  const hotelTranslations = tourState.lang === lang ? tourState.hotels : null

  useEffect(() => {
    loadLocale(lang).then(setData)
  }, [lang])

  const setLang = useCallback((newLang) => {
    if (!langCodes.includes(newLang)) return
    const rest = location.pathname.replace(/^\/[a-z]{2}/, '')
    navigate(`/${newLang}${rest}${location.search}${location.hash}`)
  }, [location, navigate])

  const loadTourTranslations = useCallback(() => {
    return loadTours(lang).then(({ tours, hotels }) => {
      setTourState({ lang, tours, hotels })
      return tours
    })
  }, [lang])

  const translations = useMemo(() => (data ? data.ui : {}), [data])
  const pages = useMemo(() => (data ? data.pages : {}), [data])
  const faq = useMemo(() => (data ? data.faq : []), [data])
  const enPages = useMemo(() => (data ? data.enPages : {}), [data])

  const value = useMemo(() => ({
    lang,
    setLang,
    translations,
    pages,
    faq,
    enPages,
    tourTranslations,
    hotelTranslations,
    loadTourTranslations,
  }), [lang, setLang, translations, pages, faq, enPages, tourTranslations, hotelTranslations, loadTourTranslations])

  if (!data) return null

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}
