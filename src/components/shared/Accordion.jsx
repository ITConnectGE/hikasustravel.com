import { useState } from 'react'
import useT from '../../i18n/useT'

export function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="itinerary-item">
      <div className="itinerary-title" onClick={onToggle}>
        <h3>{title}</h3>
        <span className="toggle-btn">{isOpen ? '[-]' : '[+]'}</span>
      </div>
      <div className={`itinerary-content${isOpen ? ' open' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default function Accordion({ items, renderContent, headingKey }) {
  const [openItems, setOpenItems] = useState({})
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
    <div className="itinerary-grid">
      <div className="itinerary-title" onClick={toggleAll} style={{ cursor: 'pointer' }}>
        <h2 style={{ paddingBottom: 0 }}>{heading}</h2>
        <span className="toggle-btn">{allOpen ? '[-]' : '[+]'}</span>
      </div>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={!!openItems[index]}
          onToggle={() => toggleItem(index)}
        >
          {renderContent ? renderContent(item) : (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          )}
        </AccordionItem>
      ))}
    </div>
  )
}
