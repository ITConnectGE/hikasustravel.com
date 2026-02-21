import { useRef } from 'react'
import asset from '../../utils/basePath'

export default function HeroSection({ image, title, className = '', isTaxi = false }) {
  const sectionRef = useRef(null)

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className={`fullscreen coverme ${isTaxi ? 'taxi-item' : ''} ${className}`}
      style={{ backgroundImage: `url(${asset(image)})` }}
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
