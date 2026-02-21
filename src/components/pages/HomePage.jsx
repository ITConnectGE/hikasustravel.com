import { Link } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import BlurUpBackground from '../shared/BlurUpBackground'
import MapboxMap from '../shared/MapboxMap'
import { tours } from '../../data/tours'

export default function HomePage() {
  return (
    <>
      <HeroSection
        image="/images/files/georgia-home.jpg"
        title="Start planning your adventure in Georgia with us!"
      />

      <section className="home-items">
        <div className="home-items">
          <FadeUp>
            <h2>Explore the beauty of Georgia with Us!</h2>
          </FadeUp>
          <p>Join us for unforgettable adventures and discover the hidden gems of Georgia.</p>
          <FadeUp>
            <div className="button">
              <p><Link to="/private-tours">Start your journey!</Link></p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="home-items">
        <div className="tours-grid-container">
          <FadeUp>
            <h2>Our Tours</h2>
          </FadeUp>
          <FadeUp>
            <div className="tours-grid">
              {tours.map((tour) => (
                <div className="tour-tile" key={tour.slug}>
                  <Link
                    to={`/${tour.type === 'group' ? 'group-tours' : 'private-tours'}/${tour.slug}`}
                    className="tour-tile-link"
                  >
                    <BlurUpBackground
                      src={tour.tileImage || tour.heroImage}
                      className="tour-tile-image"
                    />
                    <div className="tour-tile-overlay">
                      <h3>{tour.title}</h3>
                      <p>{tour.days} days</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="home-items">
        <div className="home-items">
          <FadeUp>
            <h2>Shuttle-Service</h2>
          </FadeUp>
          <p>We have an extensive network of shuttle services to get you where you need to go.</p>
          <FadeUp>
            <div className="button">
              <p><Link to="/shuttle-service">Shuttle-Service</Link></p>
            </div>
          </FadeUp>
        </div>
      </section>

      <MapboxMap
        id="map"
        center={[43.402090536365975, 42.22342174308285]}
        zoom={7}
        showGeorgiaBorders
        markers={[{
          coordinates: [43.402090536365975, 42.22342174308285],
          svgUrl: '/img/pennant.svg',
          width: 30,
          height: 36,
          offsetX: 20,
          offsetY: 5,
        }]}
        isHomePage
      />
    </>
  )
}
