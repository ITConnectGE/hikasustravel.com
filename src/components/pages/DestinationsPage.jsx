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
import {
  citiesOfCountry, cityPath, countryBase,
  regionsHubPathFor, citiesHubPathFor, placesHubPathFor,
  DEFAULT_COUNTRY,
} from '../../data/places'

const SITE_URL = 'https://www.hikasustravel.com'

/**
 * Per-country configuration for this one shared landing page.
 *
 * Everything that used to be a Georgia constant in this file lives here, keyed
 * by country, so a second country reuses the component, the card system, the
 * grid and the CSS rather than getting a page of its own. Georgia's entry is
 * verbatim what the constants held before, so /georgia renders byte-identically.
 *
 * WHICH SUB-HUB TILES APPEAR is not configured here — it is derived, from two
 * facts that are already true elsewhere: whether the country declares that hub
 * (COUNTRIES in places.js) and whether a cover image for it exists below. A hub
 * a country does not publish, or one with no approved photograph yet, is simply
 * omitted. That is what keeps an incomplete country honest instead of shipping
 * "coming soon" cards or empty tiles.
 */
const COUNTRY_LANDING = {
  georgia: {
    pageKey: 'destinations',
    seoKey: 'destinations',
    hero: '/images/files/tbilisi-old-town-narikala-mtkvari-georgia-1200.webp',
    // Georgia's long-standing "All Destinations" crumb. A country added later
    // uses its own name via nav.destinations.<country> (see `crumb` below).
    crumbKey: 'nav.allDestinations',
    itemListName: 'Destinations in Georgia',
    // Curated localized card names for the featured-city strip. Resolving
    // through the SAME chain as the Cities hub is what keeps a city named
    // identically on /georgia and /georgia/cities in every language.
    cityItemsKey: 'destinationsCities',
    pinFirstCity: 'tbilisi',
    // ⚠️ Card covers must live under /images/files/ AND have a matching file in
    // /images/files-thumb/ — BlurUpBackground derives the blur placeholder by
    // string-replacing that folder. A path outside /images/files/ silently makes
    // the placeholder resolve to the full-size file instead.
    subhubImages: {
      // Regions: broad Georgian countryside, no people, no single landmark — it
      // stands for regional variety rather than one place. (Ushguli was the
      // obvious scenic pick and was rejected twice over: its provenance is
      // unresolved — flagged as an upscaled stock download — and Ushguli is a
      // featured city on this same page, so the card would have sat beside an
      // identical tile.)
      regions: '/images/files/kakheti-vineyard.jpg',
      cities: '/images/files/tbilisi-old-town-narikala-mtkvari-georgia-1200.webp',
      // Places to visit: a recognisable landmark — the Ananuri fortress and
      // church above the Zhinvali reservoir. Distinct from the Regions cover,
      // from the hero and from all featured-city tiles on this page.
      places: '/images/files/Ananuri Fortress and Zhinvali Reservoir.jpg',
    },
  },
  armenia: {
    pageKey: 'armenia',
    seoKey: 'armenia',
    // ⏳ OWNER-SUPPLIED. Until a real Armenian photograph exists this stays null
    // and the page renders the solid `.dest-title-band` carrying its H1 — the
    // same `noHero` treatment every other Armenia page already uses. No
    // placeholder, no borrowed Georgian image, no reserved empty hero.
    hero: null,
    crumbKey: null, // -> nav.destinations.armenia
    itemListName: 'Destinations in Armenia',
    // No curated Armenia city-card block yet. The resolver falls through to the
    // localized nav label (nav.yerevan is Jerewan / Erevan / Ereván / Erywań in
    // the shipped locales), then to the registry name — never to raw English.
    cityItemsKey: null,
    cityNameNavFallback: true,
    // The capital leads, exactly as Tbilisi does on /georgia. Matched on the
    // stable slug, never the label, which is localized.
    pinFirstCity: 'yerevan',
    // ⏳ OWNER-SUPPLIED. Armenia publishes a regions hub and a cities hub, so it
    // gets those two tiles; `places` is absent because /armenia/places-to-visit
    // does not exist while Armenia has no published attraction records. Adding a
    // cover here is all a tile needs once its hub is real.
    subhubImages: { regions: null, cities: null },
  },
}

/**
 * Country landing page — /georgia and (once its imagery exists) /armenia.
 *
 * One component, one card system, one grid, one set of CSS rules, populated per
 * country from the registry. Nothing about the layout is country-specific: the
 * differences are which hubs that country publishes, which cities it has, and
 * which covers exist.
 */
