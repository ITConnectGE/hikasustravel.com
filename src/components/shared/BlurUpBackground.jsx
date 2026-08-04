import { useState } from 'react'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import asset from '../../utils/basePath'

/**
 * Build a CSS `background-image` value safely.
 *
 * ⚠️ A CSS `url()` is a TOKEN, not a string: an *unquoted* url() may not contain
 * unescaped parentheses. This component used to interpolate the path raw —
 * `url(${src})` — so a perfectly valid file like
 * `/images/files/Qvevri%20(Clay%20Vessels).jpg` produced
 * `url(/images/files/Qvevri%20(Clay%20Vessels).jpg)`, which the CSS parser
 * rejects, dropping the WHOLE declaration. The card then painted as an empty
 * block. The lightbox was unaffected because it renders a real `<img src>`,
 * which is why the photo only appeared once you expanded it.
 *
 * Quoting makes parentheses, spaces and commas legal; the escape covers the
 * only characters that could still break out of the quotes.
 *
 * Returns `undefined` for an empty path so the caller omits `background-image`
 * entirely — `url("")` would resolve against the current document and make the
 * browser fetch the HTML page as an image.
 */
const cssUrl = (u) => (u ? `url("${String(u).replace(/["\\]/g, '\\$&')}")` : undefined)

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
        backgroundImage: loaded ? cssUrl(fullSrc) : cssUrl(thumb),
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
