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

function Submenu() {
  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="submenu">
      <nav>
        <ul>
          <li><a href="#overview" onClick={(e) => handleClick(e, 'overview')}>Overview</a></li>
          <li><a href="#itinerary" onClick={(e) => handleClick(e, 'itinerary')}>Itinerary</a></li>
          <li><a href="#pricing" onClick={(e) => handleClick(e, 'pricing')}>Pricing</a></li>
          <li><a href="#gallery" onClick={(e) => handleClick(e, 'gallery')}>Gallery</a></li>
          <li><a href="#book" onClick={(e) => handleClick(e, 'book')}>Book</a></li>
          <li><a href="#tour-map" onClick={(e) => handleClick(e, 'tour-map')}>Map</a></li>
        </ul>
      </nav>
    </div>
  )
}

export default function TourDetailPage() {
  const { slug } = useParams()

  const tour = tours.find((t) => t.slug === slug)

  if (!tour) {
    return (
      <section className="page-items" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <h2>Tour not found</h2>
          <p>The tour you're looking for doesn't exist.</p>
        </div>
      </section>
    )
  }

  const isGroup = tour.type === 'group'

  return (
    <>
      <HeroSection image={tour.heroImage} title={tour.title} />
      <Submenu />

      {/* Overview */}
      <section id="overview" className="page-items">
        <FadeUp>
          <h2 style={{ textAlign: 'center' }}>Overview</h2>
          <p>{tour.description}</p>
        </FadeUp>
      </section>

      {/* Group Tour Summary */}
      {isGroup && tour.groupSummary && (
        <section className="page-items">
          <FadeUp>
            <div className="tour-group-summary">
              {tour.groupSummary.map((item, i) => (
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
      {tour.itinerary && tour.itinerary.length > 0 && (
        <section id="itinerary" className="page-items">
          <Accordion items={tour.itinerary} />
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
      {(tour.included || tour.notIncluded) && (
        <section className="page-items">
          <FadeUp>
            <IncludedNotIncluded
              included={tour.included}
              notIncluded={tour.notIncluded}
            />
          </FadeUp>
        </section>
      )}

      {/* Booking Form */}
      <section id="book" className="page-items" style={{ backgroundColor: 'var(--color-h2)', color: 'var(--color-bg)' }}>
        <FadeUp>
          <h2 style={{ textAlign: 'center', color: 'var(--color-h3)' }}>Book This Tour</h2>
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
