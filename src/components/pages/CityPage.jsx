import { useContext, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import Breadcrumbs from '../shared/Breadcrumbs'
import { I18nContext } from '../../i18n/I18nProvider'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { getCity } from '../../data/places'
import enPages from '../../i18n/locales/en/pages.json'
import NotFoundPage from './NotFoundPage'

const SITE_URL = 'https://www.hikasustravel.com'

/**
 * Generic city detail page. Driven by the places.js registry — the URL
 * /:lang/destinations/cities/:citySlug resolves a registry entry; an unknown
 * or not-yet-published slug renders the 404 page (never an empty stub).
 */
export default function CityPage() {
  const { citySlug } = useParams()
  const city = getCity(citySlug)
  const t = useT()
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const navigate = useNavigate()
  const contentRef = useRef(null)

  const published = city && city.published
  const contentKey = published ? city.contentKey : null
  const page = published ? (pages[contentKey] || enPages[contentKey]) : null
  const seo = getSEO(published ? city.seoKey : 'destinations', lang)
  const faqItems = useMemo(() => (page && page.faq) || [], [page])
  const path = published ? `destinations/cities/${city.slug}` : ''
  const heroImage = published ? city.image : null

  const trail = published
    ? [
        { name: t('breadcrumb.home'), to: '/' },
        { name: t('nav.allDestinations'), to: '/destinations' },
        { name: t('nav.cities'), to: '/destinations/cities' },
        { name: city.name },
      ]
    : []

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
  }, [lang, navigate, published])

  const jsonLd = useMemo(() => {
    if (!published) return null
    const url = `${SITE_URL}/${lang}/${path}`
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TouristDestination',
          name: city.name,
          description: seo.description,
          url,
          image: `${SITE_URL}${heroImage}`,
          containedInPlace: { '@type': 'Country', name: 'Georgia' },
        },
        {
          '@type': 'Article',
          headline: page.heroTitle,
          description: seo.description,
          inLanguage: lang,
          mainEntityOfPage: url,
          image: `${SITE_URL}${heroImage}`,
          author: { '@type': 'Organization', name: 'Hikasus Travel' },
          publisher: { '@type': 'Organization', name: 'Hikasus Travel', url: SITE_URL },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: c.to ? `${SITE_URL}/${lang}${c.to === '/' ? '' : c.to}` : url,
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.title,
            acceptedAnswer: { '@type': 'Answer', text: item.content },
          })),
        },
      ],
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [published, lang, path, seo.description, heroImage, faqItems])

  useSEO(published ? { ...seo, lang, path, image: heroImage, jsonLd } : {})

  if (!published) return <NotFoundPage />

  return (
    <>
      <HeroSection image={heroImage} title={page.heroTitle} />
      <section className="page-items about-georgia">
        <FadeUp>
          <Breadcrumbs trail={trail} />
        </FadeUp>
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
