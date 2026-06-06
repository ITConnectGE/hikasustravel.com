import { useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import TourDetailHero from '../shared/TourDetailHero'
import TourSectionNav from '../shared/TourSectionNav'
import FadeUp from '../shared/FadeUp'
import Accordion from '../shared/Accordion'
import { AccommodationSection, PriceSection, getStartingPrice } from '../shared/PricingGrid'
import IncludedNotIncluded from '../shared/IncludedNotIncluded'
import TourInquiryForm from '../shared/TourInquiryForm'
import Gallery from '../shared/Gallery'
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
    const title = `${tt?.seoTitle || tour.seoTitle || tt?.title || tour.title} | Hikasus Travel`
    const description = tt?.metaDescription || tour.metaDescription || (tt?.description || tour.description || '').slice(0, 160)
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
    const locations = (tour.itinerary || [])
      .map(day => day.title)
      .filter(Boolean)
    const typeLabel = tour.type === 'group' ? 'group tour' : 'private tour'
    const daysLabel = tour.days ? `${tour.days}-day Georgia tour` : 'Georgia tour'
    const keywords = [
      `book ${typeLabel} Georgia`,
      daysLabel,
      ...locations.map(loc => `${loc} tour`),
      `Georgia ${typeLabel} itinerary`,
      'book Georgia adventure',
    ].join(', ')

    // Offer price (lowest available) for richer product/trip schema.
    const startPrice = tour.type === 'group'
      ? (tour.pricePerPerson ? parseFloat(tour.pricePerPerson.replace(/[^0-9.]/g, '')) : null)
      : getStartingPrice(tour.pricing)
    if (startPrice) {
      jsonLd.offers = {
        '@type': 'Offer',
        price: startPrice,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `https://www.hikasustravel.com/${lang}/${prefix}/${slug}`,
      }
    }

    // When the tour provides an FAQ, expose it as FAQPage alongside the trip.
    const faqList = tt?.faq || tour.faq
    const finalJsonLd = faqList?.length > 0
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            jsonLd,
            {
              '@type': 'FAQPage',
              mainEntity: faqList.map((f) => ({
                '@type': 'Question',
                name: f.title,
                acceptedAnswer: { '@type': 'Answer', text: f.content },
              })),
            },
          ],
        }
      : jsonLd

    return { title, description, keywords, path: `${prefix}/${slug}`, image: tour.heroImage, jsonLd: finalJsonLd }
  }, [tour, tt, slug, lang])
  useSEO({ ...tourSeo, lang })

  const navSections = useMemo(() => {
    if (!tour) return []
    const ttLocal = tourTranslations?.[tour.slug]
    const itinerary = ttLocal?.itinerary || tour.itinerary
    const hasPrice = (tour.pricing?.length > 0) || (tour.type === 'group' && tour.pricePerPerson)

    // Order must mirror the on-page section order:
    // Overview → Gallery → Itinerary → Accommodation → Pricing → Map → Book
    const sections = [{ id: 'overview', labelKey: 'tour.overview' }]
    if (tour.gallery?.length > 0) sections.push({ id: 'gallery', labelKey: 'tour.gallery' })
    if (itinerary?.length > 0) sections.push({ id: 'itinerary', labelKey: 'tour.itinerary' })
    if (tour.accommodations?.length > 0) sections.push({ id: 'accommodation', labelKey: 'pricing.accommodations' })
    if (hasPrice) sections.push({ id: 'pricing', labelKey: 'tour.pricing' })
    if (tour.map?.center) sections.push({ id: 'tour-map', labelKey: 'tour.map' })
    sections.push({ id: 'book', labelKey: 'tour.book' })
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
  const rightForYouItems = tt?.rightForYou || tour.rightForYou
  const faqList = tt?.faq || tour.faq

  // Extract starting price
  const startingPrice = isGroup
    ? (tour.pricePerPerson ? parseFloat(tour.pricePerPerson.replace(/[^0-9.]/g, '')) : null)
    : getStartingPrice(tour.pricing)

  // Tour highlights for the overview. Prefer an explicit `highlights` list
  // (translated or base) when a tour provides one; otherwise fall back to the
  // first 4 included items so tours without highlights are unchanged.
  const highlightItems = tt?.highlights || tour.highlights || (includedItems ? includedItems.slice(0, 4) : [])

  return (
    <>
      <TourDetailHero
        tour={tour}
        translatedTitle={tt?.title}
        heroH1={tt?.heroH1 || tour.heroH1}
        heroSubtitle={tt?.heroSubtitle || tour.heroSubtitle}
        heroFacts={tt?.heroFacts || tour.heroFacts}
        isGroup={isGroup}
        startingPrice={startingPrice}
      />

      <TourSectionNav sections={navSections} />

      <div className="td-layout">
        <main className="td-main">
          {/* 1. Overview */}
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

          {/* Group Tour Summary */}
          {isGroup && (tt?.groupSummary || tour.groupSummary) && (
            <section className="td-section">
              <FadeUp>
                <div className="tour-group-summary tour-summary-premium">
                  {(tt?.groupSummary || tour.groupSummary).map((item, i) => (
                    <div key={i} className="summary-item">
                      <strong>{item.label}</strong>
                      {item.type === 'dates' ? (
                        <div className="dates-list">
                          {item.values.map((v, j) => {
                            const dateText = typeof v === 'string' ? v : v.text
                            const soldOut = typeof v === 'object' && v.soldOut
                            return (
                              <div
                                key={j}
                                className={`date-range ${soldOut ? 'date-range--sold-out' : 'date-range--available'}`}
                              >
                                <span className="date-range__text">{dateText}</span>
                                <span className="date-range__status">
                                  {soldOut ? t('tour.soldOut') : t('tour.available')}
                                </span>
                              </div>
                            )
                          })}
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

          {/* 2. Gallery */}
          {tour.gallery && tour.gallery.length > 0 && (
            <section id="gallery" className="td-section">
              <FadeUp>
                <h2 className="td-section__title">{t('tour.gallery')}</h2>
                <p className="td-section__subtitle">{t('tour.gallerySubtitle')}</p>
              </FadeUp>
              <Gallery images={tour.gallery} />
            </section>
          )}

          {/* 3. Itinerary */}
          {itineraryItems && itineraryItems.length > 0 && (
            <section id="itinerary" className="td-section">
              <FadeUp>
                <Accordion items={itineraryItems} itinerary />
              </FadeUp>
            </section>
          )}

          {/* 4. Accommodation */}
          <AccommodationSection accommodations={tour.accommodations} isGroup={isGroup} />

          {/* 5. Price */}
          <PriceSection
            isGroup={isGroup}
            pricing={tour.pricing}
            pricePerPerson={tour.pricePerPerson}
            singleSupplement={tour.singleSupplement}
          />

          {/* 6. What's included and not included */}
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

          {/* Is this tour right for you? (only when the tour supplies the data) */}
          {rightForYouItems?.length > 0 && (
            <section className="td-section">
              <FadeUp>
                <h2 className="td-section__title">{t('tour.rightForYou')}</h2>
                <div className="td-overview__highlights">
                  {rightForYouItems.map((item, i) => (
                    <div key={i} className="td-overview__highlight">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </section>
          )}
        </main>
      </div>

      {/* 7. Map */}
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

      {/* FAQ (only when the tour supplies the data) */}
      {faqList?.length > 0 && (
        <div className="td-layout">
          <main className="td-main">
            <section id="faq" className="td-section">
              <FadeUp>
                <Accordion items={faqList} headingKey="faq.heroTitle" />
              </FadeUp>
            </section>
          </main>
        </div>
      )}

      {/* 8. Send inquiry */}
      <div className="td-layout">
        <main className="td-main">
          <section id="book" className="td-section td-book-inline">
            <FadeUp>
              <h2 className="td-section__title">{t('tour.bookThisTour')}</h2>
              {!isGroup && <p className="td-section__subtitle">{t('form.privateIntro')}</p>}
              <TourInquiryForm tourTitle={tour.tourFormTitle || tour.title} isGroupTour={isGroup} />
            </FadeUp>
          </section>
        </main>
      </div>
    </>
  )
}
