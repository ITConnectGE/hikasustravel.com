import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import FadeUp from './FadeUp'
import BlurUpBackground from './BlurUpBackground'
import asset from '../../utils/basePath'
import useT from '../../i18n/useT'

const INITIAL_COUNT = 8

function GalleryLightbox({ image, onClose }) {
  const t = useT()
  const closeBtnRef = useRef(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    closeBtnRef.current?.focus()

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  if (!image) return null

  const alt = image.caption ? image.caption.replace(/<[^>]*>/g, '') : (image.description || '')

  return createPortal(
    <div className="gallery-lightbox-backdrop" onClick={onClose}>
      <button ref={closeBtnRef} className="gallery-lightbox__close" onClick={onClose} aria-label={t('hotel.close')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <img
        src={asset(image.src)}
        alt={alt}
        className="gallery-lightbox__img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  )
}

export default function Gallery({ images }) {
  const [expanded, setExpanded] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const lastFocused = useRef(null)
  const t = useT()

  if (!images || images.length === 0) return null

  const visible = expanded ? images : images.slice(0, INITIAL_COUNT)
  const hasMore = images.length > INITIAL_COUNT

  const openLightbox = (img, el) => {
    lastFocused.current = el
    setLightbox(img)
  }

  const closeLightbox = () => {
    setLightbox(null)
    lastFocused.current?.focus()
  }

  return (
    <>
      <div className="gallery-grid">
        {visible.map((img, index) => {
          const caption = img.caption ? img.caption.replace(/<[^>]*>/g, '') : ''
          const description = img.description || ''
          const day = img.day || ''
          return (
            <FadeUp key={index}>
              <div className="gallery-card">
                <div
                  className="gallery-card__img-wrap"
                  role="button"
                  tabIndex={0}
                  aria-label={caption ? `${t('tour.viewImage')}: ${caption}` : t('tour.viewImage')}
                  onClick={(e) => openLightbox(img, e.currentTarget)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openLightbox(img, e.currentTarget)
                    }
                  }}
                >
                  <BlurUpBackground src={img.src} className="gallery-card__img" />
                  {day && <span className="gallery-card__day">{day}</span>}
                </div>
                {(caption || description) && (
                  <div className="gallery-card__info">
                    {caption && <h4 className="gallery-card__location">{caption}</h4>}
                    {description && <p className="gallery-card__desc">{description}</p>}
                  </div>
                )}
              </div>
            </FadeUp>
          )
        })}
      </div>
      {hasMore && !expanded && (
        <div className="gallery-show-more">
          <button className="gallery-show-more__btn" onClick={() => setExpanded(true)}>
            {t('tour.showMore', { count: images.length - INITIAL_COUNT })}
          </button>
        </div>
      )}
      {lightbox && <GalleryLightbox image={lightbox} onClose={closeLightbox} />}
    </>
  )
}
