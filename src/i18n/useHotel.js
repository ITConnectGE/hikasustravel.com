import { useCallback, useContext } from 'react'
import { I18nContext } from './I18nContext'
import hotelData, { resolveHotelKey } from '../data/hotelData'

// A translated list is only trusted when it lines up 1:1 with the English one
// it overlays. If a hotel gains an amenity or a photo before the translations
// catch up, that hotel falls back to English instead of rendering a mismatched
// label against the wrong icon or the wrong image.
function aligned(translated, base) {
  return Array.isArray(translated) && Array.isArray(base) && translated.length === base.length
}

// Returns getHotel(name) -> the hotel record to show for a name as written in
// the tour data, with its copy in the active language, or undefined when we
// hold no record for that name. `name` is carried through untouched: hotel
// names are proper nouns and are never translated.
export default function useHotel() {
  const { hotelTranslations } = useContext(I18nContext)

  return useCallback((name) => {
    const key = resolveHotelKey(name)
    if (!key) return undefined

    const base = hotelData[key]
    const tr = hotelTranslations?.[key]
    if (!tr) return { ...base, name }

    return {
      ...base,
      name,
      description: tr.description || base.description,
      amenities: aligned(tr.amenities, base.amenities)
        ? base.amenities.map((a, i) => ({ ...a, label: tr.amenities[i] }))
        : base.amenities,
      locationHighlights: aligned(tr.locationHighlights, base.locationHighlights)
        ? tr.locationHighlights
        : base.locationHighlights,
      images: aligned(tr.imageAlts, base.images)
        ? base.images.map((img, i) => ({ ...img, alt: tr.imageAlts[i] }))
        : base.images,
    }
  }, [hotelTranslations])
}
