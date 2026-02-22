import FadeUp from './FadeUp'
import BlurUpBackground from './BlurUpBackground'

export default function Gallery({ images }) {
  if (!images || images.length === 0) return null

  return (
    <div className="gallery-grid">
      {images.map((img, index) => {
        const caption = img.caption ? img.caption.replace(/<[^>]*>/g, '') : ''
        const description = img.description || ''
        return (
          <FadeUp key={index}>
            <div className="gallery-card">
              <BlurUpBackground src={img.src} className="gallery-card__img" />
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
  )
}
