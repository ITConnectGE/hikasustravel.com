import { useState, useMemo } from 'react'
import FadeUp from '../shared/FadeUp'
import { startLocations, getStopsForStart, getStartsForStop, filterRoutes } from '../../data/shuttleData'
import asset from '../../utils/basePath'

export default function ShuttleServicePage() {
  const [selectedStart, setSelectedStart] = useState('')
  const [selectedStop, setSelectedStop] = useState('')

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

  return (
    <>
      <section className="fullscreen coverme" style={{ backgroundImage: `url(${asset('/images/files/taxi-service.jpg')})` }}>
        <div className="arrow-down taxi-arrow"></div>
      </section>

      <section className="taxi-items">
        <div>
          <FadeUp>
            <h2>Shuttle Service</h2>
          </FadeUp>
          <p>Hikasus Travel offers private transfers from any city of Georgia, providing safe and convenient transportation in sedans, minivans, minibuses, and larger vehicles. Whether you're traveling from Tbilisi to Batumi, Yerevan (Armenia), Kutaisi, Kazbegi, or any other destination – or simply return – our professional drivers ensure a smooth and hassle-free journey. Ideal for solo travelers, families, and groups, our transfer services are comfortable, punctual, and competitively priced. Book your transfer today and explore Georgia with ease!</p>
        </div>
      </section>

      <section className="taxi-items">
        <FadeUp>
          <h2>Calculate your trip</h2>
        </FadeUp>
        <div className="taxi-trip-selector">
          <FadeUp>
            <div className="filter-container">
              <select value={selectedStart} onChange={handleStartChange}>
                <option value="">From:</option>
                {availableStarts.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select value={selectedStop} onChange={handleStopChange}>
                <option value="">To:</option>
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
              <div className="taxi-list-row-duration">Duration</div>
              <div className="taxi-list-row-sedan">Sedan<span className="no-mobile"> (1-3 p, 3 bags)</span></div>
              <div className="taxi-list-row-minivan">Minivan<span className="no-mobile"> (4-6 p, 8 bags)</span></div>
              <div className="taxi-list-row-minibus">Minibus<span className="no-mobile"> (7-15 p, 17 bags)</span></div>
            </div>

            {filteredRoutes.map((route, i) => (
              <div
                key={`${route.start}-${route.stop}-${i}`}
                className="taxi-list-row active"
              >
                <div className="taxi-list-row-duration">{route.duration}</div>
                <div className="taxi-list-row-sedan">€ {route.sedan}</div>
                <div className="taxi-list-row-minivan">€ {route.minivan}</div>
                <div className="taxi-list-row-minibus">€ {route.minibus}</div>
              </div>
            ))}

            {filteredRoutes.length === 0 && (selectedStart || selectedStop) && (
              <div className="taxi-list-row active">
                <div className="taxi-list-row-duration" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                  No routes found for the selected combination.
                </div>
              </div>
            )}
          </div>
        </FadeUp>
      </section>
    </>
  )
}
