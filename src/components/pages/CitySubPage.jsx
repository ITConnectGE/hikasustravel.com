import { useParams } from 'react-router-dom'
import { getCity, getSite } from '../../data/places'
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
  const { citySlug, sub } = useParams()
  const city = getCity(citySlug)

  if (city && city.thingsToDo && sub === `things-to-do-in-${citySlug}`) {
    return <ThingsToDoCityPage />
  }

  // A site lives at /georgia/<parent>/<slug> whether its parent is a city or a
  // region, so match on parent === citySlug for either parentType.
  const site = getSite(sub)
  if (site && site.parent === citySlug) {
    return <SitePage />
  }

  return <NotFoundPage />
}
