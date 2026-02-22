import useT from '../../i18n/useT'

function CheckIcon() {
  return (
    <svg className="incl__icon incl__icon--yes" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="incl__icon incl__icon--no" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export default function IncludedNotIncluded({ included = [], notIncluded = [] }) {
  const t = useT()
  if (included.length === 0 && notIncluded.length === 0) return null

  return (
    <div className="incl">
      {included.length > 0 && (
        <div className="incl__card incl__card--yes">
          <h3 className="incl__title">{t('included.whatsIncluded')}</h3>
          <ul className="incl__list">
            {included.map((item, i) => (
              <li key={i} className="incl__item"><CheckIcon /><span>{item}</span></li>
            ))}
          </ul>
        </div>
      )}
      {notIncluded.length > 0 && (
        <div className="incl__card incl__card--no">
          <h3 className="incl__title">{t('included.whatsNotIncluded')}</h3>
          <ul className="incl__list">
            {notIncluded.map((item, i) => (
              <li key={i} className="incl__item"><XIcon /><span>{item}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
