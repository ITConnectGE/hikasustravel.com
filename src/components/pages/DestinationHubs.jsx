import DestinationHub from '../shared/DestinationHub'
import {
  regions,
  cities,
  sites,
  regionPath,
  cityPath,
  sitePath,
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
  const entries = [...cities]
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
  const entries = sites.map((s) => ({
    slug: s.slug,
    fallbackName: s.name,
    published: s.published,
    to: s.published ? sitePath(s) : null,
  }))
  return (
    <DestinationHub
      pageKey="destinationsPlaces"
      seoKey="destinationsPlaces"
      path="georgia/places-to-visit"
      heroImage={HERO_IMAGE}
      entries={entries}
      currentLabelKey="nav.placesToVisit"
      ctaKey="destinations.explorePlace"
    />
  )
}
