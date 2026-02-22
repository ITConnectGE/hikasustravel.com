import { createContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { langCodes, defaultLang } from './languages'

export const I18nContext = createContext({
  lang: defaultLang,
  setLang: () => {},
  translations: {},
  pages: {},
  faq: [],
  tourTranslations: null,
  loadTourTranslations: () => Promise.resolve(null),
})

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
  const [tourTranslations, setTourTranslations] = useState(null)

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
      setTourTranslations(t)
      return t
    })
  }, [lang])

  // Reset tour translations when language changes
  useEffect(() => {
    setTourTranslations(null)
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
