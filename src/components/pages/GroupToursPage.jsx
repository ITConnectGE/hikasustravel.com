import { useContext, useEffect } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import BlurUpBackground from '../shared/BlurUpBackground'
import { tours } from '../../data/tours'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import LocaleLink from '../../i18n/LocaleLink'
import { I18nContext } from '../../i18n/I18nProvider'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function GroupToursPage() {
  const groupTours = tours.filter((t) => t.type === 'group')
  const t = useT()
  const { lang } = useLang()
  const { tourTranslations, loadTourTranslations } = useContext(I18nContext)
  const seo = getSEO('groupTours', lang)
  useSEO({ ...seo, lang, path: 'group-tours', image: '/images/files/Gergeti-Church.jpg' })

  useEffect(() => {
    if (!tourTranslations) loadTourTranslations()
  }, [tourTranslations, loadTourTranslations])

  return (
    <>
      <HeroSection
        image="/images/files/Gergeti-Church.jpg"
        title={t('tour.groupTours')}
      />

      <div className="tour-listing">
        {groupTours.map((tour) => {
          const tt = tourTranslations?.[tour.slug]
          return (
            <FadeUp key={tour.slug}>
              <div className="tour-item tour-item-card">
                <BlurUpBackground
                  src={tour.listingImage || tour.heroImage}
                  className="tour-image"
                />
                <div className="tour-info">
                  <h2>
                    <LocaleLink to={`/group-tours/${tour.slug}`}>{tt?.title || tour.title}</LocaleLink>
                  </h2>
                  <h3>{tour.days} {t('tour.days')}</h3>
                  <p>{tt?.listingDescription || tt?.description || tour.listingDescription || tour.description}</p>
                  <div className="more">
                    <LocaleLink to={`/group-tours/${tour.slug}`}>{t('tour.moreInfo')}</LocaleLink>
                  </div>
                </div>
                <div className="tour-data">
                  {tour.groupDates && (
                    <>
                      <div className="available">{t('tour.availableDates')}</div>
                      <div className="date-chips">
                        {tour.groupDates.map((d, i) => (
                          <div key={i} className="date-chip">
                            <span className="date-range">{d.start} – {d.end}</span>
                            <span className="date-year">{d.year}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {tour.pricePerPerson && (
                    <div style={{ marginTop: '1.6em' }}>
                      <strong>{t('tour.fromPP', { price: tour.pricePerPerson })}</strong>
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>
          )
        })}
      </div>
    </>
  )
}
