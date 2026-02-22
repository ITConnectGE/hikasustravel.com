import { useContext, useEffect, useState, useMemo } from 'react'
import ToursHero from '../shared/ToursHero'
import TourCard from '../shared/TourCard'
import { tours } from '../../data/tours'
import useT from '../../i18n/useT'
import { I18nContext } from '../../i18n/I18nProvider'

export default function PrivateToursPage() {
  const privateTours = tours.filter((t) => t.type === 'private')
  const t = useT()
  const { tourTranslations, loadTourTranslations } = useContext(I18nContext)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')

  useEffect(() => {
    if (!tourTranslations) loadTourTranslations()
  }, [tourTranslations, loadTourTranslations])

  const filtered = useMemo(() => {
    let list = privateTours

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
  }, [privateTours, tourTranslations, search, sort])

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