export default function DestinationsPage({ country = DEFAULT_COUNTRY }) {
  const t = useT()
  const { lang } = useLang()
  const { pages, enPages } = useContext(I18nContext)
  const conf = COUNTRY_LANDING[country] || COUNTRY_LANDING[DEFAULT_COUNTRY]
  const page = pages[conf.pageKey] || enPages[conf.pageKey]
  const seo = getSEO(conf.seoKey, lang)
  const path = countryBase(country).replace(/^\//, '')

  // The sub-hubs this country actually publishes AND has a cover for. Both
  // conditions are load-bearing: the first stops a tile linking to a page that
  // does not exist, the second stops a tile rendering as an empty block (a
  // cover-less BlurUpBackground emits no background-image at all).
  const subhubs = useMemo(() => {
    const candidates = [
      { key: 'regions', to: regionsHubPathFor(country), labelKey: 'nav.regions' },
      { key: 'cities', to: citiesHubPathFor(country), labelKey: 'nav.cities' },
      { key: 'places', to: placesHubPathFor(country), labelKey: 'nav.placesToVisit' },
    ]
    return candidates
      .map((c) => ({ ...c, image: conf.subhubImages[c.key] }))
      .filter((c) => c.to && c.image)
  }, [country, conf])

  // Published city guides for this country. Entries reclassified as a place to
  // visit (e.g. Gomismta) are not cities, so they are excluded from the strip.
  // A city with no cover is excluded for the same reason a cover-less sub-hub is
  // — an image tile with no image is not a card. Inert for Georgia: all 26 of
  // its featured cities have one.
  const featuredCities = useMemo(
    () => citiesOfCountry(country).filter((c) => c.published && c.classifyAs !== 'place' && c.image),
    [country],
  )

  // The label a visitor actually reads. This resolves through exactly the same
  // chain as the Cities hub (DestinationHub): the curated localized card name,
  // then the English one, then — for a country with no curated block yet — the
  // localized nav label, then the registry's display name. Reading the ui.json
  // `nav.<slug>` keys as the PRIMARY source, as this used to, left the strip
  // showing English names ("Kutaisi", "Mtskheta") where the hub had proper
  // localizations ("Kutaissi", "Mzcheta"), which is why they sit below the
  // curated tiers and are opt-in per country.
  const cityItems = (conf.cityItemsKey && pages[conf.cityItemsKey]?.items) || {}
  const enCityItems = (conf.cityItemsKey && enPages[conf.cityItemsKey]?.items) || {}
  const cityTitle = (c) => {
    const navLabel = conf.cityNameNavFallback ? t(`nav.${c.slug}`) : null
    return cityItems[c.slug]?.name || enCityItems[c.slug]?.name
      || (navLabel && navLabel !== `nav.${c.slug}` ? navLabel : null)
      || c.name
  }

  // Capital first (matched on its stable slug, not its label — it renders as
  // Tiflis/Tbilissi in some locales), then the rest A–Z by that visible label.
  // Sorted here rather than on a module-level constant because the label is
  // locale-dependent, so the order legitimately differs per language (Czech, for
  // instance, collates "Ch" after "H").
  const titled = featuredCities.map((c) => ({ city: c, title: cityTitle(c) }))
  const orderedCities = [
    ...titled.filter((x) => x.city.slug === conf.pinFirstCity),
    ...titled
      .filter((x) => x.city.slug !== conf.pinFirstCity)
      .sort((a, b) => a.title.localeCompare(b.title, lang, { sensitivity: 'base' })),
  ]

  const crumbName = conf.crumbKey ? t(conf.crumbKey) : t(`nav.destinations.${country}`)
  const trail = [
    { name: t('breadcrumb.home'), to: '/' },
    { name: crumbName },
  ]

  const jsonLd = useMemo(() => {
    const url = `${SITE_URL}/${lang}/${path}`
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('breadcrumb.home'), item: `${SITE_URL}/${lang}` },
            { '@type': 'ListItem', position: 2, name: crumbName, item: url },
          ],
        },
        {
          '@type': 'ItemList',
          name: conf.itemListName,
          itemListElement: subhubs.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t(d.labelKey),
            url: `${SITE_URL}/${lang}${d.to}`,
          })),
        },
      ],
    }
  }, [lang, t, path, crumbName, conf.itemListName, subhubs])

  useSEO({ ...seo, lang, path, ...(conf.hero ? { image: conf.hero } : {}), jsonLd })

  return (
    <>
      {conf.hero ? (
        <HeroSection className="hero--compact" image={conf.hero} title={page.heroTitle} />
      ) : (
        /* No photo hero until an approved image exists — the same solid
           `.dest-title-band` CityPage/SitePage/RegionPage use for `noHero`. It
           carries the page's single H1 and keeps the transparent header's cream
           logo/nav legible. No image, no placeholder, no reserved 100dvh. */
        <section className="dest-title-band">
          <h1>{page.heroTitle}</h1>
        </section>
      )}

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
          {subhubs.length > 0 && (
            <FadeUp>
              {/* The sub-hubs sit in a grid that is four across at desktop
                  widths, so a shorter row would ship with permanently blank
                  columns. data-count lets the stylesheet close it. */}
              <div className="tours-grid" data-count={subhubs.length}>
                {subhubs.map((d) => {
                  const title = t(d.labelKey)
                  return (
                    <div className="tour-tile" key={d.to}>
                      <LocaleLink to={d.to} className="tour-tile-link" aria-label={title}>
                        <BlurUpBackground src={d.image} className="tour-tile-image" />
                        <div className="tour-tile-overlay">
                          {/* These tiles are the page's first section and sit
                              directly under its <h1>, so an <h3> here skipped a
                              level. The featured-city tiles below keep <h3>: they
                              follow the "Featured city guides" <h2>, which is the
                              section they belong to. Same on the homepage, where
                              every tile row has its own <h2> above it. */}
                          <h2>{title}</h2>
                        </div>
                      </LocaleLink>
                    </div>
                  )
                })}
              </div>
            </FadeUp>
          )}

          {orderedCities.length > 0 && (
            <>
              <FadeUp>
                <h2 className="dest-featured-title">{t('destinations.featuredCities')}</h2>
              </FadeUp>
              <FadeUp>
                {/* Same short-row treatment as the sub-hub grid above, but only
                    where it applies: the stylesheet defines data-count 1-3 and
                    leaves four or more alone, so the attribute is emitted only
                    for a short row. Georgia's 26-tile strip is untouched. */}
                <div
                  className="tours-grid"
                  {...(orderedCities.length < 4 ? { 'data-count': orderedCities.length } : {})}
                >
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
