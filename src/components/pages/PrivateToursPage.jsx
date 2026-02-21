import { Link } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import BlurUpBackground from '../shared/BlurUpBackground'
import { tours } from '../../data/tours'

export default function PrivateToursPage() {
  const privateTours = tours.filter((t) => t.type === 'private')

  return (
    <>
      <HeroSection
        image="/images/files/georgia-tour-01.jpg"
        title="Private Tours"
      />

      {privateTours.map((tour) => (
        <section key={tour.slug} className="page-items" style={{ padding: 0 }}>
          <FadeUp>
            <div className="tour-item">
              <BlurUpBackground
                src={tour.listingImage || tour.heroImage}
                className="tour-image"
              />
              <div className="tour-info">
                <h2>
                  <Link to={`/private-tours/${tour.slug}`}>{tour.title}</Link>
                </h2>
                <h3>{tour.days} days</h3>
                <p>{tour.listingDescription || tour.description}</p>
                <div className="more">
                  <Link to={`/private-tours/${tour.slug}`}>More info</Link>
                </div>
              </div>
              <div className={`tour-data${tour.availableDates ? '' : ' no-dates'}`}>
                {tour.availableDates && (
                  <>
                    <div className="available">Available Dates</div>
                    {tour.availableDates.map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </FadeUp>
        </section>
      ))}
    </>
  )
}
