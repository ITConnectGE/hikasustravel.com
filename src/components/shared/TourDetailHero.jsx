import { useRef } from 'react'
import asset from '../../utils/basePath'
import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'

export default function TourDetailHero({ tour, translatedTitle, heroH1, heroSubtitle, heroFacts, isGroup }) {
  const sectionRef = useRef(null)
  const t = useT()
  const title = translatedTitle || tour.title
  const h1 = heroH1 || title

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToBook = (e) => {
    e.preventDefault()
    const el = document.getElementById('book')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const backPath = isGroup ? '/group-tours' : '/private-tours'
  const backLabel = isGroup ? t('tour.groupTours') : t('tour.privateTours')

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

        <h1 className="td-hero__title">{h1}</h1>

        {heroSubtitle && <p className="td-hero__subtitle">{heroSubtitle}</p>}

        {heroFacts?.length > 0 ? (
          <ul className="td-hero__facts">
            {heroFacts.map((fact, i) => (
              <li key={i} className="td-hero__fact">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                {fact}
              </li>
            ))}
          </ul>
        ) : (
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
        )}

        <div className="td-hero__actions">
          <a href="#book" onClick={scrollToBook} className="td-hero__cta">
            {isGroup ? t('tour.requestTour') : t('tour.requestTourCustom')}
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
