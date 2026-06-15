import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { langCodes, defaultLang } from './languages'
import { I18nContext } from './I18nContext'

const translationCache = {}

async function loadLocale(lang) {
  if (translationCache[lang]) return translationCache[lang]

  const [ui, pages, faq] = await Promise.all([
    import(`./locales/${lang}/ui.json`),
    import(`./locales/${lang}/pages.json`),
    import(`./locales/${lang}/faq.json`),
  ])

  const result = {
    ui: ui.default,
    pages: pages.default,
    faq: faq.default,
  }
  translationCache[lang] = result
  return result
}

const tourCache = {}

async function loadTours(lang) {
  if (tourCache[lang]) return tourCache[lang]
  const mod = await import(`./locales/${lang}/tours.json`)
  tourCache[lang] = mod.default
  return mod.default
}

export default function I18nProvider({ children }) {
  const { lang: paramLang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const lang = langCodes.includes(paramLang) ? paramLang : defaultLang

  const [data, setData] = useState(null)
  // Store the loaded tour translations together with the language they belong to,
  // so a language change drops stale translations during render (no reset effect).
  const [tourState, setTourState] = useState({ lang: null, data: null })
  const tourTranslations = tourState.lang === lang ? tourState.data : null

  useEffect(() => {
    loadLocale(lang).then(setData)
  }, [lang])

  const setLang = useCallback((newLang) => {
    if (!langCodes.includes(newLang)) return
    const rest = location.pathname.replace(/^\/[a-z]{2}/, '')
    navigate(`/${newLang}${rest}${location.search}${location.hash}`)
  }, [location, navigate])

  const loadTourTranslations = useCallback(() => {
    return loadTours(lang).then((t) => {
      setTourState({ lang, data: t })
      return t
    })
  }, [lang])

  const translations = useMemo(() => (data ? data.ui : {}), [data])
  const pages = useMemo(() => (data ? data.pages : {}), [data])
  const faq = useMemo(() => (data ? data.faq : []), [data])

  const value = useMemo(() => ({
    lang,
    setLang,
    translations,
    pages,
    faq,
    tourTranslations,
    loadTourTranslations,
  }), [lang, setLang, translations, pages, faq, tourTranslations, loadTourTranslations])

  if (!data) return null

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}
