import { useContext, useEffect } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import BlurUpBackground from '../shared/BlurUpBackground'
import { tours } from '../../data/tours'
import useT from '../../i18n/useT'
import LocaleLink from '../../i18n/LocaleLink'
import { I18nContext } from '../../i18n/I18nProvider'

export default function PrivateToursPage() {
  const privateTours = tours.filter((t) => t.type === 'private')
  const t = useT()
  const { tourTranslations, loadTourTranslations } = useContext(I18nContext)

  useEffect(() => {
    if (!tourTranslations) loadTourTranslations()
  }, [tourTranslations, loadTourTranslations])

  return (
    <>
      <HeroSection
        image="/images/files/georgia-tour-01.jpg"
        title={t('tour.privateTours')}
      />

      {privateTours.map((tour) => {
        const tt = tourTranslations?.[tour.slug]
        return (
          <section key={tour.slug} className="page-items" style={{ padding: 0 }}>
            <FadeUp>
              <div className="tour-item">
                <BlurUpBackground
                  src={tour.listingImage || tour.heroImage}
                  className="tour-image"
                />
                <div className="tour-info">
                  <h2>
                    <LocaleLink to={`/private-tours/${tour.slug}`}>{tt?.title || tour.title}</LocaleLink>
                  </h2>
                  <h3>{tour.days} {t('tour.days')}</h3>
                  <p>{tt?.listingDescription || tt?.description || tour.listingDescription || tour.description}</p>
                  <div className="more">
                    <LocaleLink to={`/private-tours/${tour.slug}`}>{t('tour.moreInfo')}</LocaleLink>
                  </div>
                </div>
                <div className={`tour-data${tour.availableDates ? '' : ' no-dates'}`}>
                  {tour.availableDates && (
                    <>
                      <div className="available">{t('tour.availableDates')}</div>
                      {tour.availableDates.map((d, i) => (
                        <div key={i}>{d}</div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </FadeUp>
          </section>
        )
      })}
    </>
  )
}
