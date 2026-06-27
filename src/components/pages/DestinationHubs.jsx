import DestinationHub from '../shared/DestinationHub'
import {
  regions,
  cities,
  sites,
  regionPath,
  cityPath,
  sitePath,
  siteLocation,
} from '../../data/places'

const HERO_IMAGE = '/images/files/tbilisi.jpg'

export function RegionsHubPage() {
  const entries = regions.map((r) => ({
    slug: r.slug,
    fallbackName: r.name,
    published: r.published,
    to: r.published ? regionPath(r.slug) : null,
  }))
  return (
    <DestinationHub
      pageKey="destinationsRegions"
      seoKey="destinationsRegions"
      path="georgia/regions"
      heroImage={HERO_IMAGE}
      entries={entries}
      currentLabelKey="nav.regions"
      ctaKey="destinations.exploreRegion"
    />
  )
}

export function CitiesHubPage() {
  // Cities are shown alphabetically on the hub (registry order is unaffected).
  // Entries reclassified as a place to visit (e.g. the highland resort Gomismta)
  // are excluded here and listed on the Places to Visit hub instead.
  const entries = cities
    .filter((c) => c.classifyAs !== 'place')
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      slug: c.slug,
      fallbackName: c.name,
      published: c.published,
      to: c.published ? cityPath(c.slug) : null,
    }))
  return (
    <DestinationHub
      pageKey="destinationsCities"
      seoKey="destinationsCities"
      path="georgia/cities"
      heroImage={HERO_IMAGE}
      entries={entries}
      currentLabelKey="nav.cities"
      ctaKey="destinations.exploreCity"
    />
  )
}

export function PlacesToVisitHubPage() {
  const siteEntries = sites.map((s) => ({
    slug: s.slug,
    fallbackName: s.name,
    seoKey: s.seoKey,
    published: s.published,
    to: s.published ? sitePath(s) : null,
    // Stable city/region IDs (from structured parent data) — the hub resolves
    // them to translated labels for the secondary location line.
    location: siteLocation(s),
  }))
  // Entries classified as a place but kept in the cities registry for their
  // existing /georgia/<slug> detail page (e.g. Gomismta). They link to that same
  // detail URL and carry their own structured `placeLocation`.
  const placeCityEntries = cities
    .filter((c) => c.classifyAs === 'place')
    .map((c) => ({
      slug: c.slug,
      fallbackName: c.name,
      seoKey: c.seoKey,
      published: c.published,
      to: c.published ? cityPath(c.slug) : null,
      location: c.placeLocation,
    }))
  const entries = [...siteEntries, ...placeCityEntries]
  return (
    <DestinationHub
      pageKey="destinationsPlaces"
      seoKey="destinationsPlaces"
      path="georgia/places-to-visit"
      heroImage={HERO_IMAGE}
      entries={entries}
      currentLabelKey="nav.placesToVisit"
      ctaKey="destinations.explorePlace"
      sortByName
      seoFallback
    />
  )
}
