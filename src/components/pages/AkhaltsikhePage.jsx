import { useContext, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import { I18nContext } from '../../i18n/I18nProvider'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import enPages from '../../i18n/locales/en/pages.json'

// Placeholder hero — replace with a real Rabati Castle / Akhaltsikhe photo when available.
const HERO_IMAGE = '/images/files/georgia-home.jpg'
const SITE_URL = 'https://www.hikasustravel.com'

export default function AkhaltsikhePage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const navigate = useNavigate()
  const contentRef = useRef(null)
  // Fall back to English content until per-language translations are added.
  const page = pages.akhaltsikhe || enPages.akhaltsikhe
  const seo = getSEO('akhaltsikhe', lang)
  const faqItems = useMemo(() => page.faq || [], [page])

  // Intercept in-content internal links (data-internal) for same-tab SPA navigation.
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const onClick = (e) => {
      const link = e.target.closest('a[data-internal]')
      if (!link || !el.contains(link)) return
      e.preventDefault()
      navigate(`/${lang}${link.getAttribute('data-internal')}`)
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [lang, navigate])

  const jsonLd = useMemo(() => {
    const url = `${SITE_URL}/${lang}/destinations/akhaltsikhe`
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TouristDestination',
          name: 'Akhaltsikhe',
          description: seo.description,
          url,
          image: `${SITE_URL}${HERO_IMAGE}`,
          containedInPlace: {
            '@type': 'Country',
            name: 'Georgia',
          },
        },
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
            { '@type': 'ListItem', position: 2, name: 'Akhaltsikhe', item: url },
          ],
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

  useSEO({ ...seo, lang, path: 'destinations/akhaltsikhe', image: HERO_IMAGE, jsonLd })

  return (
    <>
      <HeroSection image={HERO_IMAGE} title={page.heroTitle} />
      <section className="page-items about-georgia">
        <FadeUp>
          <div ref={contentRef} dangerouslySetInnerHTML={{ __html: page.content }} />
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
