import { useContext, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import Breadcrumbs from '../shared/Breadcrumbs'
import LocaleLink from '../../i18n/LocaleLink'
import { I18nContext } from '../../i18n/I18nContext'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { getCity, cityPath, thingsToDoPath, legacyRedirects } from '../../data/places'
import { autolinkHtml } from '../../utils/autolink'
import enPages from '../../i18n/locales/en/pages.json'
import NotFoundPage from './NotFoundPage'

const SITE_URL = 'https://www.hikasustravel.com'

/**
 * Generic city detail page. Driven by the places.js registry — the URL
 * /:lang/georgia/:citySlug resolves a registry entry; an unknown or
 * not-yet-published slug renders the 404 page (never an empty stub).
 */
export default function CityPage() {
  const { citySlug } = useParams()
  const city = getCity(citySlug)
  const t = useT()
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const contentRef = useRef(null)

  const published = city && city.published
  const contentKey = published ? city.contentKey : null
  const page = published ? (pages[contentKey] || enPages[contentKey]) : null
  const seo = getSEO(published ? city.seoKey : 'destinations', lang)
  const faqItems = useMemo(() => (page && page.faq) || [], [page])
  // Auto-link destination mentions in the editorial body + FAQ answers, skipping
  // self-links to this very page.
  const excludeKey = published ? `city:${city.slug}` : null
  const linkedContent = useMemo(
    () => (page ? autolinkHtml(page.content, lang, pages, excludeKey) : ''),
    [page, lang, pages, excludeKey],
  )
  const linkedFaq = useMemo(
    () => faqItems.map((it) => ({ ...it, content: autolinkHtml(it.content, lang, pages, excludeKey) })),
    [faqItems, lang, pages, excludeKey],
  )
  const path = published ? cityPath(city.slug).replace(/^\//, '') : ''
  const heroImage = published ? city.image : null
  // Only link the things-to-do guide when the city actually has one published.
  const hasThingsToDo = published && !!city.thingsToDo

  // Most entries here are cities, but a few are reclassified as a place to visit
  // (e.g. Gomismta) while keeping this /georgia/<slug> detail page — their
  // breadcrumb points back to the Places to Visit hub, where their card lives.
  const isPlace = published && city.classifyAs === 'place'
  const parentCrumb = isPlace
    ? { name: t('nav.placesToVisit'), to: '/georgia/places-to-visit' }
    : { name: t('nav.cities'), to: '/georgia/cities' }
  const trail = published
    ? [
        { name: t('breadcrumb.home'), to: '/' },
        { name: t('nav.allDestinations'), to: '/georgia' },
        parentCrumb,
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

  if (!published) {
    // Renamed-slug redirect (the SPA mirror of the static stubs emitted by
    // scripts/prerender.js). An old city slug that no longer matches a registry
    // entry — e.g. the former kazbegi-stepantsminda -> kazbegi rename — is looked
    // up in the shared registry and 301-redirected to its new URL so old links
    // and bookmarks land on the new page instead of a 404. Query params kept.
    const redirect = legacyRedirects().find((r) => r.from === `georgia/${citySlug}`)
    if (redirect) return <Navigate to={`/${lang}/${redirect.to}${location.search}`} replace />
    return <NotFoundPage />
  }

  return (
    <>
      {/* Small breadcrumb bar above the hero — the H1 is the city name. */}
      <div className="dest-breadcrumbs">
        <Breadcrumbs trail={trail} />
      </div>
      <HeroSection image={heroImage} title={city.name} />
      <section className="page-items about-georgia">
        <FadeUp>
          <div ref={contentRef} dangerouslySetInnerHTML={{ __html: linkedContent }} />
        </FadeUp>
        {hasThingsToDo && (
          <FadeUp>
            <p className="city-ttd-cta">
              <LocaleLink to={thingsToDoPath(city.slug)} className="button">
                {t('city.thingsToDoCta', { city: city.name })}
              </LocaleLink>
            </p>
          </FadeUp>
        )}
      </section>
      {faqItems.length > 0 && (
        <section className="page-items faq" id="faq-section">
          <Accordion items={linkedFaq} headingKey="faq.heroTitle" />
        </section>
      )}
    </>
  )
}
