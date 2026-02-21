export function AccommodationsTable({ accommodations }) {
  if (!accommodations || accommodations.length === 0) return null

  return (
    <div className="pricing-grid">
      <div className="pricing-grid-header">
        <div>City</div>
        <div className="pricing-luxury">Luxury</div>
        <div>Mid-Range</div>
        <div>Economy</div>
      </div>
      {accommodations.map((row, i) => (
        <div key={i} className="pricing-grid-row pricing-hotels-row">
          <div>{row.city}</div>
          <div>{row.luxury}</div>
          <div>{row.midRange}</div>
          <div>{row.economy}</div>
        </div>
      ))}
    </div>
  )
}

export function TravelerPricingTable({ pricing }) {
  if (!pricing || pricing.length === 0) return null

  return (
    <div className="pricing-grid pricing-grid-travelers">
      <div className="pricing-grid-header">
        <div>Travelers</div>
        <div className="pricing-luxury">Luxury</div>
        <div>Mid-Range</div>
        <div>Economy</div>
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

export default function PricingGrid({ accommodations, pricing, title = 'Pricing' }) {
  return (
    <section id="pricing" className="page-items">
      <div className="tour-pricing-table">
        <h4>{title}</h4>
        {accommodations && accommodations.length > 0 && (
          <>
            <h3 style={{ textAlign: 'center', marginBottom: 'calc(var(--indent) * 1)' }}>
              Accommodations
            </h3>
            <AccommodationsTable accommodations={accommodations} />
          </>
        )}
        {pricing && pricing.length > 0 && (
          <>
            <h3 style={{ textAlign: 'center', marginTop: 'calc(var(--indent) * 1.5)', marginBottom: 'calc(var(--indent) * 1)' }}>
              Price per Person
            </h3>
            <TravelerPricingTable pricing={pricing} />
          </>
        )}
      </div>
    </section>
  )
}
