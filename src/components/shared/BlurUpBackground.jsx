import { useState } from 'react'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'

export default function BlurUpBackground({ src, thumbSrc, className = '', style = {}, children }) {
  const [ref, isIntersecting] = useIntersectionObserver()
  const [loaded, setLoaded] = useState(false)

  const thumb = thumbSrc || (src ? src.replace('/images/files/', '/images/files-thumb/') : '')

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        ...style,
        backgroundImage: loaded ? `url(${src})` : `url(${thumb})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {isIntersecting && !loaded && (
        <img
          src={src}
          alt=""
          style={{ display: 'none' }}
          onLoad={() => setLoaded(true)}
        />
      )}
      {children}
    </div>
  )
}
