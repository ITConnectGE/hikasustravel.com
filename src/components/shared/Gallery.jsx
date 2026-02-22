import { useState } from 'react'
import FadeUp from './FadeUp'
import BlurUpBackground from './BlurUpBackground'
import useT from '../../i18n/useT'

const INITIAL_COUNT = 8

export default function Gallery({ images }) {
  const [expanded, setExpanded] = useState(false)
  const t = useT()

  if (!images || images.length === 0) return null

  const visible = expanded ? images : images.slice(0, INITIAL_COUNT)
  const hasMore = images.length > INITIAL_COUNT

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
                <div className="gallery-card__img-wrap">
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
    </>
  )
}
