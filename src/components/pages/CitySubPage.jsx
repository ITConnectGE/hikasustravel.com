import { useParams, useLocation, Navigate } from 'react-router-dom'
import { getCity, getRegion, getSite, legacyRedirects } from '../../data/places'
import ThingsToDoCityPage from './ThingsToDoCityPage'
import SitePage from './SitePage'
import NotFoundPage from './NotFoundPage'

/**
 * Dispatcher for /georgia/:citySlug/:sub. This single dynamic route is shared by
 * three page types that have the same URL shape (the first segment is a city OR
 * a region slug — the two namespaces are disjoint):
 *   - the city's things-to-do guide  (sub === things-to-do-in-<citySlug>)
 *   - a city-parented tourist site   (citySlug is a city,   sub === its slug)
 *   - a region-parented tourist site (citySlug is a region, sub === its slug)
 * Anything else renders the 404 page. The chosen child re-reads the params
 * itself (ThingsToDoCityPage aliases :sub as its ttd segment; SitePage reads
 * the site slug from :sub and matches its parent against :citySlug).
 */
export default function CitySubPage() {
  const { lang, citySlug, sub } = useParams()
  const location = useLocation()
  const city = getCity(citySlug)

  // Things-to-do guide for either a city or a published region (e.g. Adjara at
  // /georgia/adjara/things-to-do-in-adjara). City/region slugs are disjoint.
  const place = city || getRegion(citySlug)
  if (place && (city || place.published) && place.thingsToDo && sub === `things-to-do-in-${citySlug}`) {
    return <ThingsToDoCityPage />
  }

  // A site lives at /georgia/<parent>/<slug> whether its parent is a city or a
  // region, so match on parent === citySlug for either parentType.
  const site = getSite(sub)
  if (site && site.parent === citySlug) {
    return <SitePage />
  }

  // Renamed-slug redirects (the SPA mirror of the static stubs emitted by
  // scripts/prerender.js). An old slug that no longer matches a site — e.g. the
  // former russia-georgia-friendship-monument -> gudauri-panorama rename — is
  // looked up in the shared registry and 301-redirected to its new URL, so old
  // in-app links and bookmarks land on the new page instead of a 404. Query
  // params are preserved.
  const fromPath = `georgia/${citySlug}/${sub}`
  const redirect = legacyRedirects().find((r) => r.from === fromPath)
  if (redirect) {
    return <Navigate to={`/${lang}/${redirect.to}${location.search}`} replace />
  }

  return <NotFoundPage />
}
