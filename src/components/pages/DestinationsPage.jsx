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

const HERO_IMAGE = '/images/files/tbilisi.jpg'
const SITE_URL = 'https://www.hikasustravel.com'

// The four ways into the Destinations section. Wineries are intentionally
// omitted until winery pages are published.
const SUBHUBS = [
  { to: '/georgia/regions', image: '/images/files/georgia-home.jpg', labelKey: 'nav.regions' },
  { to: '/georgia/cities', image: '/images/files/tbilisi.jpg', labelKey: 'nav.cities' },
  { to: '/georgia/places-to-visit', image: '/images/files/georgia-home.jpg', labelKey: 'nav.placesToVisit' },
]

// Existing important destination pages — the published city guides.
const FEATURED_CITIES = cities.filter((c) => c.published)

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
            <p>{page.intro}</p>
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
                  {FEATURED_CITIES.map((c) => {
                    // Use the localized nav label when one exists, otherwise the
                    // registry's real display name — never the raw key.
                    const navKey = `nav.${c.slug}`
                    const navLabel = t(navKey)
                    const title = navLabel === navKey ? c.name : navLabel
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
