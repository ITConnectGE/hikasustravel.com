import useT from '../../i18n/useT'
import FadeUp from './FadeUp'

export function AccommodationsTable({ accommodations }) {
  const t = useT()
  if (!accommodations || accommodations.length === 0) return null

  return (
    <div className="pricing-grid pricing-grid--accommodations">
      <div className="pricing-grid-header">
        <div>{t('pricing.city')}</div>
        <div>{t('pricing.hotels')}</div>
      </div>
      {accommodations.map((row, i) => (
        <div key={i} className="pricing-grid-row pricing-hotels-row">
          <div>{row.city}</div>
          <div>{row.hotel || [row.luxury, row.midRange, row.economy].filter(Boolean).join(', ')}</div>
        </div>
      ))}
    </div>
  )
}

export function TravelerPricingTable({ pricing }) {
  const t = useT()
  if (!pricing || pricing.length === 0) return null

  return (
    <div className="pricing-grid pricing-grid-travelers">
      <div className="pricing-grid-header">
        <div>{t('pricing.travelers')}</div>
        <div className="pricing-luxury">{t('pricing.luxury')}</div>
        <div>{t('pricing.midRange')}</div>
        <div>{t('pricing.economy')}</div>
      </div>
      {pricing.map((row, i) => (
        <div key={i} className="pricing-grid-row">
          <div>{row.travelers}</div>
          <div>{row.luxury}</div>
          <div>{row.midRange}</div>
          <div>{row.economy}</div>
        </div>
      ))}
    </div>
  )
}

export function getStartingPrice(pricing) {
  if (!pricing || pricing.length === 0) return null
  const numericRows = pricing.filter((r) => r.travelers !== 'Single Supplement')
  if (numericRows.length === 0) return null
  const prices = numericRows.flatMap((r) => [r.luxury, r.midRange, r.economy]
    .map((p) => parseFloat((p || '').replace(/[^0-9.]/g, '')))
    .filter((n) => !isNaN(n) && n > 0)
  )
  if (prices.length === 0) return null
  return Math.min(...prices)
}

function getTierPrice(pricing, tier) {
  const numericRows = pricing.filter((r) => r.travelers !== 'Single Supplement')
  if (numericRows.length === 0) return null
  const prices = numericRows
    .map((r) => parseFloat((r[tier] || '').replace(/[^0-9.]/g, '')))
    .filter((n) => !isNaN(n) && n > 0)
  return prices.length > 0 ? Math.min(...prices) : null
}

function getHotelNames(accommodations, tier) {
  if (!accommodations || accommodations.length === 0) return []
  return accommodations.map((row) => row[tier]).filter(Boolean).slice(0, 3)
}

function scrollToBook(e) {
  e.preventDefault()
  const el = document.getElementById('book')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function formatEuro(raw) {
  const num = parseFloat((raw || '').replace(/[^0-9.]/g, ''))
  if (isNaN(num) || num <= 0) return raw
  return `€${num.toLocaleString('en-US')}`
}

function PricingCards({ pricing, accommodations }) {
  const t = useT()
  const tiers = [
    { key: 'economy', label: t('pricing.economy') },
    { key: 'midRange', label: t('pricing.midRange'), featured: true },
    { key: 'luxury', label: t('pricing.luxury') },
  ]

  const numericRows = pricing.filter((r) => r.travelers !== 'Single Supplement')
  // Find the row with the lowest price across all tiers (best value)
  let bestValueCount = null
  if (numericRows.length > 1) {
    let lowest = Infinity
    numericRows.forEach((row) => {
      ;['economy', 'midRange', 'luxury'].forEach((k) => {
        const n = parseFloat((row[k] || '').replace(/[^0-9.]/g, ''))
        if (!isNaN(n) && n > 0 && n < lowest) {
          lowest = n
          bestValueCount = row.travelers
        }
      })
    })
  }

  return (
    <div className="td-price-cards">
      {tiers.map((tier) => {
        const startPrice = getTierPrice(pricing, tier.key)
        const hotels = getHotelNames(accommodations, tier.key)

        return (
          <div
            key={tier.key}
            className={`td-price-card${tier.featured ? ' td-price-card--featured' : ''}`}
          >
            {tier.featured && (
              <div className="td-price-card__badge">{t('pricing.mostPopular')}</div>
            )}
            <h3 className="td-price-card__tier">{tier.label}</h3>
            {startPrice && (
              <div className="td-price-card__price">
                <span className="td-price-card__price-from">{t('sidebar.startingFrom')}</span>
                <span className="td-price-card__price-value">€{startPrice.toLocaleString('en-US')}</span>
                <span className="td-price-card__price-pp">{t('pricing.perPerson')}</span>
              </div>
            )}
            {hotels.length > 0 && (
              <ul className="td-price-card__hotels">
                {hotels.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
            {numericRows.length > 0 && (
              <div className="td-price-card__breakdown">
                {numericRows.map((row, i) => (
                  <div
                    key={i}
                    className={`td-price-card__row${row.travelers === bestValueCount ? ' td-price-card__row--best' : ''}`}
                  >
                    <span>
                      {row.travelers === '1'
                        ? `1 ${t('pricing.travelers').replace(/s$/i, '')}`
                        : `${row.travelers} ${t('pricing.travelers')}`
                      }
                    </span>
                    <span>{formatEuro(row[tier.key])}</span>
                  </div>
                ))}
              </div>
            )}
            <a href="#book" onClick={scrollToBook} className="td-price-card__cta">
              {t('tour.bookNow')}
            </a>
          </div>
        )
      })}
    </div>
  )
}

export default function PricingGrid({ accommodations, pricing }) {
  const t = useT()
  const hasPricing = pricing && pricing.length > 0

  return (
    <section id="pricing" className="td-section">
      <FadeUp>
        <div className="td-pricing">
          <div className="td-pricing__header">
            <h2 className="td-section__title">{t('pricing.title')}</h2>
          </div>

          {hasPricing && (
            <div className="td-pricing__block">
              <PricingCards pricing={pricing} accommodations={accommodations} />
            </div>
          )}

          {!hasPricing && accommodations && accommodations.length > 0 && (
            <div className="td-pricing__block">
              <h3 className="td-pricing__subtitle">{t('pricing.accommodations')}</h3>
              <AccommodationsTable accommodations={accommodations} />
            </div>
          )}
        </div>
      </FadeUp>
    </section>
  )
}
