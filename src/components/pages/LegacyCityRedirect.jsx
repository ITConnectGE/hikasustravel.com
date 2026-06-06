import { Navigate, useParams } from 'react-router-dom'
import { getCity, cityPath } from '../../data/places'
import NotFoundPage from './NotFoundPage'

/**
 * Redirects the old flat city URLs (/:lang/destinations/<city>) to their new
 * nested home (/:lang/destinations/cities/<city>). Only known published cities
 * redirect; anything else falls through to the 404 page. Static redirect stubs
 * for crawlers are emitted at build time by scripts/prerender.js.
 */
export default function LegacyCityRedirect() {
  const { lang, legacyCitySlug } = useParams()
  const city = getCity(legacyCitySlug)
  if (city && city.published) {
    return <Navigate to={`/${lang}${cityPath(city.slug)}`} replace />
  }
  return <NotFoundPage />
}
