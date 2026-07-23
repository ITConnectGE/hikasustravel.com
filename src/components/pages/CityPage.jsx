import { Fragment, useContext, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import Breadcrumbs from '../shared/Breadcrumbs'
import LocaleLink from '../../i18n/LocaleLink'
import EntityToursTag from '../shared/EntityToursTag'
import { I18nContext } from '../../i18n/I18nContext'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { getCity, cityPath, thingsToDoPath, legacyRedirects } from '../../data/places'
import { autolinkHtml } from '../../utils/autolink'
import asset from '../../utils/basePath'
import enPages from '../../i18n/locales/en/pages.json'
import NotFoundPage from './NotFoundPage'

const SITE_URL = 'https://www.hikasustravel.com'
// Brand used for ImageObject credit/creator (mirrors og:site_name / the Article
// author & publisher below).
const BRAND = 'Hikasus Travel'
// Responsive-variant widths shipped for each gallery base name.
const GALLERY_WIDTHS = [1200, 1600, 2400]

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
  // Localized alt for the hero when the city ships an `imageMeta` block (hero is a
  // CSS background with no <img alt>): carried into the hero ImageObject caption
  // and og:image:alt / twitter:image:alt per locale. Mirrors SitePage's imageMeta.
  const heroImageMeta = published ? city.imageMeta : null
  const heroAlt = heroImageMeta ? (heroImageMeta.alt[lang] || heroImageMeta.alt.en) : null
  // Only link the things-to-do guide when the city actually has one published.
  const hasThingsToDo = published && !!city.thingsToDo

  // Body/gallery images: resolve each image's alt + figcaption to the current
  // locale from its 7-language maps in places.js (city.gallery). English is a
  // crash-guard only — every locale ships its own strings, so non-English pages
  // never show English alt/captions.
  const gallery = useMemo(() => {
    if (!published || !city.gallery) return []
    return city.gallery.map((img) => ({
      ...img,
      alt: (img.alt && (img.alt[lang] || img.alt.en)) || '',
      caption: (img.caption && (img.caption[lang] || img.caption.en)) || '',
    }))
  }, [published, city, lang])
  // The gallery item flagged `hero` is the cover image (not rendered inline); the
  // rest are body images placed between content sections via their `afterChunk`.
  const bodyImages = useMemo(() => gallery.filter((img) => !img.hero), [gallery])
  // Split the body HTML into chunks at each <h2> (chunk 0 = intro), so body
  // images can be interleaved between sections rather than grouped in a block.
  const bodyChunks = useMemo(
    () => (linkedContent ? linkedContent.split(/(?=<h2)/) : []),
    [linkedContent],
  )
  // Portrait inline body photos (city.portraitInlines) — real <figure> figures
  // placed between sections via `afterChunk`, with a 768/1024 ladder capped at
  // 560px by `.body-img--portrait`. Distinct from the landscape `gallery` above:
  // these ship variants WITHOUT the `w` filename suffix and never flag the cover.
  // alt/caption resolve to the current locale from their 7-language maps (English
  // is a crash-guard only), so figures stay localized even when the body content
  // itself falls back to English.
  const portraitInlines = useMemo(() => {
    if (!published || !city.portraitInlines) return []
    return city.portraitInlines.map((img) => ({
      ...img,
      altText: (img.alt && (img.alt[lang] || img.alt.en)) || '',
      captionText: (img.caption && (img.caption[lang] || img.caption.en)) || '',
    }))
  }, [published, city, lang])

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
        // Body/gallery images (our own photos) — one ImageObject each, contentUrl
        // pointing at the real file; caption localized per locale, brand credit.
        ...gallery.map((img) => ({
          '@type': 'ImageObject',
          contentUrl: `${SITE_URL}/images/files/${img.base}-1600w.webp`,
          url: `${SITE_URL}/images/files/${img.base}-1600w.webp`,
          width: img.width,
          height: img.height,
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
              addressLocality: 'Telavi',
              addressRegion: 'Kakheti',
              addressCountry: 'GE',
            },
            geo: { '@type': 'GeoCoordinates', latitude: img.geo.lat, longitude: img.geo.lng },
          },
        })),
        // Contextual body photos rendered as inline <figure> blocks in the
        // per-locale body HTML (not via the data-driven gallery above). Each
        // gets one ImageObject here — contentUrl at the largest shipped variant,
        // brand credit, and its own contentLocation (locality/region/geo) so the
        // location is correct per image (e.g. Katskhi Pillar vs. Chiatura town),
        // never the hardcoded Telavi/Kakheti of the gallery block above.
        ...(city.imageObjects || []).map((img) => ({
          '@type': 'ImageObject',
          contentUrl: `${SITE_URL}/images/files/${img.base}-${img.width}w.webp`,
          url: `${SITE_URL}/images/files/${img.base}-${img.width}w.webp`,
          width: img.width,
          height: img.height,
          representativeOfPage: !!img.hero,
          name: img.name,
          caption: img.caption,
          description: img.description,
          // Credit defaults to the brand (our own photos), but an image may
          // override it — e.g. an unresolved/third-party origin left as a
          // REPLACE-BRAND placeholder until attribution is confirmed.
          creator: { '@type': 'Organization', name: img.creator || BRAND },
          creditText: img.creditText || BRAND,
          copyrightNotice: img.copyrightNotice || `© ${BRAND}`,
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
        // Portrait inline body images (real <figure> blocks rendered below) that
        // ship their variants WITHOUT the `w` filename suffix and need a stable
        // per-image `@id`. Mirrors SitePage's `inlineImageObjects` convention:
        // contentUrl at the largest shipped variant (-<width>.webp), brand credit,
        // own contentLocation, and never representativeOfPage — the hero stays the
        // representative image. name/caption are localized per locale.
        ...portraitInlines.map((img) => ({
          '@type': 'ImageObject',
          '@id': `${url}#${img.anchor}`,
          contentUrl: `${SITE_URL}/images/files/${img.base}-${img.width}.webp`,
          url: `${SITE_URL}/images/files/${img.base}-${img.width}.webp`,
          width: img.width,
          height: img.height,
          name: img.altText,
          caption: img.captionText,
          description: (img.caption && img.caption.en) || img.captionText,
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
        // Hero ImageObject via the `imageMeta` block (for heroes whose file naming
        // or single-variant ceiling doesn't fit the gallery/imageObjects builders).
        // contentUrl points at the hero file itself (`city.image`); caption is the
        // localized alt; the cover is representativeOfPage. Mirrors SitePage.
        ...(heroImageMeta ? [{
          '@type': 'ImageObject',
          contentUrl: `${SITE_URL}${heroImage}`,
          url: `${SITE_URL}${heroImage}`,
          width: heroImageMeta.width,
          height: heroImageMeta.height,
          representativeOfPage: true,
          name: heroImageMeta.name,
          caption: heroAlt,
          description: heroImageMeta.description,
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
            geo: { '@type': 'GeoCoordinates', latitude: heroImageMeta.geo.lat, longitude: heroImageMeta.geo.lng },
          },
        }] : []),
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
  }, [published, lang, path, seo.description, heroImage, faqItems, gallery, portraitInlines])

  useSEO(published ? {
    ...seo, lang, path,
    image: heroImage,
    imageAlt: heroAlt,
    // Prefer a dedicated 1.91:1 social image (og:image/twitter:image) when the
    // city defines one; otherwise useSEO falls back to the hero image.
    ogImage: city.ogImage?.src,
    ogImageWidth: city.ogImage?.width,
    ogImageHeight: city.ogImage?.height,
    jsonLd,
  } : {})

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
      <HeroSection image={heroImage} imageAvif={city.imageAvif} bgClass={city.heroClass} title={city.name} />
      <section className="page-items about-georgia">
        <EntityToursTag type="city" slug={city.slug} name={city.name} />
        <div ref={contentRef}>
          {bodyChunks.map((chunk, i) => {
            const img = bodyImages.find((im) => im.afterChunk === i)
            const portrait = portraitInlines.find((im) => im.afterChunk === i)
            return (
              <Fragment key={`chunk-${i}`}>
                <FadeUp>
                  <div dangerouslySetInnerHTML={{ __html: chunk }} />
                </FadeUp>
                {portrait && (
                  /* Portrait body image between sections — real, crawlable, lazy
                     responsive <picture>/<img>. Ladder 768/1024 only (native
                     1024×1536, no upscale); display capped at 560px and centred by
                     `.body-img--portrait`. */
                  <FadeUp>
                    <figure className="body-img body-img--portrait">
                      <picture>
                        <source
                          type="image/avif"
                          srcSet={`${asset(`/images/files/${portrait.base}-768.avif`)} 768w, ${asset(`/images/files/${portrait.base}-1024.avif`)} 1024w`}
                          sizes="(min-width: 768px) 560px, 100vw"
                        />
                        <source
                          type="image/webp"
                          srcSet={`${asset(`/images/files/${portrait.base}-768.webp`)} 768w, ${asset(`/images/files/${portrait.base}-1024.webp`)} 1024w`}
                          sizes="(min-width: 768px) 560px, 100vw"
                        />
                        <img
                          src={asset(`/images/files/${portrait.base}-768.webp`)}
                          width={portrait.width}
                          height={portrait.height}
                          alt={portrait.altText}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                      {portrait.captionText && <figcaption>{portrait.captionText}</figcaption>}
                    </figure>
                  </FadeUp>
                )}
                {img && (
                  /* Body image between content sections — real, crawlable, lazy
                     responsive <picture>/<img> (not the hero, not a CSS background). */
                  <FadeUp>
                    <figure className="city-body-figure">
                      <picture>
                        <source
                          type="image/avif"
                          srcSet={GALLERY_WIDTHS.map((w) => `${asset(`/images/files/${img.base}-${w}w.avif`)} ${w}w`).join(', ')}
                          sizes="(max-width: 768px) 100vw, 760px"
                        />
                        <source
                          type="image/webp"
                          srcSet={GALLERY_WIDTHS.map((w) => `${asset(`/images/files/${img.base}-${w}w.webp`)} ${w}w`).join(', ')}
                          sizes="(max-width: 768px) 100vw, 760px"
                        />
                        <img
                          src={asset(`/images/files/${img.base}-1600w.webp`)}
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
