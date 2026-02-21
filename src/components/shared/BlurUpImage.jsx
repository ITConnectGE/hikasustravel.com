import { useState } from 'react'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import asset from '../../utils/basePath'

export default function BlurUpImage({ src, thumbSrc, alt = '', className = '', style = {} }) {
  const [ref, isIntersecting] = useIntersectionObserver()
  const [loaded, setLoaded] = useState(false)

  const fullSrc = asset(src)
  const thumb = thumbSrc ? asset(thumbSrc) : asset(src.replace('/images/files/', '/images/files-thumb/'))

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
          src={fullSrc}
          alt={alt}
          className={`blur-up-full${loaded ? ' loaded' : ''}`}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  )
}
