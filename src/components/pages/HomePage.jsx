import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import BlurUpBackground from '../shared/BlurUpBackground'
import MapboxMap from '../shared/MapboxMap'
import { tours } from '../../data/tours'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import LocaleLink from '../../i18n/LocaleLink'
import { I18nContext } from '../../i18n/I18nProvider'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function HomePage() {
  const t = useT()
  const { lang } = useLang()
  const { tourTranslations, loadTourTranslations } = useContext(I18nContext)
  const seo = getSEO('home', lang)
  useSEO({ ...seo, lang, image: '/images/files/georgia-home.jpg' })

  // Eagerly load tour translations for homepage tiles
  if (!tourTranslations) loadTourTranslations()

  return (
    <>
      <HeroSection
        image="/images/files/georgia-home.jpg"
        title={t('home.heroTitle')}
      />

      <section className="home-items">
        <div className="home-items">
          <FadeUp>
            <h2>{t('home.exploreTitle')}</h2>
          </FadeUp>
          <p>{t('home.exploreText')}</p>
          <FadeUp>
            <div className="button">
              <p><LocaleLink to="/private-tours">{t('home.startJourney')}</LocaleLink></p>
            </div>
          </FadeUp>
        </div>
      </section>

      {(() => {
        const groupTour = tours.find((tour) => tour.type === 'group')
        if (!groupTour) return null
        const tt = tourTranslations?.[groupTour.slug]
        return (
          <section className="home-items">
            <div className="tour-listing" style={{ background: 'none', maxWidth: '1600px' }}>
              <FadeUp>
                <div className="tour-item tour-item-card">
                  <BlurUpBackground
                    src={groupTour.listingImage || groupTour.heroImage}
                    className="tour-image"
                  />
                  <div className="tour-info">
                    <h2>
                      <LocaleLink to={`/group-tours/${groupTour.slug}`}>{tt?.title || groupTour.title}</LocaleLink>
                    </h2>
                    <h3>{groupTour.days} {t('tour.days')}</h3>
                    <p>{tt?.listingDescription || tt?.description || groupTour.listingDescription || groupTour.description}</p>
                    <div className="more">
                      <LocaleLink to={`/group-tours/${groupTour.slug}`}>{t('tour.moreInfo')}</LocaleLink>
                    </div>
                  </div>
                  <div className="tour-data">
                    {groupTour.groupDates && (
                      <>
                        <div className="available">{t('tour.availableDates')}</div>
                        <div className="date-chips">
                          {groupTour.groupDates.map((d, i) => (
                            <div key={i} className="date-chip">
                              <span className="date-range">{d.start} – {d.end}</span>
                              <span className="date-year">{d.year}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {groupTour.pricePerPerson && (
                      <div style={{ marginTop: '1.6em' }}>
                        <strong>{t('tour.fromPP', { price: groupTour.pricePerPerson })}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>
            </div>
          </section>
        )
      })()}

      <section className="home-items">
        <div className="tours-grid-container">
          <FadeUp>
            <h2>{t('home.ourTours')}</h2>
          </FadeUp>
          <FadeUp>
            <div className="tours-grid">
              {tours.map((tour) => {
                const tt = tourTranslations?.[tour.slug]
                return (
                  <div className="tour-tile" key={tour.slug}>
                    <LocaleLink
                      to={`/${tour.type === 'group' ? 'group-tours' : 'private-tours'}/${tour.slug}`}
                      className="tour-tile-link"
                    >
                      <BlurUpBackground
                        src={tour.tileImage || tour.heroImage}
                        className="tour-tile-image"
                      />
                      <div className="tour-tile-overlay">
                        <h3>{tt?.title || tour.title}</h3>
                        <p>{tour.days} {t('tour.days')}</p>
                      </div>
                    </LocaleLink>
                  </div>
                )
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="home-items">
        <div className="home-items">
          <FadeUp>
            <h2>{t('home.shuttleTitle')}</h2>
          </FadeUp>
          <p>{t('home.shuttleText')}</p>
          <FadeUp>
            <div className="button">
              <p><LocaleLink to="/shuttle-service">{t('home.shuttleLink')}</LocaleLink></p>
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
