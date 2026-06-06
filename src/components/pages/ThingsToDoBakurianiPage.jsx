import { useContext, useMemo } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import { I18nContext } from '../../i18n/I18nProvider'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import enPages from '../../i18n/locales/en/pages.json'

// Placeholder hero — replace with a real Bakuriani photo when available.
const HERO_IMAGE = '/images/files/georgia-home.jpg'
const SITE_URL = 'https://www.hikasustravel.com'
const PATH = 'things-to-do-in-bakuriani'

// Main attractions covered on the page (for the ItemList / TouristAttraction schema).
const ATTRACTIONS = [
  'Didveli Ski Area',
  'Kokhta Ski Area',
  'Ski and Snowboard Lessons',
  'Snow Activities (Sledding and Snowmobiling)',
  'Forest Hiking Trails',
  'Mountain Biking',
  'Kukushka Narrow-Gauge Railway',
  'Borjomi',
]

export default function ThingsToDoBakurianiPage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  // Fall back to English content until per-language translations are added.
  const page = pages.thingsToDoBakuriani || enPages.thingsToDoBakuriani
  const seo = getSEO('thingsToDoBakuriani', lang)
  const faqItems = useMemo(() => page.faq || [], [page])

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
            { '@type': 'ListItem', position: 2, name: 'Things to Do in Bakuriani', item: url },
          ],
        },
        {
          '@type': 'ItemList',
          name: 'Things to Do in Bakuriani',
          itemListElement: ATTRACTIONS.map((name, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'TouristAttraction',
              name,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Bakuriani',
                addressCountry: 'GE',
              },
            },
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.title,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.content,
            },
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
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </FadeUp>
      </section>
      {faqItems.length > 0 && (
        <section className="page-items faq" id="faq-section">
          <Accordion items={faqItems} headingKey="faq.heroTitle" />
        </section>
      )}
    </>
  )
}
