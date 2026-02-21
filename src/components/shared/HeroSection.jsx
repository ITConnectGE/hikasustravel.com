export default function HeroSection({ image, title, className = '', isTaxi = false }) {
  return (
    <section
      className={`fullscreen coverme ${isTaxi ? 'taxi-item' : ''} ${className}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="hometop-item">
        <h1 className={isTaxi ? 'taxiH1' : ''}>{title}</h1>
      </div>
      <div className={`arrow-down${isTaxi ? ' taxi-arrow' : ''}`}></div>
    </section>
  )
}
