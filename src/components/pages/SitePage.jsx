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
import { getSite, getCity, getRegion, cityPath, regionPath, sitePath } from '../../data/places'
import enPages from '../../i18n/locales/en/pages.json'
import NotFoundPage from './NotFoundPage'

const SITE_URL = 'https://www.hikasustravel.com'

/**
 * Generic tourist-site detail page. Serves both nesting patterns:
 *   /georgia/:citySlug/places-to-visit/:siteSlug
 *   /georgia/regions/:regionSlug/places-to-visit/:siteSlug
 * The URL's parent must match the site's registry parent, otherwise (or until
 * the site is published) it renders the 404 page.
 */
export default function SitePage() {
  // City-parented sites arrive via the /georgia/:citySlug/:sub dispatcher (slug
  // in :sub); region-parented sites use /georgia/regions/:regionSlug/:siteSlug.
  const { siteSlug: siteSlugParam, sub, citySlug, regionSlug } = useParams()
  const siteSlug = siteSlugParam || sub
  const site = getSite(siteSlug)
  const t = useT()
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const navigate = useNavigate()
  const contentRef = useRef(null)

  // The site is only valid at the URL whose parent matches its registry parent.
  const parentMatches =
    site &&
    ((site.parentType === 'city' && citySlug === site.parent) ||
      (site.parentType === 'region' && regionSlug === site.parent))
  const published = site && site.published && parentMatches

  const contentKey = published ? site.contentKey : null
  const page = published ? (pages[contentKey] || enPages[contentKey]) : null
  const seo = getSEO(published ? site.seoKey : 'destinations', lang)
  const faqItems = useMemo(() => (page && page.faq) || [], [page])
  const path = published ? sitePath(site).replace(/^\//, '') : ''
  const heroImage = published ? site.image : null

  const parent = published
    ? (site.parentType === 'city' ? getCity(site.parent) : getRegion(site.parent))
    : null
  const trail = published
    ? [
        { name: t('breadcrumb.home'), to: '/' },
        { name: t('nav.allDestinations'), to: '/georgia' },
        site.parentType === 'city'
          ? { name: t('nav.cities'), to: '/georgia/cities' }
          : { name: t('nav.regions'), to: '/georgia/regions' },
        {
          name: parent ? parent.name : site.parent,
          to: site.parentType === 'city' ? cityPath(site.parent) : regionPath(site.parent),
        },
        { name: site.name },
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
          '@type': 'TouristAttraction',
          name: site.name,
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
      {/* Small breadcrumb bar above the hero — the H1 is the site name. */}
      <div className="dest-breadcrumbs">
        <Breadcrumbs trail={trail} />
      </div>
      <HeroSection image={heroImage} title={page.heroTitle || site.name} />
      <section className="page-items about-georgia">
        <FadeUp>
          <div ref={contentRef} dangerouslySetInnerHTML={{ __html: page.content }} />
        </FadeUp>
      </section>
      {site.imageCredit && (
        /* Hero photo attribution — required by the image's Creative Commons licence. */
        <section className="page-items">
          <p style={{ fontSize: '0.8rem', opacity: 0.65, textAlign: 'center', margin: 0 }}>
            Photo:{' '}
            <a href={site.imageCredit.sourceUrl} target="_blank" rel="noopener noreferrer">
              {site.imageCredit.author}
            </a>{' '}
            via Wikimedia Commons,{' '}
            <a href={site.imageCredit.licenseUrl} target="_blank" rel="noopener noreferrer">
              {site.imageCredit.license}
            </a>{' '}
            (resized).
          </p>
        </section>
      )}
      {faqItems.length > 0 && (
        <section className="page-items faq" id="faq-section">
          <Accordion items={faqItems} headingKey="faq.heroTitle" />
        </section>
      )}
    </>
  )
}
