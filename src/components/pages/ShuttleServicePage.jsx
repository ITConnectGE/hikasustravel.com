import { useState, useMemo, useRef } from 'react'
import FadeUp from '../shared/FadeUp'
import { startLocations, getStopsForStart, getStartsForStop, filterRoutes } from '../../data/shuttleData'
import asset from '../../utils/basePath'
import useT from '../../i18n/useT'

export default function ShuttleServicePage() {
  const [selectedStart, setSelectedStart] = useState('')
  const [selectedStop, setSelectedStop] = useState('')
  const t = useT()

  const availableStops = useMemo(() => getStopsForStart(selectedStart), [selectedStart])
  const availableStarts = useMemo(() => {
    if (selectedStop) return getStartsForStop(selectedStop)
    return startLocations
  }, [selectedStop])

  const filteredRoutes = useMemo(() => filterRoutes(selectedStart, selectedStop), [selectedStart, selectedStop])

  const handleStartChange = (e) => {
    setSelectedStart(e.target.value)
    // Reset stop if it's no longer valid
    if (e.target.value) {
      const validStops = getStopsForStart(e.target.value)
      if (selectedStop && !validStops.includes(selectedStop)) {
        setSelectedStop('')
      }
    }
  }

  const handleStopChange = (e) => {
    setSelectedStop(e.target.value)
    if (e.target.value) {
      const validStarts = getStartsForStop(e.target.value)
      if (selectedStart && !validStarts.includes(selectedStart)) {
        setSelectedStart('')
      }
    }
  }

  const heroRef = useRef(null)

  const scrollToNext = () => {
    const next = heroRef.current?.nextElementSibling
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section ref={heroRef} className="fullscreen coverme" style={{ backgroundImage: `url(${asset('/images/files/taxi-service.jpg')})` }}>
        <div className="arrow-down taxi-arrow" onClick={scrollToNext} role="button" aria-label="Scroll down"></div>
      </section>

      <section className="taxi-items">
        <div>
          <FadeUp>
            <h2>{t('shuttle.title')}</h2>
          </FadeUp>
          <p>{t('shuttle.description')}</p>
        </div>
      </section>

      <section className="taxi-items">
        <FadeUp>
          <h2>{t('shuttle.calculate')}</h2>
        </FadeUp>
        <div className="taxi-trip-selector">
          <FadeUp>
            <div className="filter-container">
              <select value={selectedStart} onChange={handleStartChange}>
                <option value="">{t('shuttle.from')}</option>
                {availableStarts.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select value={selectedStop} onChange={handleStopChange}>
                <option value="">{t('shuttle.to')}</option>
                {availableStops.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </FadeUp>
        </div>

        <FadeUp>
          <div className="taxi-list">
            <div className="taxi-list-row" style={{ display: 'contents' }}>
              <div className="taxi-list-row-from">{t('shuttle.fromHeader')}</div>
              <div className="taxi-list-row-to">{t('shuttle.toHeader')}</div>
              <div className="taxi-list-row-duration">{t('shuttle.duration')}</div>
              <div className="taxi-list-row-sedan">{t('shuttle.sedan')}<span className="no-mobile"> {t('shuttle.sedanDetails')}</span></div>
              <div className="taxi-list-row-minivan">{t('shuttle.minivan')}<span className="no-mobile"> {t('shuttle.minivanDetails')}</span></div>
              <div className="taxi-list-row-minibus">{t('shuttle.minibus')}<span className="no-mobile"> {t('shuttle.minibusDetails')}</span></div>
            </div>

            {filteredRoutes.map((route, i) => (
              <div
                key={`${route.start}-${route.stop}-${i}`}
                className="taxi-list-row active"
              >
                <div className="taxi-list-row-from">{route.start}</div>
                <div className="taxi-list-row-to">{route.stop}</div>
                <div className="taxi-list-row-duration">{route.duration}</div>
                <div className="taxi-list-row-sedan">€ {route.sedan}</div>
                <div className="taxi-list-row-minivan">€ {route.minivan}</div>
                <div className="taxi-list-row-minibus">€ {route.minibus}</div>
              </div>
            ))}

            {filteredRoutes.length === 0 && (selectedStart || selectedStop) && (
              <div className="taxi-list-row active">
                <div className="taxi-list-row-from" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                  {t('shuttle.noRoutes')}
                </div>
              </div>
            )}
          </div>
        </FadeUp>
      </section>
    </>
  )
}
