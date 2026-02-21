import { useState } from 'react'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'

export default function BlurUpImage({ src, thumbSrc, alt = '', className = '', style = {} }) {
  const [ref, isIntersecting] = useIntersectionObserver()
  const [loaded, setLoaded] = useState(false)

  // Generate thumb path: /images/files/foo.jpg → /images/files-thumb/foo.jpg
  const thumb = thumbSrc || src.replace('/images/files/', '/images/files-thumb/')

  return (
    <div ref={ref} className={`blur-up-container ${className}`} style={style}>
      <img
        src={thumb}
        alt=""
        className={`blur-up-thumb${loaded ? ' loaded' : ''}`}
        aria-hidden="true"
      />
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          className={`blur-up-full${loaded ? ' loaded' : ''}`}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  )
}
