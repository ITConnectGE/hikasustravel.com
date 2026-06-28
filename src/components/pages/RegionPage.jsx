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
import { getRegion, regionPath } from '../../data/places'
import { autolinkHtml } from '../../utils/autolink'
import enPages from '../../i18n/locales/en/pages.json'
import NotFoundPage from './NotFoundPage'

const SITE_URL = 'https://www.hikasustravel.com'

/**
 * Generic region detail page. Scaffolded against the places.js registry; a
 * region renders only once it has `published: true` plus seoKey/contentKey/
 * image. Until then the route resolves to the 404 page (no thin/empty pages).
 */
export default function RegionPage() {
  const { regionSlug } = useParams()
  const region = getRegion(regionSlug)
  const t = useT()
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const navigate = useNavigate()
  const contentRef = useRef(null)

  const published = region && region.published
  const contentKey = published ? region.contentKey : null
  const page = published ? (pages[contentKey] || enPages[contentKey]) : null
  const seo = getSEO(published ? region.seoKey : 'destinations', lang)
  const faqItems = useMemo(() => (page && page.faq) || [], [page])
  // Auto-link other destinations in the body + FAQ, skipping self-links to this
  // region. (Region pages are unpublished today; this is ready for when they go live.)
  const excludeKey = published ? `region:${region.slug}` : null
  // A region can opt out of auto-linking (region.noAutolink) so its body stays
  // plain text and its name isn't linked site-wide until linking is handled.
  const noLink = !!(published && region.noAutolink)
  const linkedContent = useMemo(
    () => (page ? (noLink ? page.content : autolinkHtml(page.content, lang, pages, excludeKey)) : ''),
    [page, lang, pages, excludeKey, noLink],
  )
  const linkedFaq = useMemo(
    () => faqItems.map((it) => ({ ...it, content: noLink ? it.content : autolinkHtml(it.content, lang, pages, excludeKey) })),
    [faqItems, lang, pages, excludeKey, noLink],
  )
  const path = published ? regionPath(region.slug).replace(/^\//, '') : ''
  const heroImage = published ? region.image : null

  const trail = published
    ? [
        { name: t('breadcrumb.home'), to: '/' },
        { name: t('nav.allDestinations'), to: '/georgia' },
        { name: t('nav.regions'), to: '/georgia/regions' },
        { name: region.name },
      ]
    : []

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
          name: region.name,
          description: seo.description,
          url,
          image: `${SITE_URL}${heroImage}`,
          containedInPlace: { '@type': 'Country', name: 'Georgia' },
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
      {/* Small breadcrumb bar above the hero — the H1 is the region name. */}
      <div className="dest-breadcrumbs">
        <Breadcrumbs trail={trail} />
      </div>
      <HeroSection image={heroImage} title={(page && page.heroTitle) || region.name} />
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
