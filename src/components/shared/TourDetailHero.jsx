import { useRef } from 'react'
import asset from '../../utils/basePath'
import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'

export default function TourDetailHero({ tour, translatedTitle, isGroup, startingPrice }) {
  const sectionRef = useRef(null)
  const t = useT()
  const title = translatedTitle || tour.title

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToBook = (e) => {
    e.preventDefault()
    const el = document.getElementById('book')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToItinerary = (e) => {
    e.preventDefault()
    const el = document.getElementById('itinerary')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const backPath = isGroup ? '/group-tours' : '/private-tours'
  const backLabel = isGroup ? t('tour.groupTours') : t('tour.privateTours')

  const priceDisplay = startingPrice
    ? t('tour.fromPP', { price: Number(startingPrice).toLocaleString('en-US') })
    : null

  return (
    <section
      ref={sectionRef}
      className="td-hero coverme"
      style={{ backgroundImage: `url(${asset(tour.heroImage)})` }}
    >
      <div className="td-hero__inner">
        <nav className="td-hero__breadcrumb" aria-label="Breadcrumb">
          <LocaleLink to={backPath}>{backLabel}</LocaleLink>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>

        <h1 className="td-hero__title">{title}</h1>

        <div className="td-hero__meta">
          {tour.days && (
            <span className="td-hero__badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              {tour.days} {t('tour.days')}
            </span>
          )}
          <span className="td-hero__badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {isGroup ? t('tour.groupTours') : t('tour.privateTours')}
          </span>
        </div>

        {priceDisplay && (
          <div className="td-hero__price">{priceDisplay}</div>
        )}

        <div className="td-hero__actions">
          <a href="#book" onClick={scrollToBook} className="td-hero__cta">
            {t('tour.bookThisTour')}
          </a>
          <a href="#itinerary" onClick={scrollToItinerary} className="td-hero__cta td-hero__cta--secondary">
            {t('tour.viewItinerary')}
          </a>
        </div>
      </div>

      <div
        className="arrow-down"
        onClick={scrollToNext}
        role="button"
        tabIndex={0}
        aria-label="Scroll down"
        onKeyDown={(e) => e.key === 'Enter' && scrollToNext()}
      />
    </section>
  )
}
