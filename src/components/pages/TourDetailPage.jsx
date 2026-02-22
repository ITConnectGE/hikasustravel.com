import { useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import TourDetailHero from '../shared/TourDetailHero'
import TourSectionNav from '../shared/TourSectionNav'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import PricingGrid, { getStartingPrice } from '../shared/PricingGrid'
import IncludedNotIncluded from '../shared/IncludedNotIncluded'
import TourInquiryForm from '../shared/TourInquiryForm'
import Gallery from '../shared/Gallery'
import Testimonials from '../shared/Testimonials'
import MapboxMap from '../shared/MapboxMap'
import { tours } from '../../data/tours'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import { I18nContext } from '../../i18n/I18nProvider'
import useSEO from '../../hooks/useSEO'

export default function TourDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const { lang } = useLang()
  const { tourTranslations, loadTourTranslations } = useContext(I18nContext)

  useEffect(() => {
    if (!tourTranslations) loadTourTranslations()
  }, [tourTranslations, loadTourTranslations])

  const tour = tours.find((t) => t.slug === slug)
  const tt = tourTranslations?.[slug]

  const tourSeo = useMemo(() => {
    if (!tour) return {}
    const title = `${tt?.title || tour.title} | Hikasus Travel`
    const description = (tt?.description || tour.description || '').slice(0, 160)
    const prefix = tour.type === 'group' ? 'group-tours' : 'private-tours'
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: tt?.title || tour.title,
      description: tt?.description || tour.description,
      touristType: tour.type === 'group' ? 'Group' : 'Private',
      provider: {
        '@type': 'TravelAgency',
        name: 'Hikasus Travel',
        url: 'https://www.hikasustravel.com',
      },
      ...(tour.gallery?.length > 0
        ? { image: tour.gallery.map(img => `https://www.hikasustravel.com${img}`) }
        : tour.heroImage && { image: `https://www.hikasustravel.com${tour.heroImage}` }),
      ...(tour.days && { itinerary: {
        '@type': 'ItemList',
        numberOfItems: tour.days,
        itemListElement: (tour.itinerary || []).map((day, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: day.title,
        })),
      }}),
    }
    return { title, description, path: `${prefix}/${slug}`, image: tour.heroImage, jsonLd }
  }, [tour, tt, slug])
  useSEO({ ...tourSeo, lang })

  const navSections = useMemo(() => {
    if (!tour) return []
    const sections = [
      { id: 'overview', labelKey: 'tour.overview' },
    ]
    const tt = tourTranslations?.[tour.slug]
    const itinerary = tt?.itinerary || tour.itinerary
    if (itinerary?.length > 0) sections.push({ id: 'itinerary', labelKey: 'tour.itinerary' })
    if (tour.accommodations || tour.pricing) sections.push({ id: 'pricing', labelKey: 'tour.pricing' })
    if (tour.gallery?.length > 0) sections.push({ id: 'gallery', labelKey: 'tour.gallery' })
    sections.push({ id: 'book', labelKey: 'tour.book' })
    if (tour.map?.center) sections.push({ id: 'tour-map', labelKey: 'tour.map' })
    return sections
  }, [tour, tourTranslations])

  if (!tour) {
    return (
      <section className="td-not-found">
        <div>
          <h2>{t('tour.notFound')}</h2>
          <p>{t('tour.notFoundText')}</p>
        </div>
      </section>
    )
  }

  const isGroup = tour.type === 'group'
  const itineraryItems = tt?.itinerary || tour.itinerary
  const includedItems = tt?.included || tour.included
  const notIncludedItems = tt?.notIncluded || tour.notIncluded

  // Extract starting price
  const startingPrice = isGroup
    ? (tour.pricePerPerson ? parseFloat(tour.pricePerPerson.replace(/[^0-9.]/g, '')) : null)
    : getStartingPrice(tour.pricing)

  // First 4 included items for overview highlights
  const highlightItems = includedItems ? includedItems.slice(0, 4) : []

  return (
    <>
      <TourDetailHero
        tour={tour}
        translatedTitle={tt?.title}
        isGroup={isGroup}
        startingPrice={startingPrice}
      />

      <TourSectionNav sections={navSections} />

      <div className="td-layout">
        <main className="td-main">
          {/* Overview */}
          <section id="overview" className="td-section">
            <FadeUp>
              <h2 className="td-section__title">{t('tour.overview')}</h2>
              <p className="td-overview__text">{tt?.description || tour.description}</p>

              {highlightItems.length > 0 && (
                <div className="td-overview__highlights">
                  {highlightItems.map((item, i) => (
                    <div key={i} className="td-overview__highlight">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{item.replace(/;$/, '')}</span>
                    </div>
                  ))}
                </div>
              )}
            </FadeUp>
          </section>

          {/* Why Travel With Us */}
          <section className="td-section td-benefits">
            <FadeUp>
              <h2 className="td-section__title">{t('benefits.title')}</h2>
              <div className="td-benefits__grid">
                <div className="td-benefits__card">
                  <div className="td-benefits__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v4M12 19v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M1 12h4M19 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="4"/></svg>
                  </div>
                  <h3 className="td-benefits__card-title">{t('benefits.prices')}</h3>
                  <p className="td-benefits__card-text">{t('benefits.pricesText')}</p>
                </div>
                <div className="td-benefits__card">
                  <div className="td-benefits__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <h3 className="td-benefits__card-title">{t('benefits.planned')}</h3>
                  <p className="td-benefits__card-text">{t('benefits.plannedText')}</p>
                </div>
                <div className="td-benefits__card">
                  <div className="td-benefits__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h3 className="td-benefits__card-title">{t('benefits.relax')}</h3>
                  <p className="td-benefits__card-text">{t('benefits.relaxText')}</p>
                </div>
                <div className="td-benefits__card">
                  <div className="td-benefits__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <h3 className="td-benefits__card-title">{t('benefits.local')}</h3>
                  <p className="td-benefits__card-text">{t('benefits.localText')}</p>
                </div>
              </div>
            </FadeUp>
          </section>

          {/* Group Tour Summary */}
          {isGroup && (tt?.groupSummary || tour.groupSummary) && (
            <section className="td-section">
              <FadeUp>
                <div className="tour-group-summary">
                  {(tt?.groupSummary || tour.groupSummary).map((item, i) => (
                    <div key={i} className="summary-item">
                      <strong>{item.label}</strong>
                      {item.type === 'dates' ? (
                        <div className="dates-list">
                          {item.values.map((v, j) => (
                            <div key={j} className="date-range">{v}</div>
                          ))}
                        </div>
                      ) : (
                        <div>{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>
              </FadeUp>
            </section>
          )}

          {/* Included / Not Included */}
          {(includedItems || notIncludedItems) && (
            <section className="td-section">
              <FadeUp>
                <IncludedNotIncluded
                  included={includedItems}
                  notIncluded={notIncludedItems}
                />
              </FadeUp>
            </section>
          )}

          {/* Itinerary */}
          {itineraryItems && itineraryItems.length > 0 && (
            <section id="itinerary" className="td-section">
              <FadeUp>
                <Accordion items={itineraryItems} itinerary />
              </FadeUp>
            </section>
          )}

          {/* Pricing */}
          {(tour.accommodations || tour.pricing) && (
            <PricingGrid
              accommodations={tour.accommodations}
              pricing={tour.pricing}
            />
          )}

          {/* Gallery */}
          {tour.gallery && tour.gallery.length > 0 && (
            <section id="gallery" className="td-section">
              <FadeUp>
                <h2 className="td-section__title">{t('tour.gallery')}</h2>
                <p className="td-section__subtitle">{t('tour.gallerySubtitle')}</p>
              </FadeUp>
              <Gallery images={tour.gallery} />
            </section>
          )}

          {/* Booking Form */}
          <section id="book" className="td-section td-book-inline">
            <FadeUp>
              <h2 className="td-section__title">{t('tour.bookThisTour')}</h2>
              <TourInquiryForm tourTitle={tour.tourFormTitle || tour.title} isGroupTour={isGroup} />
            </FadeUp>
          </section>
        </main>
      </div>

      {/* Map */}
      {tour.map && tour.map.center && (
        <section id="tour-map" className="td-map-section">
          <div className="td-map-card">
            <h2 className="td-section__title">{t('tour.routeMap')}</h2>
            <MapboxMap
              id="tour-map-canvas"
              center={tour.map.center}
              zoom={tour.map.zoom || 8}
              markers={tour.map.markers || []}
              routeCoordinates={tour.map.routeCoordinates || []}
              className="td-map"
            />
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="td-testimonials-section">
        <FadeUp>
          <h2 className="td-section__title">{t('testimonials.title')}</h2>
          <Testimonials />
        </FadeUp>
      </section>
    </>
  )
}
