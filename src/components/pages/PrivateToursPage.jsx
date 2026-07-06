import { useContext, useEffect, useState, useMemo } from 'react'
import ToursHero from '../shared/ToursHero'
import TourCard from '../shared/TourCard'
import { tours } from '../../data/tours'
import { PRIVATE_TOUR_CATEGORIES, CATEGORY_IDS, CATEGORY_LABEL_KEYS } from '../../data/tourCategories'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import { I18nContext } from '../../i18n/I18nContext'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

// Slugs of the tours that start from Kutaisi (module-level constant so it stays
// referentially stable across renders and out of the useMemo dependency list).
const kutaisiSlugs = [
  '7-day-georgia-cultural-tour-kutaisi-to-tbilisi',
  '9-day-georgia-private-tour-kutaisi-to-tbilisi',
  'georgias-wonders-11-day-grand-tour-from-kutaisi-to-kazbegi-and-batumi',
  'grand-georgia-adventure-13-day-cultural-and-scenic-journey',
]

export default function PrivateToursPage() {
  const privateTours = tours.filter((t) => t.type === 'private')
  const t = useT()
  const { lang } = useLang()
  const { tourTranslations, loadTourTranslations } = useContext(I18nContext)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [origin, setOrigin] = useState('')
  const [category, setCategory] = useState('all')
  const seo = getSEO('privateTours', lang)

  // Visible category labels are looked up per locale; filtering still uses the
  // stable ids above. "all" is the default ("All Categories" = no restriction).
  const categoryOptions = CATEGORY_IDS.map((id) => ({ value: id, label: t(CATEGORY_LABEL_KEYS[id]) }))
  useSEO({ ...seo, lang, path: 'private-tours', image: '/images/files/georgia-tour-01.jpg' })

  useEffect(() => {
    if (!tourTranslations) loadTourTranslations()
  }, [tourTranslations, loadTourTranslations])

  const filtered = useMemo(() => {
    let list = privateTours

    if (origin === 'kutaisi') list = list.filter((tour) => kutaisiSlugs.includes(tour.slug))
    else if (origin === 'tbilisi') list = list.filter((tour) => !kutaisiSlugs.includes(tour.slug))

    if (category && category !== 'all') {
      list = list.filter((tour) => (PRIVATE_TOUR_CATEGORIES[tour.slug] || []).includes(category))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((tour) => {
        const tt = tourTranslations?.[tour.slug]
        const title = (tt?.title || tour.title).toLowerCase()
        const desc = (tt?.listingDescription || tt?.description || tour.listingDescription || tour.description || '').toLowerCase()
        const dests = (tour.map?.markers?.map((m) => m.title) || []).join(' ').toLowerCase()
        return title.includes(q) || desc.includes(q) || dests.includes(q)
      })
    }

    if (sort === 'days-asc') list = [...list].sort((a, b) => a.days - b.days)
    else if (sort === 'days-desc') list = [...list].sort((a, b) => b.days - a.days)
    else if (sort === 'name') list = [...list].sort((a, b) => {
      const aName = tourTranslations?.[a.slug]?.title || a.title
      const bName = tourTranslations?.[b.slug]?.title || b.title
      return aName.localeCompare(bName)
    })

    return list
  }, [privateTours, tourTranslations, search, sort, origin, category])

  return (
    <>
      <ToursHero
        image="/images/files/georgia-tour-01.jpg"
        title={t('tour.privateTours')}
        subtitle={t('tour.privateToursSubtitle')}
        tourCount={filtered.length}
        searchValue={search}
        onSearchChange={setSearch}
        sortValue={sort}
        onSortChange={setSort}
        originValue={origin}
        onOriginChange={setOrigin}
        categoryValue={category}
        onCategoryChange={setCategory}
        categoryOptions={categoryOptions}
      />

      <section className="tour-listing" aria-label={t('tour.privateTours')}>
        {filtered.length > 0 ? (
          filtered.map((tour, index) => (
            <TourCard
              key={tour.slug}
              tour={tour}
              translation={tourTranslations?.[tour.slug]}
              index={index}
              basePath="/private-tours"
            />
          ))
        ) : (
          <div className="tour-listing__empty">
            <p>{t('tour.noResults')}</p>
          </div>
        )}
      </section>
    </>
  )
}
