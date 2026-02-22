import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import PricingGrid from '../shared/PricingGrid'
import IncludedNotIncluded from '../shared/IncludedNotIncluded'
import TourInquiryForm from '../shared/TourInquiryForm'
import Gallery from '../shared/Gallery'
import MapboxMap from '../shared/MapboxMap'
import { tours } from '../../data/tours'
import useT from '../../i18n/useT'
import { I18nContext } from '../../i18n/I18nProvider'

function Submenu({ t }) {
  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="submenu">
      <nav>
        <ul>
          <li><a href="#overview" onClick={(e) => handleClick(e, 'overview')}>{t('tour.overview')}</a></li>
          <li><a href="#itinerary" onClick={(e) => handleClick(e, 'itinerary')}>{t('tour.itinerary')}</a></li>
          <li><a href="#pricing" onClick={(e) => handleClick(e, 'pricing')}>{t('tour.pricing')}</a></li>
          <li><a href="#gallery" onClick={(e) => handleClick(e, 'gallery')}>{t('tour.gallery')}</a></li>
          <li><a href="#book" onClick={(e) => handleClick(e, 'book')}>{t('tour.book')}</a></li>
          <li><a href="#tour-map" onClick={(e) => handleClick(e, 'tour-map')}>{t('tour.map')}</a></li>
        </ul>
      </nav>
    </div>
  )
}

export default function TourDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const { tourTranslations, loadTourTranslations } = useContext(I18nContext)

  useEffect(() => {
    if (!tourTranslations) loadTourTranslations()
  }, [tourTranslations, loadTourTranslations])

  const tour = tours.find((t) => t.slug === slug)

  if (!tour) {
    return (
      <section className="page-items" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <h2>{t('tour.notFound')}</h2>
          <p>{t('tour.notFoundText')}</p>
        </div>
      </section>
    )
  }

  const tt = tourTranslations?.[tour.slug]
  const isGroup = tour.type === 'group'
  const itineraryItems = tt?.itinerary || tour.itinerary
  const includedItems = tt?.included || tour.included
  const notIncludedItems = tt?.notIncluded || tour.notIncluded

  return (
    <>
      <HeroSection image={tour.heroImage} title={tt?.title || tour.title} />
      <Submenu t={t} />

      {/* Overview */}
      <section id="overview" className="page-items">
        <FadeUp>
          <h2 style={{ textAlign: 'center' }}>{t('tour.overview')}</h2>
          <p>{tt?.description || tour.description}</p>
        </FadeUp>
      </section>

      {/* Group Tour Summary */}
      {isGroup && (tt?.groupSummary || tour.groupSummary) && (
        <section className="page-items">
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

      {/* Itinerary */}
      {itineraryItems && itineraryItems.length > 0 && (
        <section id="itinerary" className="page-items">
          <Accordion items={itineraryItems} />
        </section>
      )}

      {/* Pricing */}
      {(tour.accommodations || tour.pricing) && (
        <PricingGrid
          accommodations={tour.accommodations}
          pricing={tour.pricing}
        />
      )}

      {/* Included / Not Included */}
      {(includedItems || notIncludedItems) && (
        <section className="page-items">
          <FadeUp>
            <IncludedNotIncluded
              included={includedItems}
              notIncluded={notIncludedItems}
            />
          </FadeUp>
        </section>
      )}

      {/* Booking Form */}
      <section id="book" className="page-items" style={{ backgroundColor: 'var(--color-h2)', color: 'var(--color-bg)' }}>
        <FadeUp>
          <h2 style={{ textAlign: 'center', color: 'var(--color-h3)' }}>{t('tour.bookThisTour')}</h2>
          <TourInquiryForm tourTitle={tour.tourFormTitle || tour.title} isGroupTour={isGroup} />
        </FadeUp>
      </section>

      {/* Gallery */}
      {tour.gallery && tour.gallery.length > 0 && (
        <Gallery images={tour.gallery} />
      )}

      {/* Map */}
      {tour.map && tour.map.center && (
        <MapboxMap
          id="tour-map"
          center={tour.map.center}
          zoom={tour.map.zoom || 8}
          markers={tour.map.markers || []}
          routeCoordinates={tour.map.routeCoordinates || []}
        />
      )}
    </>
  )
}
