import useT from '../../i18n/useT'

export function AccommodationsTable({ accommodations }) {
  const t = useT()
  if (!accommodations || accommodations.length === 0) return null

  return (
    <div className="pricing-grid">
      <div className="pricing-grid-header">
        <div>{t('pricing.city')}</div>
        <div className="pricing-luxury">{t('pricing.luxury')}</div>
        <div>{t('pricing.midRange')}</div>
        <div>{t('pricing.economy')}</div>
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

export default function PricingGrid({ accommodations, pricing }) {
  const t = useT()

  return (
    <section id="pricing" className="page-items">
      <div className="tour-pricing-table">
        <h4>{t('pricing.title')}</h4>
        {accommodations && accommodations.length > 0 && (
          <>
            <h3 style={{ textAlign: 'center', marginBottom: 'calc(var(--indent) * 1)' }}>
              {t('pricing.accommodations')}
            </h3>
            <AccommodationsTable accommodations={accommodations} />
          </>
        )}
        {pricing && pricing.length > 0 && (
          <>
            <h3 style={{ textAlign: 'center', marginTop: 'calc(var(--indent) * 1.5)', marginBottom: 'calc(var(--indent) * 1)' }}>
              {t('pricing.pricePerPerson')}
            </h3>
            <TravelerPricingTable pricing={pricing} />
          </>
        )}
      </div>
    </section>
  )
}
