import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'

export default function AboutGeorgiaPage() {
  const { pages } = useContext(I18nContext)
  const page = pages.aboutGeorgia || {}

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
