import { Link } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import BlurUpBackground from '../shared/BlurUpBackground'
import { tours } from '../../data/tours'

export default function GroupToursPage() {
  const groupTours = tours.filter((t) => t.type === 'group')

  return (
    <>
      <HeroSection
        image="/images/files/Gergeti-Church.jpg"
        title="Group Tours"
      />

      {groupTours.map((tour) => (
        <section key={tour.slug} className="page-items" style={{ padding: 0 }}>
          <FadeUp>
            <div className="tour-item">
              <BlurUpBackground
                src={tour.listingImage || tour.heroImage}
                className="tour-image"
              />
              <div className="tour-info">
                <h2>
                  <Link to={`/group-tours/${tour.slug}`}>{tour.title}</Link>
                </h2>
                <h3>{tour.days} days</h3>
                <p>{tour.listingDescription || tour.description}</p>
                <div className="more">
                  <Link to={`/group-tours/${tour.slug}`}>More info</Link>
                </div>
              </div>
              <div className="tour-data">
                {tour.groupDates && (
                  <>
                    <div className="available">Available Dates</div>
                    {tour.groupDates.map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </>
                )}
                {tour.pricePerPerson && (
                  <div style={{ marginTop: '1.6em' }}>
                    <strong>From €{tour.pricePerPerson} p.p.</strong>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>
        </section>
      ))}
    </>
  )
}
