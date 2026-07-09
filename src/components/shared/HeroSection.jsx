import { useRef } from 'react'
import asset from '../../utils/basePath'

// Build the hero background value. Default to a plain url() so every browser
// shows the WebP; when an AVIF variant is supplied and the browser supports
// CSS image-set(), upgrade to it so AVIF-capable browsers get the smaller file.
// The hero is a CSS background (not an <img>), so image-set() is where the
// responsive/AVIF handling lives.
function heroBackground(image, imageAvif) {
  const webp = `url(${asset(image)})`
  if (!imageAvif) return webp
  const imageSet = `image-set(url("${asset(imageAvif)}") type("image/avif"), url("${asset(image)}") type("image/webp"))`
  if (typeof window !== 'undefined' && window.CSS?.supports?.('background-image', imageSet)) return imageSet
  return webp
}

export default function HeroSection({ image, imageAvif, title, className = '', isTaxi = false }) {
  const sectionRef = useRef(null)

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className={`fullscreen coverme ${isTaxi ? 'taxi-item' : ''} ${className}`}
      style={{ backgroundImage: heroBackground(image, imageAvif) }}
    >
      <div className="hometop-item">
        <h1 className={isTaxi ? 'taxiH1' : ''}>{title}</h1>
      </div>
      <div
        className={`arrow-down${isTaxi ? ' taxi-arrow' : ''}`}
        onClick={scrollToNext}
        role="button"
        aria-label="Scroll down"
      ></div>
    </section>
  )
}
