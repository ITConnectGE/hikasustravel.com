import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'

export default function TaxiServicePage() {
  const { pages } = useContext(I18nContext)
  const page = pages.taxi || {}

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
