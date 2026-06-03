import { useContext, useMemo } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import BlurUpBackground from '../shared/BlurUpBackground'
import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import { I18nContext } from '../../i18n/I18nProvider'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import enPages from '../../i18n/locales/en/pages.json'

const HERO_IMAGE = '/images/files/tbilisi.jpg'
const SITE_URL = 'https://www.hikasustravel.com'

// Cities surfaced on the hub. Add more cities here over time.
const DESTINATIONS = [
  { to: '/destinations/tbilisi', image: '/images/files/tbilisi.jpg', labelKey: 'nav.tbilisi' },
]

export default function DestinationsPage() {
  const t = useT()
  const { lang } = useLang()
  const { pages } = useContext(I18nContext)
  const page = pages.destinations || enPages.destinations
  const seo = getSEO('destinations', lang)

  const jsonLd = useMemo(() => {
    const url = `${SITE_URL}/${lang}/destinations`
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${lang}` },
            { '@type': 'ListItem', position: 2, name: 'Destinations', item: url },
          ],
        },
        {
          '@type': 'ItemList',
          name: 'Destinations in Georgia',
          itemListElement: DESTINATIONS.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t(d.labelKey),
            url: `${SITE_URL}/${lang}${d.to}`,
          })),
        },
      ],
    }
  }, [lang, t])

  useSEO({ ...seo, lang, path: 'destinations', image: HERO_IMAGE, jsonLd })

  return (
    <>
      <HeroSection image={HERO_IMAGE} title={page.heroTitle} />

      <section className="home-items">
        <div className="tours-grid-container">
          <FadeUp>
            <p>{page.intro}</p>
          </FadeUp>
          <FadeUp>
            <div className="tours-grid">
              {DESTINATIONS.map((d) => {
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
        </div>
      </section>
    </>
  )
}
