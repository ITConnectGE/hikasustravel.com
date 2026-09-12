import { useState } from 'react'

/**
 * SSR-safe country tabs for the homepage Featured Tours section.
 *
 * Every panel is always in the tree (per the HotelPanels.jsx pattern); only
 * the `hidden` attribute toggles visibility, so `renderToString` bakes the
 * default-active panel's content into the static HTML and switching tabs
 * client-side never has to mount content the crawler never saw.
 */
export default function CountryTabs({ tabs, ariaLabel }) {
  const [active, setActive] = useState(0)

  return (
    <div className="country-tabs">
      <div className="country-tabs__list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`country-tab-${tab.key}`}
            aria-selected={active === i}
            aria-controls={`country-panel-${tab.key}`}
            tabIndex={active === i ? 0 : -1}
            className="ptc-chip"
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.key}
          id={`country-panel-${tab.key}`}
          role="tabpanel"
          aria-labelledby={`country-tab-${tab.key}`}
          hidden={active !== i}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
