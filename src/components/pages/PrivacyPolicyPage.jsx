import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'

export default function PrivacyPolicyPage() {
  const { pages } = useContext(I18nContext)
  const page = pages.privacyPolicy || {}

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
