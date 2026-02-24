import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { embassies, emergencyNumbers, filterEmbassies } from '../../data/embassyData'
import { initializeMap } from '../../utils/mapUtils'

function countryCodeToFlag(code) {
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  )
}

function getUserCountryCode() {
  try {
    const lang = navigator.language || ''
    const parts = lang.split('-')
    if (parts.length >= 2) return parts[1].toUpperCase()
  } catch { /* ignore */ }
  return null
}

export default function EmbassiesPage() {
  const t = useT()
  const { lang } = useLang()
  const seo = getSEO('embassies', lang)
  const [query, setQuery] = useState('')
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const highlightedRef = useRef(null)

  const filtered = useMemo(() => filterEmbassies(query), [query])

  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Embassies in Georgia',
    itemListElement: embassies.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Embassy',
        name: e.embassyName,
        address: {
          '@type': 'PostalAddress',
          streetAddress: e.address,
          addressLocality: 'Tbilisi',
          addressCountry: 'GE',
        },
        telephone: e.phone,
        url: e.website || undefined,
      },
    })),
  }), [])

  useSEO({ ...seo, lang, path: 'embassies', image: '/images/files/georgia-tour-03.jpg', jsonLd })

  // Initialize map
  useEffect(() => {
    const map = initializeMap('embassies-map', [44.7930, 41.7151], 12)
    mapRef.current = map

    embassies.forEach(e => {
      const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '280px' }).setHTML(`
        <div style="font-family: inherit;">
          <h3 style="margin: 0 0 6px; padding: 0; font-size: 15px; font-weight: bold; line-height: 1.2;">
            ${countryCodeToFlag(e.countryCode)} ${e.countryName}
          </h3>
          <p style="margin: 0 0 4px; padding: 0; font-size: 13px; line-height: 1.4;">${e.address}</p>
          <p style="margin: 0; padding: 0; font-size: 13px;">
            <a href="tel:${e.phone.replace(/\s/g, '')}" style="color: #2b4e47;">${e.phone}</a>
          </p>
        </div>
      `)

      const marker = new mapboxgl.Marker({ color: '#2b4e47' })
        .setLngLat(e.coordinates)
        .setPopup(popup)
        .addTo(map)

      markersRef.current[e.id] = marker
    })

    return () => {
      Object.values(markersRef.current).forEach(m => m.remove())
      markersRef.current = {}
      map.remove()
    }
  }, [])

  // Filter markers when search changes
  useEffect(() => {
    const filteredIds = new Set(filtered.map(e => e.id))
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement()
      if (el) el.style.display = filteredIds.has(id) ? '' : 'none'
    })
  }, [filtered])

  // Auto-highlight user's embassy on mount
  useEffect(() => {
    const code = getUserCountryCode()
    if (code) {
      const match = embassies.find(e => e.countryCode === code)
      if (match) {
        highlightedRef.current = match.id
        requestAnimationFrame(() => {
          const el = document.getElementById(`embassy-${match.id}`)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      }
    }
  }, [])

  const flyToEmbassy = useCallback((e) => {
    const map = mapRef.current
    if (!map) return
    map.flyTo({ center: e.coordinates, zoom: 15, duration: 1000 })
    const marker = markersRef.current[e.id]
    if (marker) marker.togglePopup()
  }, [])

  return (
    <>
      <HeroSection image="/images/files/georgia-tour-03.jpg" title={t('embassies.heroTitle')} />

      {/* Emergency Numbers */}
      <section className="page-items">
        <FadeUp>
          <h2 className="embassy-section-title">{t('embassies.emergencyTitle')}</h2>
          <div className="emergency-cards">
            <a href="tel:112" className="emergency-card">
              <span className="emergency-card__number">{emergencyNumbers.universal}</span>
              <span className="emergency-card__label">{t('embassies.emergencyUniversal')}</span>
            </a>
          </div>
        </FadeUp>
      </section>

      {/* Search & Map */}
      <section className="page-items">
        <FadeUp>
          <h2 className="embassy-section-title">{t('embassies.findYourEmbassy')}</h2>
          <div className="embassy-search-wrap">
            <input
              type="text"
              className="embassy-search"
              placeholder={t('embassies.searchPlaceholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div className="embassy-map-container">
            <div id="embassies-map" className="embassy-map" />
          </div>
        </FadeUp>
      </section>

      {/* Embassy Cards */}
      <section className="page-items">
        <FadeUp>
          <p className="embassy-count">
            {t('embassies.embassiesCount').replace('{count}', filtered.length)}
          </p>

          {filtered.length === 0 && (
            <p className="embassy-no-results">{t('embassies.noResults')}</p>
          )}

          <div className="embassy-grid">
            {filtered.map(e => (
              <div
                key={e.id}
                id={`embassy-${e.id}`}
                className={`embassy-card${highlightedRef.current === e.id ? ' embassy-card--highlighted' : ''}`}
              >
                <div className="embassy-card__header">
                  <span className="embassy-card__flag">{countryCodeToFlag(e.countryCode)}</span>
                  <div>
                    <h3 className="embassy-card__country">{e.countryName}</h3>
                    <p className="embassy-card__name">{e.embassyName}</p>
                  </div>
                </div>

                <div className="embassy-card__details">
                  <div className="embassy-card__row">
                    <span className="embassy-card__label">{t('embassies.address')}</span>
                    <span>{e.address}</span>
                  </div>
                  <div className="embassy-card__row">
                    <span className="embassy-card__label">{t('embassies.phone')}</span>
                    <a href={`tel:${e.phone.replace(/\s/g, '')}`}>{e.phone}</a>
                  </div>
                  {e.email && (
                    <div className="embassy-card__row">
                      <span className="embassy-card__label">{t('embassies.email')}</span>
                      <a href={`mailto:${e.email}`}>{e.email}</a>
                    </div>
                  )}
                  {e.website && (
                    <div className="embassy-card__row">
                      <span className="embassy-card__label">{t('embassies.website')}</span>
                      <a href={e.website} target="_blank" rel="noopener noreferrer">
                        {e.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </a>
                    </div>
                  )}
                  <div className="embassy-card__row">
                    <span className="embassy-card__label">{t('embassies.workingHours')}</span>
                    <span>{e.workingHours}</span>
                  </div>
                </div>

                <button
                  className="embassy-card__map-btn"
                  onClick={() => flyToEmbassy(e)}
                >
                  {t('embassies.viewOnMap')}
                </button>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>
    </>
  )
}
