import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function TaxiServicePage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const page = pages.taxi || {}
  const seo = getSEO('taxi', lang)
  useSEO({ ...seo, lang, path: 'taxi-service', image: '/images/files/taxi-service.jpg' })

  return (
    <>
      <HeroSection image="/images/files/taxi-service.jpg" title={page.heroTitle} />
      <section className="page-items taxi-service">
        <FadeUp>
          <p>{page.description}</p>
        </FadeUp>
      </section>
    </>
  )
}
