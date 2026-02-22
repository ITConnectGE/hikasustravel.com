import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'

export default function AboutUsPage() {
  const { pages } = useContext(I18nContext)
  const page = pages.aboutUs || {}

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
