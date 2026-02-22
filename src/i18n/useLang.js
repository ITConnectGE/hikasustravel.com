import { useContext } from 'react'
import { I18nContext } from './I18nProvider'
import { languages } from './languages'

export default function useLang() {
  const { lang, setLang } = useContext(I18nContext)
  return { lang, setLang, languages }
}
