import { Fragment, useContext, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import Breadcrumbs from '../shared/Breadcrumbs'
import EntityToursTag from '../shared/EntityToursTag'
import { I18nContext } from '../../i18n/I18nContext'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { getSite, getCity, getRegion, cityPath, regionPath, sitePath } from '../../data/places'
import { autolinkHtml } from '../../utils/autolink'
import asset from '../../utils/basePath'
import enPages from '../../i18n/locales/en/pages.json'
import NotFoundPage from './NotFoundPage'

const SITE_URL = 'https://www.hikasustravel.com'
// Brand used for ImageObject credit/creator (mirrors og:site_name in useSEO).
const BRAND = 'Hikasus Travel'
// Responsive-variant widths shipped for each gallery base name. These originals
// top out at 1536px (no upscaled 2400 variant), so the largest source is 1536w
// and the fallback <img> uses -1200w.webp. Mirrors the Telavi CityPage gallery.
const GALLERY_WIDTHS = [768, 1200, 1536]
const GALLERY_MAX_WIDTH = GALLERY_WIDTHS[GALLERY_WIDTHS.length - 1]

/**
 * Generic tourist-site detail page. Both city- and region-parented sites now
 * live at /georgia/<parent>/<slug> and arrive via the /georgia/:citySlug/:sub
 * dispatcher (slug in :sub, parent slug in :citySlug). The URL's parent must
 * match the site's registry parent, otherwise (or until the site is published)
 * it renders the 404 page.
 */
export default function SitePage() {
  // Parent slug comes in as :citySlug for both parent types now; :regionSlug is
  // kept for backwards-compatibility with any legacy region URL shape.
  const { siteSlug: siteSlugParam, sub, citySlug, regionSlug } = useParams()
  const siteSlug = siteSlugParam || sub
  const site = getSite(siteSlug)
  const t = useT()
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const navigate = useNavigate()
  const contentRef = useRef(null)

  // The site is only valid at the URL whose parent segment matches its registry
  // parent (region slug now arrives via :citySlug, like a city slug).
  const parentSlug = citySlug || regionSlug
  const parentMatches = site && parentSlug === site.parent
  const published = site && site.published && parentMatches

  const contentKey = published ? site.contentKey : null
  const page = published ? (pages[contentKey] || enPages[contentKey]) : null
  const seo = getSEO(published ? site.seoKey : 'destinations', lang)
  const faqItems = useMemo(() => (page && page.faq) || [], [page])
  // Auto-link other destinations in the body + FAQ, skipping self-links.
  const excludeKey = published ? `place:${site.slug}` : null
  const linkedContent = useMemo(
    () => (page ? autolinkHtml(page.content, lang, pages, excludeKey) : ''),
    [page, lang, pages, excludeKey],
  )
  const linkedFaq = useMemo(
    () => faqItems.map((it) => ({ ...it, content: autolinkHtml(it.content, lang, pages, excludeKey) })),
    [faqItems, lang, pages, excludeKey],
  )
  const path = published ? sitePath(site).replace(/^\//, '') : ''
  const heroImage = published ? site.image : null

  // Body/gallery images (our own photos): resolve each image's alt + figcaption
  // to the current locale from its 7-language maps in places.js (site.gallery).
  // English is a crash-guard only — every locale ships its own strings, so
  // non-English pages never show English alt/captions. Same mechanism as the
  // Telavi CityPage gallery; the hero is untouched (these are body images only).
  const gallery = useMemo(() => {
    if (!published || !site.gallery) return []
    return site.gallery.map((img) => ({
      ...img,
      alt: (img.alt && (img.alt[lang] || img.alt.en)) || '',
      caption: (img.caption && (img.caption[lang] || img.caption.en)) || '',
    }))
  }, [published, site, lang])
  // Any item flagged `hero` would be a cover image (not rendered inline); the
  // rest are body images placed between content sections via their `afterChunk`.
  const bodyImages = useMemo(() => gallery.filter((img) => !img.hero), [gallery])
  // Split the body HTML into chunks at each <h2> (chunk 0 = intro), so body
  // images can be interleaved between sections rather than grouped in a block.
  const bodyChunks = useMemo(
    () => (linkedContent ? linkedContent.split(/(?=<h2)/) : []),
    [linkedContent],
  )
  // Localized alt text for the hero image (from the image SEO package). The hero
  // renders as a CSS background, so this carries the alt into the ImageObject
  // caption and og:image:alt / twitter:image:alt instead of an <img alt>. Two
  // sources: the legacy `imageMeta` hero mechanism (e.g. Batonis Tsikhe), or a
  // gallery item flagged `hero` (e.g. Tsinandali) whose alt is already resolved
  // to the current locale in the `gallery` memo above.
  const heroImageMeta = published ? site.imageMeta : null
  const heroGalleryImg = useMemo(() => gallery.find((img) => img.hero) || null, [gallery])
  const heroAlt = heroImageMeta
    ? (heroImageMeta.alt[lang] || heroImageMeta.alt.en)
    : (heroGalleryImg ? heroGalleryImg.alt : null)

  const parent = published
    ? (site.parentType === 'city' ? getCity(site.parent)
      : site.parentType === 'region' ? getRegion(site.parent)
      : null)
    : null
  let trail = []
  if (published) {
    trail = [
      { name: t('breadcrumb.home'), to: '/' },
      { name: t('nav.allDestinations'), to: '/georgia' },
    ]
    if (site.parentType === 'place') {
      // Sites parented on a local destination without its own landing page use
      // the Places to Visit hub as their intermediate crumb (that's where their
      // card lives), avoiding a dead link to a town page that doesn't exist.
      trail.push({ name: t('nav.placesToVisit'), to: '/georgia/places-to-visit' })
    } else {
      trail.push(
        site.parentType === 'city'
          ? { name: t('nav.cities'), to: '/georgia/cities' }
          : { name: t('nav.regions'), to: '/georgia/regions' },
      )
      trail.push({
        name: parent ? parent.name : site.parent,
        // Only link the parent crumb when its landing page actually exists
        // (is published). Region landings are currently unpublished, so their
        // crumb renders as plain text rather than a dead 404 link.
        to: parent && parent.published
          ? (site.parentType === 'city' ? cityPath(site.parent) : regionPath(site.parent))
          : undefined,
      })
    }
    trail.push({ name: site.name })
  }

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
    // Most sites are places (TouristAttraction). Thematic/cultural explainers can
    // opt into an Article-class type via `schemaType` (e.g. 'TravelGuide') so they
    // aren't mislabelled as a physical attraction.
    const primaryNode =
      site.schemaType === 'TravelGuide' || site.schemaType === 'Article'
        ? {
            '@type': site.schemaType,
            name: site.name,
            headline: (page && page.heroTitle) || site.name,
            description: seo.description,
            url,
            image: `${SITE_URL}${heroImage}`,
            inLanguage: lang,
            about: { '@type': 'Place', name: 'Kakheti, Georgia' },
          }
        : {
            '@type': 'TouristAttraction',
            name: site.name,
            description: seo.description,
            url,
            image: `${SITE_URL}${heroImage}`,
            containedInPlace: { '@type': 'Country', name: 'Georgia' },
          }
    // Image SEO/AEO: a standalone ImageObject describing the hero. Because the
    // hero is a CSS background (not an indexable <img>), this keeps the image
    // describable to Google/AI — contentUrl points at the real image file.
    const imageNode = heroImageMeta
      ? {
          '@type': 'ImageObject',
          contentUrl: `${SITE_URL}${heroImage}`,
          url: `${SITE_URL}${heroImage}`,
          width: heroImageMeta.width,
          height: heroImageMeta.height,
          caption: heroAlt,
          name: heroImageMeta.name,
          description: heroImageMeta.description,
          representativeOfPage: true,
          creator: { '@type': 'Organization', name: BRAND },
          creditText: BRAND,
          copyrightNotice: `© ${BRAND}`,
          contentLocation: {
            '@type': 'Place',
            name: heroImageMeta.locationName,
            address: {
              '@type': 'PostalAddress',
              addressLocality: heroImageMeta.locality,
              addressRegion: heroImageMeta.region,
              addressCountry: heroImageMeta.country,
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: heroImageMeta.geo.lat,
              longitude: heroImageMeta.geo.lng,
            },
          },
        }
      : null
    return {
      '@context': 'https://schema.org',
      '@graph': [
        primaryNode,
        ...(imageNode ? [imageNode] : []),
        // Body/gallery images (our own photos) — one ImageObject each, contentUrl
        // pointing at the real largest file; caption localized per locale, brand
        // credit. These are body images (not the hero), so representativeOfPage
        // follows the item's `hero` flag (false here).
        ...gallery.map((img) => {
          // Largest shipped variant for this image (per-image override or default).
          const maxW = img.widths ? img.widths[img.widths.length - 1] : GALLERY_MAX_WIDTH
          return {
          '@type': 'ImageObject',
          contentUrl: `${SITE_URL}/images/files/${img.base}-${maxW}w.webp`,
          url: `${SITE_URL}/images/files/${img.base}-${maxW}w.webp`,
          width: maxW,
          height: Math.round((maxW * img.height) / img.width),
          representativeOfPage: !!img.hero,
          name: img.name,
          caption: img.caption || img.description,
          description: img.description,
          creator: { '@type': 'Organization', name: BRAND },
          creditText: BRAND,
          copyrightNotice: `© ${BRAND}`,
          contentLocation: {
            '@type': 'Place',
            name: img.locationName,
            address: {
              '@type': 'PostalAddress',
              addressLocality: img.locality,
              addressRegion: img.region,
              addressCountry: img.country,
            },
            geo: { '@type': 'GeoCoordinates', latitude: img.geo.lat, longitude: img.geo.lng },
          },
          }
        }),
        // Cover + contextual body photos rendered as inline <figure> blocks in the
        // per-locale body HTML (not via the data-driven gallery above). Each gets
        // one ImageObject here — contentUrl at the largest shipped variant
        // (img.width), brand credit, its own contentLocation, and the cover flagged
        // hero → representativeOfPage. Mirrors the CityPage imageObjects convention.
        ...(site.imageObjects || []).map((img) => ({
          '@type': 'ImageObject',
          contentUrl: `${SITE_URL}/images/files/${img.base}-${img.width}w.webp`,
          url: `${SITE_URL}/images/files/${img.base}-${img.width}w.webp`,
          width: img.width,
          height: img.height,
          representativeOfPage: !!img.hero,
          name: img.name,
          caption: img.caption,
          description: img.description,
          creator: { '@type': 'Organization', name: BRAND },
          creditText: BRAND,
          copyrightNotice: `© ${BRAND}`,
          contentLocation: {
            '@type': 'Place',
            name: img.locationName,
            address: {
              '@type': 'PostalAddress',
              addressLocality: img.locality,
              addressRegion: img.region,
              addressCountry: 'GE',
            },
            geo: { '@type': 'GeoCoordinates', latitude: img.geo.lat, longitude: img.geo.lng },
          },
        })),
        {
          '@type': 'BreadcrumbList',
          // Every ListItem must carry an `item` URL — Google flags a non-final
          // breadcrumb entry without one as an "Item: N/A" structured-data error
          // (which previously affected region-parented places, whose parent
          // region landing is unpublished and so has no link). Linked crumbs use
          // their own URL; a non-linked crumb falls back to the current page URL,
          // matching CityPage/RegionPage/ThingsToDoCityPage.
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
  }, [published, lang, path, seo.description, heroImage, faqItems, gallery])

  useSEO(published ? {
    ...seo, lang, path,
    image: heroImage,
    imageAlt: heroAlt,
    // Prefer the dedicated 1.91:1 social image for og:image/twitter:image when
    // the site defines one; otherwise useSEO falls back to the hero image.
    ogImage: site.ogImage?.src,
    ogImageWidth: site.ogImage?.width,
    ogImageHeight: site.ogImage?.height,
    jsonLd,
  } : {})

  if (!published) return <NotFoundPage />

  return (
    <>
      {/* Small breadcrumb bar above the hero — the H1 is the site name. */}
      <div className="dest-breadcrumbs">
        <Breadcrumbs trail={trail} />
      </div>
      <HeroSection image={heroImage} imageAvif={site.imageAvif} bgClass={site.heroClass} title={page.heroTitle || site.name} />
      <section className="page-items about-georgia">
        <EntityToursTag type="site" slug={site.slug} name={site.name} />
        <div ref={contentRef}>
          {bodyChunks.map((chunk, i) => {
            const img = bodyImages.find((im) => im.afterChunk === i)
            // Per-image responsive widths. Most sets ship the default 1536-topped
            // variants, but some originals top out lower (e.g. Ananuri: 1448/1445
            // landscape, 1086 portrait), so a gallery item may override `widths`
            // and the fallback <img> width. Defaults keep Telavi/Tsinandali intact.
            const widths = img ? (img.widths || GALLERY_WIDTHS) : null
            const fallbackW = img ? (img.fallbackWidth || 1200) : null
            return (
              <Fragment key={`chunk-${i}`}>
                <FadeUp>
                  <div dangerouslySetInnerHTML={{ __html: chunk }} />
                </FadeUp>
                {img && (
                  /* Body image between content sections — real, crawlable, lazy
                     responsive <picture>/<img> (not the hero, not a CSS background). */
                  <FadeUp>
                    <figure className="city-body-figure">
                      <picture>
                        <source
                          type="image/avif"
                          srcSet={widths.map((w) => `${asset(`/images/files/${img.base}-${w}w.avif`)} ${w}w`).join(', ')}
                          sizes="(max-width: 768px) 100vw, 760px"
                        />
                        <source
                          type="image/webp"
                          srcSet={widths.map((w) => `${asset(`/images/files/${img.base}-${w}w.webp`)} ${w}w`).join(', ')}
                          sizes="(max-width: 768px) 100vw, 760px"
                        />
                        <img
                          src={asset(`/images/files/${img.base}-${fallbackW}w.webp`)}
                          width={img.width}
                          height={img.height}
                          alt={img.alt}
                          loading="lazy"
                          decoding="async"
                          className="city-body-figure__img"
                        />
                      </picture>
                      {img.caption && <figcaption className="city-body-figure__caption">{img.caption}</figcaption>}
                    </figure>
                  </FadeUp>
                )}
              </Fragment>
            )
          })}
        </div>
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
          <Accordion items={linkedFaq} headingKey="faq.heroTitle" />
        </section>
      )}
    </>
  )
}
