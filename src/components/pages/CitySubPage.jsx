import { useParams, useLocation, Navigate } from 'react-router-dom'
import {
  getCity,
  getRegion,
  getSite,
  legacyRedirects,
  thingsToDoPath,
  sitePath,
} from '../../data/places'
import ThingsToDoCityPage from './ThingsToDoCityPage'
import SitePage from './SitePage'
import NotFoundPage from './NotFoundPage'

/**
 * Dispatcher for /<country>/:citySlug/:sub. This single dynamic route is shared
 * by three page types that have the same URL shape (the first segment is a city
 * OR a region slug — the two namespaces are disjoint):
 *   - the place's things-to-do guide  (Georgia: things-to-do-in-<slug>;
 *                                      elsewhere: things-to-do)
 *   - a city-parented tourist site    (citySlug is a city,   sub === its slug)
 *   - a region-parented tourist site  (citySlug is a region, sub === its slug)
 * Anything else renders the 404 page. The chosen child re-reads the params
 * itself (ThingsToDoCityPage aliases :sub as its ttd segment; SitePage reads
 * the site slug from :sub and matches its parent against :citySlug).
 *
 * Both country route trees mount this same component, so neither the guide nor
 * the site branch may assume a country. Each one compares the URL against the
 * record's OWN canonical path (thingsToDoPath / sitePath) instead of rebuilding
 * it from a hardcoded prefix and slug convention. That single change does three
 * jobs at once: it keeps Georgia's flat `things-to-do-in-<slug>` guides working
 * exactly as before, it handles Armenia's nested `things-to-do` guides without a
 * second code path, and it makes a cross-country URL such as
 * /georgia/aragatsotn/<armenian-site> a clean 404 rather than duplicate content.
 */
export default function CitySubPage() {
  const { lang, citySlug, sub } = useParams()
  const location = useLocation()

  // The country segment of the URL actually being rendered. Taken relative to
  // the END of the path (…/<country>/<citySlug>/<sub>) so it is unaffected by
  // any router basename, and derived from the URL rather than from the matched
  // record — the record is what we are trying to validate.
  const segs = location.pathname.split('/').filter(Boolean)
  const urlBase = `/${segs[segs.length - 3] || ''}`
  const here = `${urlBase}/${citySlug}/${sub}`

  const city = getCity(citySlug)

  // Things-to-do guide for either a city or a published region (e.g. Adjara at
  // /georgia/adjara/things-to-do-in-adjara, Aragatsotn's city-level equivalent
  // at /armenia/<city>/things-to-do). City/region slugs are disjoint.
  const place = city || getRegion(citySlug)
  if (place && (city || place.published) && place.thingsToDo && thingsToDoPath(citySlug) === here) {
    return <ThingsToDoCityPage />
  }

  // A site lives at /<country>/<parent>/<slug> whether its parent is a city or
  // a region. Matching the site's canonical path covers the parent check and
  // the country check in one comparison.
  const site = getSite(sub, citySlug)
  if (site && sitePath(site) === here) {
    return <SitePage />
  }

  // Renamed-slug redirects (the SPA mirror of the static stubs emitted by
  // scripts/prerender.js). An old slug that no longer matches a site — e.g. the
  // former russia-georgia-friendship-monument -> gudauri-panorama rename — is
  // looked up in the shared registry and 301-redirected to its new URL, so old
  // in-app links and bookmarks land on the new page instead of a 404. Query
  // params are preserved.
  const fromPath = `${here.replace(/^\//, '')}`
  const redirect = legacyRedirects().find((r) => r.from === fromPath)
  if (redirect) {
    return <Navigate to={`/${lang}/${redirect.to}${location.search}`} replace />
  }

  return <NotFoundPage />
}
