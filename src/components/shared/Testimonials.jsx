import useT from '../../i18n/useT'
import asset from '../../utils/basePath'
import { testimonials } from '../../data/testimonials'

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-h3)" stroke="var(--color-h3)" strokeWidth="1" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function QuoteIcon() {
  return (
    <svg className="td-testimonial__quote" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  )
}

export default function Testimonials() {
  const t = useT()

  return (
    <div className="td-testimonials">
      <div className="td-testimonials__grid">
        {testimonials.map((item, i) => (
          <div key={i} className="td-testimonial">
            <QuoteIcon />
            <div className="td-testimonial__stars">
              {Array.from({ length: item.rating }, (_, j) => (
                <StarIcon key={j} />
              ))}
            </div>
            <p className="td-testimonial__text">{t(item.textKey)}</p>
            <div className="td-testimonial__author">
              <div className="td-testimonial__avatar">
                <img src={asset(item.image)} alt={t(item.nameKey)} />
              </div>
              <div className="td-testimonial__info">
                <span className="td-testimonial__name">{t(item.nameKey)}</span>
                <span className="td-testimonial__location">{t(item.locationKey)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
