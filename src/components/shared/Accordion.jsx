import { useState } from 'react'
import useT from '../../i18n/useT'

function ChevronIcon({ open }) {
  return (
    <svg
      className={`acc__chevron${open ? ' acc__chevron--open' : ''}`}
      width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

function parseDayTitle(title) {
  const match = title.match(/^Day\s+(\d+)\s*[:\-–—]\s*(.+)$/i)
  if (match) return { dayNum: match[1], description: match[2].trim() }
  return { dayNum: null, description: title }
}

function extractTags(htmlContent) {
  const tags = []
  const durationMatch = htmlContent.match(/<strong>Duration of the tour:<\/strong>\s*([^<]+)/i)
  const drivingMatch = htmlContent.match(/<strong>Driving duration:<\/strong>\s*([^<]+)/i)
  if (durationMatch) tags.push({ icon: 'clock', label: durationMatch[1].trim() })
  if (drivingMatch) tags.push({ icon: 'car', label: drivingMatch[1].trim() })

  // Strip the duration/driving lines from content for cleaner display
  let cleaned = htmlContent
    .replace(/<li>\s*<strong>Duration of the tour:<\/strong>[^<]*<\/li>/gi, '')
    .replace(/<li>\s*<strong>Driving duration:<\/strong>[^<]*<\/li>/gi, '')
    .replace(/<p>\s*<br\s*\/?>\s*<i>\s*<strong>Duration of the tour:<\/strong>[^<]*<\/i>\s*<br\s*\/?>\s*<i>\s*<strong>Driving duration:<\/strong>[^<]*<\/i>\s*<\/p>/gi, '')
    .replace(/<i>\s*<strong>Duration of the tour:<\/strong>[^<]*<\/i>/gi, '')
    .replace(/<i>\s*<strong>Driving duration:<\/strong>[^<]*<\/i>/gi, '')

  return { tags, cleanedContent: cleaned }
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function CarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17h14v-5l-2-5H7L5 12z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
    </svg>
  )
}

export function AccordionItem({ title, children, isOpen, onToggle, index, itinerary, tags }) {
  const headingId = `acc-heading-${index}`
  const panelId = `acc-panel-${index}`
  const { dayNum, description } = itinerary ? parseDayTitle(title) : { dayNum: null, description: title }

  return (
    <div className={`acc__item${isOpen ? ' acc__item--open' : ''}${itinerary ? ' acc__item--itinerary' : ''}`}>
      <button
        className="acc__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        id={headingId}
        type="button"
      >
        {itinerary && dayNum && (
          <span className="acc__day-badge">{dayNum}</span>
        )}
        <span className="acc__trigger-content">
          <span className="acc__trigger-text">{itinerary ? description : title}</span>
          {itinerary && tags && tags.length > 0 && (
            <span className="acc__tags">
              {tags.map((tag, i) => (
                <span key={i} className="acc__tag">
                  {tag.icon === 'clock' ? <ClockIcon /> : <CarIcon />}
                  {tag.label}
                </span>
              ))}
            </span>
          )}
        </span>
        <ChevronIcon open={isOpen} />
      </button>
      <div
        className={`acc__panel${isOpen ? ' acc__panel--open' : ''}`}
        id={panelId}
        role="region"
        aria-labelledby={headingId}
      >
        <div className="acc__panel-inner">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Accordion({ items, renderContent, headingKey, itinerary }) {
  const [openItems, setOpenItems] = useState(itinerary ? { 0: true } : {})
  const [allOpen, setAllOpen] = useState(false)
  const t = useT()

  const toggleItem = (index) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const toggleAll = () => {
    const newState = !allOpen
    setAllOpen(newState)
    const newItems = {}
    items.forEach((_, i) => { newItems[i] = newState })
    setOpenItems(newItems)
  }

  const heading = headingKey ? t(headingKey) : t('tour.itinerary')

  return (
    <div className={`acc${itinerary ? ' acc--itinerary' : ''}`}>
      <div className="acc__header">
        <h2 className="acc__heading">{heading}</h2>
        <button className="acc__toggle-all" onClick={toggleAll} type="button">
          {allOpen ? t('accordion.collapseAll') : t('accordion.expandAll')}
          <ChevronIcon open={allOpen} />
        </button>
      </div>
      <div className={itinerary ? 'acc__timeline' : undefined}>
        {items.map((item, index) => {
          const { tags, cleanedContent } = itinerary
            ? extractTags(item.content)
            : { tags: [], cleanedContent: item.content }

          return (
            <AccordionItem
              key={index}
              title={item.title}
              isOpen={!!openItems[index]}
              onToggle={() => toggleItem(index)}
              index={index}
              itinerary={itinerary}
              tags={tags}
            >
              {renderContent ? renderContent(item) : (
                <div dangerouslySetInnerHTML={{ __html: cleanedContent }} />
              )}
            </AccordionItem>
          )
        })}
      </div>
    </div>
  )
}
