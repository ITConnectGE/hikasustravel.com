import { useContext, useMemo } from 'react'
import HeroSection from './HeroSection'
import FadeUp from './FadeUp'
import Breadcrumbs from './Breadcrumbs'
import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import { I18nContext } from '../../i18n/I18nProvider'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import enPages from '../../i18n/locales/en/pages.json'

const SITE_URL = 'https://www.hikasustravel.com'

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
}) {
  const t = useT()
  const { lang } = useLang()
  const { pages } = useContext(I18nContext)
  const page = pages[pageKey] || enPages[pageKey]
  const seo = getSEO(seoKey, lang)
  const items = page.items || {}

  const resolved = useMemo(
    () =>
      entries.map((e) => {
        const localized = items[e.slug] || {}
        return {
          ...e,
          name: localized.name || e.fallbackName,
          description: localized.description || '',
        }
      }),
    [entries, items],
  )

  const trail = [
    { name: t('breadcrumb.home'), to: '/' },
    { name: t('nav.allDestinations'), to: '/destinations' },
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
                      {e.description && <p>{e.description}</p>}
                    </LocaleLink>
                  ) : (
                    <div className="dest-hub-card__pending">
                      <h3>{e.name}</h3>
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
