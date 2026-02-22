import useT from '../../i18n/useT'

const iconPatterns = [
  { pattern: /accommodat|room|hotel|overnight/i, icon: 'bed' },
  { pattern: /transfer|vehicle|transport|driver/i, icon: 'car' },
  { pattern: /guide|service/i, icon: 'user' },
  { pattern: /entrance|fee|ticket/i, icon: 'ticket' },
  { pattern: /breakfast|lunch|dinner|meal|tasting|food/i, icon: 'utensils' },
  { pattern: /train/i, icon: 'train' },
  { pattern: /water|drink/i, icon: 'droplet' },
  { pattern: /flight/i, icon: 'plane' },
  { pattern: /insurance/i, icon: 'shield' },
  { pattern: /board/i, icon: 'utensils' },
  { pattern: /hotel|expense/i, icon: 'bed' },
]

function getIcon(text) {
  for (const { pattern, icon } of iconPatterns) {
    if (pattern.test(text)) return icon
  }
  return null
}

function ItemIcon({ type }) {
  const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  switch (type) {
    case 'bed': return <svg {...props}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
    case 'car': return <svg {...props}><path d="M5 17h14v-5l-2-5H7L5 12z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>
    case 'user': return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    case 'ticket': return <svg {...props}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
    case 'utensils': return <svg {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
    case 'train': return <svg {...props}><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h0"/><path d="M16 15h0"/></svg>
    case 'droplet': return <svg {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
    case 'plane': return <svg {...props}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
    case 'shield': return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    default: return null
  }
}

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
            {included.map((item, i) => {
              const iconType = getIcon(item)
              return (
                <li key={i} className="incl__item">
                  {iconType ? <span className="incl__context-icon incl__context-icon--yes"><ItemIcon type={iconType} /></span> : <CheckIcon />}
                  <span>{item}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {notIncluded.length > 0 && (
        <div className="incl__card incl__card--no">
          <h3 className="incl__title">{t('included.whatsNotIncluded')}</h3>
          <ul className="incl__list">
            {notIncluded.map((item, i) => {
              const iconType = getIcon(item)
              return (
                <li key={i} className="incl__item">
                  {iconType ? <span className="incl__context-icon incl__context-icon--no"><ItemIcon type={iconType} /></span> : <XIcon />}
                  <span>{item}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
