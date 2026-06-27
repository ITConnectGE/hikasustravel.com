import { useContext, useMemo } from 'react'
import HeroSection from './HeroSection'
import FadeUp from './FadeUp'
import Breadcrumbs from './Breadcrumbs'
import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import { I18nContext } from '../../i18n/I18nContext'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import enPages from '../../i18n/locales/en/pages.json'

const SITE_URL = 'https://www.hikasustravel.com'

// Derive a clean, translated card title from a site's per-language SEO title,
// e.g. "Festung Ujarma: königliche Hochburg …" -> "Festung Ujarma" and
// "Forteresse d'Ujarma : bastion …" -> "Forteresse d'Ujarma". Cuts at the first
// tagline / locator separator so marketing and ", City"/", Country" suffixes drop off.
const seoCardName = (title) => (title || '').split(/[|:]/)[0].split(',')[0].trim()

/**
 * Generic sub-hub page (Regions / Cities / Places to Visit).
 *
 * Registry order + published flags decide what is shown and what links; the
 * localized name + one-line description for each entry come from pages.json
 * (so translators only touch JSON). Entries without a published detail page
 * render as plain text with a "guide coming soon" note — never a broken link.
 */
export default function DestinationHub({
  pageKey,
  seoKey,
  path,
  heroImage,
  entries,
  currentLabelKey,
  ctaKey,
  sortByName = false,
  seoFallback = false,
}) {
  const t = useT()
  const { lang } = useLang()
  const { pages } = useContext(I18nContext)
  const page = pages[pageKey] || enPages[pageKey]
  const seo = getSEO(seoKey, lang)

  const resolved = useMemo(
    () => {
      const items = page.items || {}
      // English card name/description fallback per entry, so a summary still
      // shows in every language until that card's text is translated (mirrors
      // how the detail pages fall back to English).
      const enItems = (enPages[pageKey] && enPages[pageKey].items) || {}
      const list = entries.map((e) => {
        const localized = items[e.slug] || {}
        const enLocalized = enItems[e.slug] || {}
        // Fall back to the per-language SEO entry (authored for every site) so
        // each card shows a translated one-line summary even without a curated
        // override, and new sites are covered automatically. The title fallback
        // is non-English only: English keeps its exact site name, while the SEO
        // *description* now backs every language so no card is left blank.
        const seoCard = (seoFallback && e.seoKey) ? getSEO(e.seoKey, lang) : null
        return {
          ...e,
          name:
            localized.name || enLocalized.name ||
            (seoCard && lang !== 'en' && seoCardName(seoCard.title)) || e.fallbackName,
          description:
            localized.description || enLocalized.description ||
            (seoCard && seoCard.description) || '',
        }
      })
      // Places to Visit lists alphabetically by the visible (translated) title —
      // locale-aware and case-insensitive — so every published site, including
      // newly added ones, appears in its correct A–Z position automatically
      // rather than in registry order. Sorting never drops an entry.
      if (sortByName) {
        list.sort((a, b) => a.name.localeCompare(b.name, lang, { sensitivity: 'base' }))
      }
      return list
    },
    [entries, page, pageKey, sortByName, seoFallback, lang],
  )

  const trail = [
    { name: t('breadcrumb.home'), to: '/' },
    { name: t('nav.allDestinations'), to: '/georgia' },
    { name: t(currentLabelKey) },
  ]

  const jsonLd = useMemo(() => {
    const url = `${SITE_URL}/${lang}/${path}`
    return {
      '@context': 'https://schema.org',
      '@graph': [
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
          name: seo.title,
          itemListElement: resolved
            .filter((e) => e.published && e.to)
            .map((e, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: e.name,
              url: `${SITE_URL}/${lang}${e.to}`,
            })),
        },
      ],
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, path, resolved, seo.title])

  useSEO({ ...seo, lang, path, image: heroImage, jsonLd })

  // Secondary "City, Region" / "City, Georgia" / "Region, Georgia" line for
  // Places to Visit cards. Stable city/region IDs (set on each entry from the
  // site's structured parent) map to the already-translated city and region
  // names, so the facts stay identical across languages while the labels are
  // localized. Cards without a `location` (Regions / Cities hubs) render none.
  const cityItems = (pages.destinationsCities && pages.destinationsCities.items) || {}
  const regionItems = (pages.destinationsRegions && pages.destinationsRegions.items) || {}
  const enCityItems = (enPages.destinationsCities && enPages.destinationsCities.items) || {}
  const enRegionItems = (enPages.destinationsRegions && enPages.destinationsRegions.items) || {}
  const country = t('destinations.country')
  const locationLabel = (loc) => {
    if (!loc) return ''
    const cityName = loc.cityId && ((cityItems[loc.cityId] && cityItems[loc.cityId].name) || (enCityItems[loc.cityId] && enCityItems[loc.cityId].name))
    const regionName = loc.regionId && ((regionItems[loc.regionId] && regionItems[loc.regionId].name) || (enRegionItems[loc.regionId] && enRegionItems[loc.regionId].name))
    if (cityName) return regionName ? `${cityName}, ${regionName}` : `${cityName}, ${country}`
    if (regionName) return `${regionName}, ${country}`
    return ''
  }

  return (
    <>
      <HeroSection image={heroImage} title={page.heroTitle} />
      <section className="home-items">
        <div className="tours-grid-container">
          <FadeUp>
            <Breadcrumbs trail={trail} />
          </FadeUp>
          <FadeUp>
            <p>{page.intro}</p>
          </FadeUp>
          <FadeUp>
            <ul className="dest-hub-grid">
              {resolved.map((e) => (
                <li className="dest-hub-card" key={e.slug}>
                  {e.published && e.to ? (
                    <LocaleLink to={e.to} className="dest-hub-card__link">
                      <h3>{e.name}</h3>
                      {locationLabel(e.location) && (
                        <span className="dest-hub-card__loc">{locationLabel(e.location)}</span>
                      )}
                      {e.description && <p>{e.description}</p>}
                      {ctaKey && <span className="dest-hub-card__cta">{t(ctaKey)}</span>}
                    </LocaleLink>
                  ) : (
                    <div className="dest-hub-card__pending">
                      <h3>{e.name}</h3>
                      {locationLabel(e.location) && (
                        <span className="dest-hub-card__loc">{locationLabel(e.location)}</span>
                      )}
                      {e.description && <p>{e.description}</p>}
                      <span className="dest-hub-card__soon">{t('destinations.comingSoon')}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
