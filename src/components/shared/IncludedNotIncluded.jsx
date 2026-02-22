import useT from '../../i18n/useT'

export default function IncludedNotIncluded({ included = [], notIncluded = [] }) {
  const t = useT()
  if (included.length === 0 && notIncluded.length === 0) return null

  return (
    <div className="included-notincluded">
      <div className="list">
        <h3>{t('included.whatsIncluded')}</h3>
        <ul>
          {included.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="list">
        <h3>{t('included.whatsNotIncluded')}</h3>
        <ul>
          {notIncluded.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
