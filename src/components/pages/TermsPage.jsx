import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'

export default function TermsPage() {
  const { pages } = useContext(I18nContext)
  const page = pages.terms || {}

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
