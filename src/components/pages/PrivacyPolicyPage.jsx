import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function PrivacyPolicyPage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const page = pages.privacyPolicy || {}
  const seo = getSEO('privacy', lang)
  useSEO({ ...seo, lang, path: 'privacy-policy', image: '/images/files/privacy.jpg' })

  return (
    <>
      <HeroSection image="/images/files/privacy.jpg" title={page.heroTitle} />
      <section className="page-items privacy-policy">
        <FadeUp>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </FadeUp>
      </section>
    </>
  )
}
