import { useContext, useMemo } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import { I18nContext } from '../../i18n/I18nContext'
import useLang from '../../i18n/useLang'
import { useLinkedHtml, useLinkedFaq } from '../../utils/autolinkReact'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import enPages from '../../i18n/locales/en/pages.json'

// Hero photo of the terminal interior (Wizz Air check-in area).
// Source: Wikimedia Commons, by Andrew Milligan Sumo, licensed CC BY 2.0 —
// attribution rendered on-page below (required by the licence). File:
// David the Builder Kutaisi International Airport, KUT, Georgia (41001394845).jpg
const HERO_IMAGE = '/images/files/kutaisi-airport.jpg'
const SITE_URL = 'https://www.hikasustravel.com'
const PATH = 'kutaisi-international-airport'

export default function AirportGuidePage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  // Fall back to English content until per-language translations are added.
  const page = pages.airportGuide || enPages.airportGuide
  const seo = getSEO('airportGuide', lang)
  const faqItems = useMemo(() => page.faq || [], [page])
  const linkedContent = useLinkedHtml(page.content)
  const linkedFaq = useLinkedFaq(faqItems)

  const jsonLd = useMemo(() => {
    const url = `${SITE_URL}/${lang}/${PATH}`
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: page.heroTitle,
          description: seo.description,
          inLanguage: lang,
          mainEntityOfPage: url,
          image: `${SITE_URL}${HERO_IMAGE}`,
          author: { '@type': 'Organization', name: 'Hikasus Travel' },
          publisher: {
            '@type': 'Organization',
            name: 'Hikasus Travel',
            url: SITE_URL,
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${lang}` },
            { '@type': 'ListItem', position: 2, name: 'Kutaisi International Airport (KUT)', item: url },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.title,
            acceptedAnswer: { '@type': 'Answer', text: item.content },
          })),
        },
      ],
    }
  }, [lang, seo.description, page.heroTitle, faqItems])

  useSEO({ ...seo, lang, path: PATH, image: HERO_IMAGE, jsonLd })

  return (
    <>
      <HeroSection image={HERO_IMAGE} title={page.heroTitle} />
      <section className="page-items about-georgia">
        <FadeUp>
          <div dangerouslySetInnerHTML={{ __html: linkedContent }} />
        </FadeUp>
      </section>
      {faqItems.length > 0 && (
        <section className="page-items faq" id="faq-section">
          <Accordion items={linkedFaq} headingKey="faq.heroTitle" />
        </section>
      )}
      {/* Photo attribution — required by the CC BY 2.0 licence of the hero image. */}
      <section className="page-items">
        <p style={{ fontSize: '0.8rem', opacity: 0.65, textAlign: 'center', margin: 0 }}>
          Photo:{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:David_the_Builder_Kutaisi_International_Airport,_KUT,_Georgia_(41001394845).jpg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Andrew Milligan Sumo
          </a>{' '}
          via Wikimedia Commons,{' '}
          <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">
            CC BY 2.0
          </a>{' '}
          (resized).
        </p>
      </section>
    </>
  )
}
