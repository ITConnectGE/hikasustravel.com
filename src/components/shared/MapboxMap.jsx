import { useEffect, useRef, useState } from 'react'
import {
  initializeTourMap,
  initializeMap,
  addCustomMarker,
  addSmoothCurve,
  addGeorgiaBorders,
} from '../../utils/mapUtils'

export default function MapboxMap({
  id = 'tour-map',
  center,
  zoom = 7,
  markers = [],
  routeCoordinates = [],
  showGeorgiaBorders = false,
  className = 'page-map',
  isHomePage = false,
}) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const [isInteractive, setIsInteractive] = useState(isHomePage)

  useEffect(() => {
    if (!mapContainer.current || !center) return

    let map
    if (isHomePage) {
      map = initializeMap(id, center, zoom)
    } else {
      map = initializeTourMap(id, center[1], center[0], zoom)
    }
    mapRef.current = map

    if (showGeorgiaBorders) {
      addGeorgiaBorders(map)
    }

    // Add markers
    markers.forEach((m) => {
      addCustomMarker(
        map,
        m.coordinates,
        m.svgUrl || '/img/pennant.svg',
        m.width || 30,
        m.height || 36,
        m.offsetX || 0,
        m.offsetY || 0
      )
    })

    // Add route
    if (routeCoordinates.length > 1) {
      addSmoothCurve(map, routeCoordinates)
    }

    return () => {
      if (map) map.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, zoom, id])

  const handleClick = () => {
    if (!isInteractive) setIsInteractive(true)
  }

  return (
    <section>
      <div
        id={id}
        ref={mapContainer}
        className={`${className}${!isHomePage ? ' tour-map-container' : ''}${isInteractive ? ' map-interactive' : ''}`}
        onClick={handleClick}
        style={{ position: 'relative' }}
      />
    </section>
  )
}
