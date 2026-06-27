import { useContext, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import Breadcrumbs from '../shared/Breadcrumbs'
import { I18nContext } from '../../i18n/I18nContext'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { getCity, cityPath, thingsToDoPath } from '../../data/places'
import { autolinkHtml } from '../../utils/autolink'
import enPages from '../../i18n/locales/en/pages.json'
import NotFoundPage from './NotFoundPage'

const SITE_URL = 'https://www.hikasustravel.com'

/**
 * Generic "Things to do in <City>" page, driven by the places.js registry.
 * The URL /:lang/georgia/:citySlug/:ttd resolves a city whose `thingsToDo`
 * block exists and whose `:ttd` segment is exactly things-to-do-in-<citySlug>;
 * anything else renders the 404 page (never an empty stub).
 */
export default function ThingsToDoCityPage() {
  // Served via the /georgia/:citySlug/:sub dispatcher (CitySubPage); the second
  // segment arrives as :sub.
  const { citySlug, sub: ttd } = useParams()
  const city = getCity(citySlug)
  const t = useT()
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const navigate = useNavigate()
  const contentRef = useRef(null)

  const config = city && city.published ? city.thingsToDo : null
  // Guard the exact slug so /georgia/tbilisi/anything doesn't render this page.
  const valid = !!config && ttd === `things-to-do-in-${citySlug}`

  const heroImage = config ? (config.image || city.image) : null
  const page = valid ? (pages[config.contentKey] || enPages[config.contentKey]) : null
  const seo = getSEO(valid ? config.seoKey : 'destinations', lang)
  const faqItems = useMemo(() => (page && page.faq) || [], [page])
  // Auto-link destination mentions in the body + FAQ. This page is a city's
  // things-to-do guide (a distinct URL from the city page), so no self-link
  // exclusion is needed — mentions of the city link to the city page itself.
  const linkedContent = useMemo(
    () => (page ? autolinkHtml(page.content, lang, pages) : ''),
    [page, lang, pages],
  )
  const linkedFaq = useMemo(
    () => faqItems.map((it) => ({ ...it, content: autolinkHtml(it.content, lang, pages) })),
    [faqItems, lang, pages],
  )
  const path = valid ? thingsToDoPath(citySlug).replace(/^\//, '') : ''
  const ttdLabel = valid ? t('city.thingsToDoCta', { city: city.name }) : ''

  const trail = valid
    ? [
        { name: t('breadcrumb.home'), to: '/' },
        { name: t('nav.allDestinations'), to: '/georgia' },
        { name: city.name, to: cityPath(city.slug) },
        { name: ttdLabel },
      ]
    : []

  // Intercept in-content internal links (data-internal) for same-tab SPA nav.
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
  }, [lang, navigate, valid])

  const jsonLd = useMemo(() => {
    if (!valid) return null
    const url = `${SITE_URL}/${lang}/${path}`
    return {
      '@context': 'https://schema.org',
      '@graph': [
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
          '@type': 'ItemList',
          name: ttdLabel,
          itemListElement: config.attractions.map((name, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'TouristAttraction',
              name,
              address: { '@type': 'PostalAddress', ...config.address, addressCountry: 'GE' },
            },
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
  }, [valid, lang, path, seo.description, heroImage, faqItems, ttdLabel])

  useSEO(valid ? { ...seo, lang, path, image: heroImage, jsonLd } : {})

  if (!valid) return <NotFoundPage />

  return (
    <>
      <div className="dest-breadcrumbs">
        <Breadcrumbs trail={trail} />
      </div>
      <HeroSection image={heroImage} title={page.heroTitle} />
      <section className="page-items about-georgia">
        <FadeUp>
          <div ref={contentRef} dangerouslySetInnerHTML={{ __html: linkedContent }} />
        </FadeUp>
      </section>
      {faqItems.length > 0 && (
        <section className="page-items faq" id="faq-section">
          <Accordion items={linkedFaq} headingKey="faq.heroTitle" />
        </section>
      )}
    </>
  )
}
