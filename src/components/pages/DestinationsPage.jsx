import { useContext, useMemo } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import BlurUpBackground from '../shared/BlurUpBackground'
import Breadcrumbs from '../shared/Breadcrumbs'
import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import { I18nContext } from '../../i18n/I18nContext'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { cities, cityPath } from '../../data/places'
import enPages from '../../i18n/locales/en/pages.json'

const HERO_IMAGE = '/images/files/tbilisi-old-town-narikala-mtkvari-georgia-1200.webp'
const SITE_URL = 'https://www.hikasustravel.com'

// The four ways into the Destinations section. Wineries are intentionally
// omitted until winery pages are published.
const SUBHUBS = [
  { to: '/georgia/regions', image: '/images/files/georgia-home.jpg', labelKey: 'nav.regions' },
  { to: '/georgia/cities', image: '/images/files/tbilisi-old-town-narikala-mtkvari-georgia-1200.webp', labelKey: 'nav.cities' },
  { to: '/georgia/places-to-visit', image: '/images/files/georgia-home.jpg', labelKey: 'nav.placesToVisit' },
]

// Existing important destination pages — the published city guides. Entries
// reclassified as a place to visit (e.g. Gomismta) are not cities, so they are
// excluded from the featured-cities strip.
const FEATURED_CITIES = cities.filter((c) => c.published && c.classifyAs !== 'place')

export default function DestinationsPage() {
  const t = useT()
  const { lang } = useLang()
  const { pages } = useContext(I18nContext)
  const page = pages.destinations || enPages.destinations
  const seo = getSEO('destinations', lang)

  const trail = [
    { name: t('breadcrumb.home'), to: '/' },
    { name: t('nav.allDestinations') },
  ]

  // The label a visitor actually reads: the localized nav label when one exists,
  // otherwise the registry's real display name — never the raw key.
  const cityTitle = (c) => {
    const navKey = `nav.${c.slug}`
    const navLabel = t(navKey)
    return navLabel === navKey ? c.name : navLabel
  }

  // Tbilisi first (matched on its stable slug, not its label — it renders as
  // Tiflis/Tbilissi in some locales), then the rest A–Z by that visible label.
  // Sorted here rather than on the module-level constant because the label is
  // locale-dependent, so the order legitimately differs per language (Czech, for
  // instance, collates "Ch" after "H").
  const titled = FEATURED_CITIES.map((c) => ({ city: c, title: cityTitle(c) }))
  const orderedCities = [
    ...titled.filter((x) => x.city.slug === 'tbilisi'),
    ...titled
      .filter((x) => x.city.slug !== 'tbilisi')
      .sort((a, b) => a.title.localeCompare(b.title, lang, { sensitivity: 'base' })),
  ]

  const jsonLd = useMemo(() => {
    const url = `${SITE_URL}/${lang}/georgia`
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('breadcrumb.home'), item: `${SITE_URL}/${lang}` },
            { '@type': 'ListItem', position: 2, name: t('nav.allDestinations'), item: url },
          ],
        },
        {
          '@type': 'ItemList',
          name: 'Destinations in Georgia',
          itemListElement: SUBHUBS.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t(d.labelKey),
            url: `${SITE_URL}/${lang}${d.to}`,
          })),
        },
      ],
    }
  }, [lang, t])

  useSEO({ ...seo, lang, path: 'georgia', image: HERO_IMAGE, jsonLd })

  return (
    <>
      <HeroSection image={HERO_IMAGE} title={page.heroTitle} />

      <section className="home-items">
        <div className="tours-grid-container">
          <FadeUp>
            <Breadcrumbs trail={trail} />
          </FadeUp>
          <FadeUp>
            {/* Left-aligned inside the centred section: centred body copy makes a
                mid-sentence line break read as a large gap between the last word
                of one line and the first of the next. The block itself stays
                centred (width/max-width/margin are unchanged), so nothing moves. */}
            <p className="dest-intro">{page.intro}</p>
          </FadeUp>
          <FadeUp>
            <div className="tours-grid">
              {SUBHUBS.map((d) => {
                const title = t(d.labelKey)
                return (
                  <div className="tour-tile" key={d.to}>
                    <LocaleLink to={d.to} className="tour-tile-link" aria-label={title}>
                      <BlurUpBackground src={d.image} className="tour-tile-image" />
                      <div className="tour-tile-overlay">
                        <h3>{title}</h3>
                      </div>
                    </LocaleLink>
                  </div>
                )
              })}
            </div>
          </FadeUp>

          {FEATURED_CITIES.length > 0 && (
            <>
              <FadeUp>
                <h2 className="dest-featured-title">{t('destinations.featuredCities')}</h2>
              </FadeUp>
              <FadeUp>
                <div className="tours-grid">
                  {orderedCities.map(({ city: c, title }) => {
                    return (
                      <div className="tour-tile" key={c.slug}>
                        <LocaleLink to={cityPath(c.slug)} className="tour-tile-link" aria-label={title}>
                          <BlurUpBackground src={c.image} className="tour-tile-image" />
                          <div className="tour-tile-overlay">
                            <h3>{title}</h3>
                          </div>
                        </LocaleLink>
                      </div>
                    )
                  })}
                </div>
              </FadeUp>
            </>
          )}
        </div>
      </section>
    </>
  )
}
