import { useState } from 'react'

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

export default function Accordion({ items, renderContent }) {
  const [openItems, setOpenItems] = useState({})
  const [allOpen, setAllOpen] = useState(false)

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

  return (
    <div className="itinerary-grid">
      <div className="itinerary-title" onClick={toggleAll} style={{ cursor: 'pointer' }}>
        <h2 style={{ paddingBottom: 0 }}>Itinerary</h2>
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
