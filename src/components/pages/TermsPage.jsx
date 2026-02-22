import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function TermsPage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const page = pages.terms || {}
  const seo = getSEO('terms', lang)
  useSEO({ ...seo, lang, path: 'terms-and-conditions', image: '/images/files/georgia-tour-13.jpg' })

  return (
    <>
      <HeroSection image="/images/files/georgia-tour-13.jpg" title={page.heroTitle} />
      <section className="page-items terms-and-conditions">
        <FadeUp>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </FadeUp>
      </section>
    </>
  )
}
