import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const MAP_STYLE = 'mapbox://styles/matthekim/cm9u0hfgr001001s941ym33e3'

export function initializeMap(containerId, coordinates, zoom) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const map = new mapboxgl.Map({
    container: containerId,
    style: MAP_STYLE,
    center: coordinates,
    zoom: zoom,
    dragPan: !isTouchDevice,
    cooperativeGestures: isTouchDevice,
  })
  map.addControl(new mapboxgl.NavigationControl())
  map.touchZoomRotate.disable()
  map.scrollZoom.disable()
  return map
}

export function initializeTourMap(containerId, lat, lng, zoom) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const map = new mapboxgl.Map({
    container: containerId,
    style: MAP_STYLE,
    center: [lng, lat],
    zoom: zoom,
    scrollZoom: false,
    dragPan: !isTouchDevice,
    dragRotate: false,
    doubleClickZoom: false,
    touchZoomRotate: false,
    cooperativeGestures: isTouchDevice,
  })
  map.addControl(new mapboxgl.NavigationControl())
  return map
}

export function addCustomMarker(map, coordinates, svgUrl, width, height, offsetX = 0, offsetY = 0) {
  const markerElement = document.createElement('div')
  const img = document.createElement('img')
  img.src = svgUrl
  img.style.width = `${width}px`
  img.style.height = `${height}px`
  img.style.display = 'block'
  markerElement.appendChild(img)

  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: 'bottom',
    offset: [offsetX, offsetY],
  })
    .setLngLat(coordinates)
    .addTo(map)

  return marker
}

export function addCustomMarkerWithPopup(map, coordinates, svgUrl, width, height, offsetX, offsetY, popupTitle, popupText) {
  const markerElement = document.createElement('div')
  const img = document.createElement('img')
  img.src = svgUrl
  img.style.width = `${width}px`
  img.style.height = `${height}px`
  img.style.display = 'block'
  img.style.cursor = 'pointer'
  markerElement.appendChild(img)

  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: 'bottom',
    offset: [offsetX, offsetY],
  })
    .setLngLat(coordinates)
    .addTo(map)

  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: true,
    closeOnClick: true,
    maxWidth: '300px',
  }).setHTML(`
    <div style="font-family: inherit;">
      <h3 style="margin: 0 0 8px 0; padding: 0; font-size: 16px; font-weight: bold; line-height: 1.2;">${popupTitle}</h3>
      <p style="margin: 0; padding: 0; font-size: 14px; line-height: 1.4;">${popupText}</p>
    </div>
  `)

  marker.setPopup(popup)
  return marker
}

export function catmullRomSpline(points, segments = 50) {
  let curve = []

  function interpolate(p0, p1, p2, p3, t) {
    const t2 = t * t
    const t3 = t2 * t
    return [
      0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
      0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
    ]
  }

  const extendedPoints = [points[0], ...points, points[points.length - 1]]
  for (let i = 1; i < extendedPoints.length - 2; i++) {
    for (let t = 0; t < 1; t += 1 / segments) {
      curve.push(interpolate(extendedPoints[i - 1], extendedPoints[i], extendedPoints[i + 1], extendedPoints[i + 2], t))
    }
  }
  return curve
}

export function addSmoothCurve(map, coordinates) {
  const smoothPoints = catmullRomSpline(coordinates, 100)

  map.on('load', function () {
    if (!map.getSource('smooth-curve')) {
      map.addSource('smooth-curve', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates: smoothPoints } }],
        },
      })
      map.addLayer({
        id: 'smooth-curve-layer',
        type: 'line',
        source: 'smooth-curve',
        paint: { 'line-color': '#f7f0e6', 'line-width': 4, 'line-opacity': 0.7 },
      })
    }
  })
}

export function addLineBetweenCoordinates(map, coordinates) {
  map.on('load', function () {
    const lineData = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates } }],
    }
    if (!map.getSource('line-source')) {
      map.addSource('line-source', { type: 'geojson', data: lineData })
      map.addLayer({
        id: 'line-layer',
        type: 'line',
        source: 'line-source',
        paint: { 'line-color': '#2b4e47', 'line-width': 4, 'line-opacity': 0.85 },
      })
    }
  })
}

export function addGeorgiaBorders(map) {
  map.on('load', () => {
    map.addSource('country-boundaries', {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1',
    })
    map.addLayer({
      id: 'georgia-border',
      type: 'line',
      source: 'country-boundaries',
      'source-layer': 'country_boundaries',
      filter: ['==', 'iso_3166_1_alpha_3', 'GEO'],
      paint: { 'line-color': '#2B4E47', 'line-width': 3, 'line-opacity': 1, 'line-blur': 0 },
    })
    map.addLayer({
      id: 'georgia-fill',
      type: 'fill',
      source: 'country-boundaries',
      'source-layer': 'country_boundaries',
      filter: ['==', 'iso_3166_1_alpha_3', 'GEO'],
      paint: { 'fill-color': '#FFFFFF', 'fill-opacity': 0 },
    })
  })
}
