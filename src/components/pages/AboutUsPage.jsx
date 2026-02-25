import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function AboutUsPage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const page = pages.aboutUs || {}
  const seo = getSEO('aboutUs', lang)
  useSEO({ ...seo, lang, path: 'about-us', image: '/images/files/about-us.jpg' })

  return (
    <>
      <HeroSection image="/images/files/about-us.jpg" title={page.heroTitle} />
      <section className="page-items about-us">
        <FadeUp>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </FadeUp>
      </section>
    </>
  )
}
