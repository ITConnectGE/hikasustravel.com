import { useParams } from 'react-router-dom'
import { getCity, getSite } from '../../data/places'
import ThingsToDoCityPage from './ThingsToDoCityPage'
import SitePage from './SitePage'
import NotFoundPage from './NotFoundPage'

/**
 * Dispatcher for /georgia/:citySlug/:sub. This single dynamic route is shared by
 * two page types that have the same URL shape:
 *   - the city's things-to-do guide  (sub === things-to-do-in-<citySlug>)
 *   - a city-parented tourist site   (sub === a published site's slug)
 * Anything else renders the 404 page. The chosen child re-reads the params
 * itself (ThingsToDoCityPage aliases :sub as its ttd segment; SitePage reads
 * the site slug from :sub).
 */
export default function CitySubPage() {
  const { citySlug, sub } = useParams()
  const city = getCity(citySlug)

  if (city && city.thingsToDo && sub === `things-to-do-in-${citySlug}`) {
    return <ThingsToDoCityPage />
  }

  const site = getSite(sub)
  if (site && site.parentType === 'city' && site.parent === citySlug) {
    return <SitePage />
  }

  return <NotFoundPage />
}
