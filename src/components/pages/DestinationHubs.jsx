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
      path="destinations/regions"
      heroImage={HERO_IMAGE}
      entries={entries}
      currentLabelKey="nav.regions"
    />
  )
}

export function CitiesHubPage() {
  const entries = cities.map((c) => ({
    slug: c.slug,
    fallbackName: c.name,
    published: c.published,
    to: c.published ? cityPath(c.slug) : null,
  }))
  return (
    <DestinationHub
      pageKey="destinationsCities"
      seoKey="destinationsCities"
      path="destinations/cities"
      heroImage={HERO_IMAGE}
      entries={entries}
      currentLabelKey="nav.cities"
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
      path="destinations/places-to-visit"
      heroImage={HERO_IMAGE}
      entries={entries}
      currentLabelKey="nav.placesToVisit"
    />
  )
}
