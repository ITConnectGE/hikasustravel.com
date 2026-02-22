import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import Accordion from '../shared/Accordion'
import useT from '../../i18n/useT'
import { I18nContext } from '../../i18n/I18nProvider'

export default function FaqPage() {
  const t = useT()
  const { faq } = useContext(I18nContext)

  return (
    <>
      <HeroSection image="/images/files/georgia-tour-14.jpg" title={t('faq.heroTitle')} />
      <section className="page-items faq" id="faq-section">
        <Accordion items={faq} headingKey="faq.heroTitle" />
      </section>
    </>
  )
}
