import { useState } from 'react'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import asset from '../../utils/basePath'

export default function BlurUpBackground({ src, thumbSrc, className = '', style = {}, children }) {
  const [ref, isIntersecting] = useIntersectionObserver()
  const [loaded, setLoaded] = useState(false)

  const fullSrc = asset(src)
  const thumb = thumbSrc ? asset(thumbSrc) : (src ? asset(src.replace('/images/files/', '/images/files-thumb/')) : '')

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        ...style,
        backgroundImage: loaded ? `url(${fullSrc})` : `url(${thumb})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {isIntersecting && !loaded && (
        <img
          src={fullSrc}
          alt=""
          style={{ display: 'none' }}
          onLoad={() => setLoaded(true)}
        />
      )}
      {children}
    </div>
  )
}
