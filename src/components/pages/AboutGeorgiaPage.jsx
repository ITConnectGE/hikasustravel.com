import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function AboutGeorgiaPage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const page = pages.aboutGeorgia || {}
  const seo = getSEO('aboutGeorgia', lang)
  useSEO({ ...seo, lang, path: 'about-georgia', image: '/images/files/about-georgia.jpg' })

  return (
    <>
      <HeroSection image="/images/files/about-georgia.jpg" title={page.heroTitle} />
      <section className="page-items about-georgia">
        <FadeUp>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </FadeUp>
      </section>
    </>
  )
}
