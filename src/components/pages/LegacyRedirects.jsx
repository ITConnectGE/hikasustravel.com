import { Navigate, useParams } from 'react-router-dom'

/**
 * Client-side redirects for the old URL structure (the SPA mirror of the
 * static redirect stubs emitted by scripts/prerender.js). Everything that used
 * to live under /destinations/... and at /things-to-do-in-<city> now lives
 * under /georgia/...; these keep old links and bookmarks working.
 */

// Rewrite an old /destinations/<splat> path to its /georgia equivalent.
function rewriteDestinations(splat) {
  if (!splat) return 'georgia'
  if (splat === 'cities') return 'georgia/cities'
  if (splat === 'regions') return 'georgia/regions'
  if (splat === 'places-to-visit') return 'georgia/places-to-visit'
  // City detail + city-parented sites: /destinations/cities/<rest> -> /georgia/<rest>
  if (splat.startsWith('cities/')) return `georgia/${splat.slice('cities/'.length)}`
  // Region detail + region-parented sites: keep under /georgia/regions/<rest>
  if (splat.startsWith('regions/')) return `georgia/regions/${splat.slice('regions/'.length)}`
  // Legacy flat city URL: /destinations/<city> -> /georgia/<city>
  return `georgia/${splat}`
}

// Catches /:lang/destinations and everything beneath it.
export function DestinationsRedirect() {
  const params = useParams()
  const target = rewriteDestinations(params['*'] || '')
  return <Navigate to={`/${params.lang}/${target}`} replace />
}

// Catches /:lang/things-to-do-in-<city>. The city slug is passed as a prop
// (the route path is a full literal, so it isn't available as a URL param).
export function ThingsToDoRedirect({ citySlug }) {
  const { lang } = useParams()
  return <Navigate to={`/${lang}/georgia/${citySlug}/things-to-do-in-${citySlug}`} replace />
}
