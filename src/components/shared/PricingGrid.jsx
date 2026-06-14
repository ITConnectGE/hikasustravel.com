import { useState } from 'react'
import useT from '../../i18n/useT'
import FadeUp from './FadeUp'
import hotelData from '../../data/hotelData'
import HotelModal from './HotelModal'

function HotelLink({ name, onSelect }) {
  return (
    <button type="button" className="hotel-link" onClick={() => onSelect({ name, ...hotelData[name] })}>
      {name}
    </button>
  )
}

// A cell may hold a single hotel name (an exact hotelData key, which can itself
// contain a comma — e.g. "Tsinandali Estate, A Radisson Collection Hotel"), or a
// comma-separated list of options optionally ending in "or similar". We try an
// exact match first so every existing single-hotel cell renders exactly as
// before; only when that fails do we split a list and link the hotels we know.
function HotelName({ name, onSelect }) {
  if (!name) return null
  if (hotelData[name]) return <HotelLink name={name} onSelect={onSelect} />

  const trailingMatch = name.match(/\s+or similar\s*$/i)
  const trailing = trailingMatch ? trailingMatch[0] : ''
  const core = trailingMatch ? name.slice(0, trailingMatch.index) : name
  const parts = core.split(',').map((p) => p.trim()).filter(Boolean)

  // Only treat the cell as a linkable list when it has multiple parts and at
  // least one is a known hotel; otherwise keep the original text verbatim.
  if (parts.length <= 1 || !parts.some((p) => hotelData[p])) return <>{name}</>

  return (
    <>
      {parts.map((part, j) => (
        <span key={j}>
          {j > 0 && ', '}
          {hotelData[part] ? <HotelLink name={part} onSelect={onSelect} /> : part}
        </span>
      ))}
      {trailing}
    </>
  )
}

export function AccommodationsTable({ accommodations }) {
  const t = useT()
  const [selectedHotel, setSelectedHotel] = useState(null)
  if (!accommodations || accommodations.length === 0) return null

  return (
    <>
      <div className="pricing-grid pricing-grid--accommodations">
        <div className="pricing-grid-header">
          <div>{t('pricing.city')}</div>
          <div>{t('pricing.hotels')}</div>
        </div>
        {accommodations.map((row, i) => {
          const hotelNames = row.hotel ? [row.hotel] : [row.luxury, row.midRange, row.economy].filter(Boolean)
          return (
            <div key={i} className="pricing-grid-row pricing-hotels-row">
              <div>{row.city}</div>
              <div>
                {hotelNames.map((name, j) => (
                  <span key={j}>
                    {j > 0 && ', '}
                    <HotelName name={name} onSelect={setSelectedHotel} />
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {selectedHotel && <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />}
    </>
  )
}

export function TravelerPricingTable({ pricing }) {
  const t = useT()
  if (!pricing || pricing.length === 0) return null

  return (
    <div className="pricing-grid pricing-grid-travelers">
      <div className="pricing-grid-header">
        <div>{t('pricing.travelers')}</div>
        <div className="pricing-luxury">{t('pricing.premium')}</div>
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

function PricingCards({ pricing }) {
  const t = useT()
  const tiers = [
    { key: 'economy', label: t('pricing.economy') },
    { key: 'midRange', label: t('pricing.midRange'), featured: true },
    { key: 'luxury', label: t('pricing.premium') },
  ]

  const numericRows = pricing.filter((r) => r.travelers !== 'Single Supplement')
  const singleSupplement = pricing.find((r) => r.travelers === 'Single Supplement')
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
                {singleSupplement && (
                  <div className="td-price-card__row">
                    <span>{t('pricing.singleSupplement')}</span>
                    <span>{formatEuro(singleSupplement[tier.key])}</span>
                  </div>
                )}
              </div>
            )}
            <a href="#book" onClick={scrollToBook} className="td-price-card__cta">
              {t('tour.getExactPrice')}
            </a>
          </div>
        )
      })}
    </div>
  )
}

function PrivateAccommodationsTable({ accommodations }) {
  const t = useT()
  const [selectedHotel, setSelectedHotel] = useState(null)
  if (!accommodations || accommodations.length === 0) return null

  return (
    <>
      <div className="pricing-grid pricing-grid--private">
        <div className="pricing-grid-header">
          <div>{t('pricing.city')}</div>
          <div className="pricing-luxury">{t('pricing.premium')}</div>
          <div>{t('pricing.midRange')}</div>
          <div>{t('pricing.economy')}</div>
        </div>
        {accommodations.map((row, i) => (
          <div key={i} className="pricing-grid-row">
            <div>{row.city}</div>
            <div><span className="td-hotel"><HotelName name={row.luxury} onSelect={setSelectedHotel} /></span></div>
            <div><span className="td-hotel"><HotelName name={row.midRange} onSelect={setSelectedHotel} /></span></div>
            <div><span className="td-hotel"><HotelName name={row.economy} onSelect={setSelectedHotel} /></span></div>
          </div>
        ))}
      </div>
      {selectedHotel && <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />}
    </>
  )
}

// Accommodation section (id="accommodation"). Group tours use the single-hotel
// table; private tours use the per-tier table. Same content as before, now in
// its own section so the navbar can link to it directly.
export function AccommodationSection({ accommodations, isGroup }) {
  const t = useT()
  if (!accommodations || accommodations.length === 0) return null

  return (
    <section id="accommodation" className="td-section">
      <FadeUp>
        <h2 className="td-section__title">{t('pricing.accommodations')}</h2>
        {isGroup ? (
          <AccommodationsTable accommodations={accommodations} />
        ) : (
          <PrivateAccommodationsTable accommodations={accommodations} />
        )}
      </FadeUp>
    </section>
  )
}

// Price section (id="pricing"). Private tours show the per-tier pricing cards;
// group tours show their fixed per-person price (existing data, unchanged).
export function PriceSection({ isGroup, pricing, pricePerPerson, singleSupplement }) {
  const t = useT()
  const hasPricing = pricing && pricing.length > 0
  const hasGroupPrice = isGroup && pricePerPerson
  if (!hasPricing && !hasGroupPrice) return null

  return (
    <section id="pricing" className="td-section">
      <FadeUp>
        <div className="td-pricing">
          <div className="td-pricing__header">
            <h2 className="td-section__title">{t('pricing.title')}</h2>
          </div>

          <div className="td-pricing__block">
            {hasPricing ? (
              <PricingCards pricing={pricing} />
            ) : (
              <div className="td-price-cards td-price-cards--single">
                <div className="td-price-card td-price-card--featured">
                  <h3 className="td-price-card__tier">{t('pricing.pricePerPerson')}</h3>
                  <div className="td-price-card__price">
                    <span className="td-price-card__price-value">€{pricePerPerson}</span>
                    <span className="td-price-card__price-pp">{t('pricing.perPerson')}</span>
                  </div>
                  {singleSupplement && (
                    <div className="td-price-card__breakdown">
                      <div className="td-price-card__row">
                        <span>{t('pricing.singleSupplement')}</span>
                        <span>€{singleSupplement}</span>
                      </div>
                    </div>
                  )}
                  <a href="#book" onClick={scrollToBook} className="td-price-card__cta">
                    {t('tour.getExactPrice')}
                  </a>
                </div>
              </div>
            )}
          </div>

          <p className="td-pricing__note">
            <strong>{t('pricing.fromNote')}</strong> {t('pricing.note')}
          </p>
        </div>
      </FadeUp>
    </section>
  )
}
