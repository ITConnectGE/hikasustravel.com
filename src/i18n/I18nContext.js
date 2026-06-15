import { createContext } from 'react'
import { defaultLang } from './languages'

// Kept in a plain .js module (separate from the I18nProvider component) so React
// Fast Refresh only sees component exports in I18nProvider.jsx.
export const I18nContext = createContext({
  lang: defaultLang,
  setLang: () => {},
  translations: {},
  pages: {},
  faq: [],
  tourTranslations: null,
  loadTourTranslations: () => Promise.resolve(null),
})
