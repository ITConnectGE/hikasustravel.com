import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import useT from '../../i18n/useT'

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function AmenityIcon({ type }) {
  const props = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  switch (type) {
    case 'wifi': return <svg {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></svg>
    case 'restaurant': return <svg {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
    case 'ac': return <svg {...props}><path d="M12 2v4" /><path d="m6.8 15-3.5 2" /><path d="m20.7 17-3.5-2" /><path d="M6.8 15a6 6 0 1 0 10.4 0" /><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5C7.5 9 9.5 11 12 11s4.5-2 4.5-4.5A4.5 4.5 0 0 0 12 2Z" /></svg>
    case 'parking': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></svg>
    case 'concierge': return <svg {...props}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><path d="M6 1v3" /><path d="M10 1v3" /><path d="M14 1v3" /></svg>
    case 'terrace': return <svg {...props}><path d="M2 20h20" /><path d="M5 20v-6" /><path d="M19 20v-6" /><path d="M12 4l-8 10h16L12 4z" /></svg>
    case 'heating': return <svg {...props}><path d="M12 12c-2-2.67-4-4-4-5.5a4 4 0 1 1 8 0c0 1.5-2 2.83-4 5.5z" /><path d="M12 22c-4-4-8-6.5-8-10a8 8 0 1 1 16 0c0 3.5-4 6-8 10z" /></svg>
    case 'garden': return <svg {...props}><path d="M12 22V12" /><path d="M7 22h10" /><path d="M12 12C12 7 7 2 7 2s0 5-5 5c0 0 5 0 10 5z" /><path d="M12 12c0-5 5-10 5-10s0 5 5 5c0 0-5 0-10 5z" /></svg>
    case 'breakfast': return <svg {...props}><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
    case 'wine': return <svg {...props}><path d="M8 22h8" /><path d="M12 11v11" /><path d="M5.7 2h12.6L17 8.5c-.5 3-2.8 5.5-5 5.5s-4.5-2.5-5-5.5Z" /></svg>
    case 'pool': return <svg {...props}><path d="M2 16c.6.5 1.2 1 2.5 1C7 17 7 15 9.5 15c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M15.4 12.6a4 4 0 1 0-6.8-4.2" /><path d="M6 12V4h2v2" /></svg>
    default: return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
  }
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default function HotelModal({ hotel, onClose }) {
  const t = useT()

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  if (!hotel) return null

  const images = hotel.images || (hotel.image ? [{ src: hotel.image, alt: hotel.name }] : [])
  const galleryRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const scrollTo = useCallback((index) => {
    const el = galleryRef.current
    if (!el) return
    const target = Math.max(0, Math.min(index, images.length - 1))
    el.scrollTo({ left: target * el.offsetWidth, behavior: 'smooth' })
  }, [images.length])

  useEffect(() => {
    const el = galleryRef.current
    if (!el || images.length <= 1) return
    function onScroll() {
      const idx = Math.round(el.scrollLeft / el.offsetWidth)
      setActiveSlide(idx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [images.length])

  return createPortal(
    <div className="hotel-modal-backdrop" onClick={onClose}>
      <div className="hotel-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={hotel.name}>
        <div className="hotel-modal__hero">
          <div className="hotel-modal__gallery" ref={galleryRef}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt || hotel.name}
                title={img.alt || hotel.name}
                className="hotel-modal__img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button className="hotel-modal__arrow hotel-modal__arrow--prev" onClick={() => scrollTo(activeSlide - 1)} aria-label="Previous photo" style={{ display: activeSlide === 0 ? 'none' : undefined }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="hotel-modal__arrow hotel-modal__arrow--next" onClick={() => scrollTo(activeSlide + 1)} aria-label="Next photo" style={{ display: activeSlide === images.length - 1 ? 'none' : undefined }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <div className="hotel-modal__dots">
                {images.map((_, i) => (
                  <span key={i} className={`hotel-modal__dot${i === activeSlide ? ' hotel-modal__dot--active' : ''}`} onClick={() => scrollTo(i)} />
                ))}
              </div>
            </>
          )}
          <button className="hotel-modal__close" onClick={onClose} aria-label={t('hotel.close')}>
            <CloseIcon />
          </button>
        </div>

        <div className="hotel-modal__body">
          <div className="hotel-modal__header">
            <h3 className="hotel-modal__name">{hotel.name}</h3>
            {hotel.stars && (
              <div className="hotel-modal__stars">
                {Array.from({ length: hotel.stars }, (_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
            )}
          </div>

          <p className="hotel-modal__desc">{hotel.description}</p>

          <div className="hotel-modal__section">
            <h4 className="hotel-modal__section-title">{t('hotel.amenities')}</h4>
            <div className="hotel-modal__amenities">
              {hotel.amenities.map((a, i) => (
                <div key={i} className="hotel-modal__amenity">
                  <AmenityIcon type={a.icon} />
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hotel-modal__section">
            <h4 className="hotel-modal__section-title">{t('hotel.location')}</h4>
            <ul className="hotel-modal__locations">
              {hotel.locationHighlights.map((loc, i) => (
                <li key={i} className="hotel-modal__location">
                  <LocationIcon />
                  <span>{loc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
