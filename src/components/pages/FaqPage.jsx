import { useContext, useMemo } from 'react'
import HeroSection from '../shared/HeroSection'
import Accordion from '../shared/Accordion'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import { I18nContext } from '../../i18n/I18nProvider'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function FaqPage() {
  const t = useT()
  const { lang } = useLang()
  const { faq } = useContext(I18nContext)

  const seo = getSEO('faq', lang)
  const faqJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faq || []).map(item => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.content,
      },
    })),
  }), [faq])
  useSEO({ ...seo, lang, path: 'faq', image: '/images/files/georgia-tour-14.jpg', jsonLd: faqJsonLd })

  return (
    <>
      <HeroSection image="/images/files/georgia-tour-14.jpg" title={t('faq.heroTitle')} />
      <section className="page-items faq" id="faq-section">
        <Accordion items={faq} headingKey="faq.heroTitle" />
      </section>
    </>
  )
}
