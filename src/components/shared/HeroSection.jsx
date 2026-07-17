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

export default function HeroSection({ image, imageAvif, title, className = '', isTaxi = false, bgClass = '' }) {
  const sectionRef = useRef(null)

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  // A page may supply its own background via a CSS class (`bgClass`) — used when
  // the hero needs a responsive image-set() ladder and/or a non-default
  // background-position that an inline single-width background can't express
  // (e.g. `.hero--juta`). In that case we omit the inline background-image so the
  // class fully controls it; every other hero is unchanged (bgClass = '').
  return (
    <section
      ref={sectionRef}
      className={`fullscreen coverme ${isTaxi ? 'taxi-item' : ''} ${bgClass} ${className}`}
      style={bgClass ? undefined : { backgroundImage: heroBackground(image, imageAvif) }}
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
