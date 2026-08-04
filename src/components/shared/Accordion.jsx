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

/* Itinerary day titles read "<day word> <n><separator><description>" in every
   language. Matching a fixed list of day words (rather than any leading word)
   keeps a title like "Tbilisi 5 — ..." from being mistaken for a day heading.
   `Dzien` is the diacritic-stripped spelling that most of the Polish tour copy
   still uses; `Dia` likewise for Spanish. */
const DAY_WORDS = new Set(['day', 'tag', 'jour', 'día', 'dia', 'dag', 'den', 'dzień', 'dzien'])

function parseDayTitle(title) {
  const match = title.match(/^(\p{L}+)\s+(\d+)\s*[:\-–—]\s*(.+)$/u)
  if (match && DAY_WORDS.has(match[1].toLowerCase())) {
    return { dayNum: match[2], description: match[3].trim() }
  }
  return { dayNum: null, description: title }
}

/* The two chip-worthy duration labels, in every spelling that actually occurs
   in the tour data (counted across all tours in all 7 locales). Matching is on
   the COMPLETE label, never a prefix: a bare "Duration:" / "Dauer:" /
   "Czas trwania:" also exists ~25 times and must stay an ordinary bullet, and
   "Czas trwania wycieczki" would otherwise swallow it. "Driving duration"
   appears untranslated a few times in every locale, so it is listed for all. */
const normLabel = (s) => s.replace(/[\u00a0\u202f]/g, ' ').replace(/\s*:\s*$/, '').trim().toLowerCase()
const TOUR_DURATION = new Set([
  'Duration of the tour', 'Dauer der Tour', 'Durée de la visite', 'Durée du tour',
  'Duración del tour', 'Duur van de tour', 'Délka prohlídky', 'Délka zájezdu',
  'Czas trwania wycieczki', 'Czas trwania touru',
].map(normLabel))
const DRIVING_DURATION = new Set([
  'Driving duration', 'Fahrtdauer', 'Durée du trajet', 'Durée de conduite',
  'Duración del trayecto', 'Duración de la conducción', 'Rijduur',
  'Doba jízdy', 'Délka jízdy', 'Czas jazdy',
].map(normLabel))

function extractTags(htmlContent) {
  let tourValue = null
  let drivingValue = null

  // Lift the two duration lines out of their <li> (or <i>) wrapper, whatever
  // language they are written in, and drop them from the visible bullet list.
  let cleaned = htmlContent.replace(
    /<(li|i)>\s*<strong>([^<]*)<\/strong>([^<]*)<\/\1>/gi,
    (whole, _tag, label, value) => {
      const key = normLabel(label)
      if (TOUR_DURATION.has(key)) { if (tourValue === null) tourValue = value.trim(); return '' }
      if (DRIVING_DURATION.has(key)) { if (drivingValue === null) drivingValue = value.trim(); return '' }
      return whole
    }
  )

  // Fall back to a bare scan for any layout that does not use those wrappers.
  if (tourValue === null || drivingValue === null) {
    for (const m of htmlContent.matchAll(/<strong>([^<]*)<\/strong>\s*([^<]*)/g)) {
      const key = normLabel(m[1])
      if (tourValue === null && TOUR_DURATION.has(key)) tourValue = m[2].trim()
      if (drivingValue === null && DRIVING_DURATION.has(key)) drivingValue = m[2].trim()
    }
  }

  // Tidy up wrappers left empty by the removals.
  cleaned = cleaned
    .replace(/<p>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '')
    .replace(/<ul>\s*<\/ul>/gi, '')

  const tags = []
  if (tourValue) tags.push({ icon: 'clock', label: tourValue })
  if (drivingValue) tags.push({ icon: 'car', label: drivingValue })

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

  const trigger = (
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
  )

  return (
    <div className={`acc__item${isOpen ? ' acc__item--open' : ''}${itinerary ? ' acc__item--itinerary' : ''}`}>
      {/* Itinerary day headers are semantic <h3> wrapping the disclosure button
          (H2 "Itinerary" -> H3 day), so the heading outline parses cleanly for
          search/AI. The <h3> is style-reset (.acc__heading) to keep the design
          identical. FAQ accordions keep the plain button. */}
      {itinerary ? <h3 className="acc__heading">{trigger}</h3> : trigger}
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
