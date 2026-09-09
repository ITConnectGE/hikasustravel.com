import { useCallback, useEffect, useRef, useState } from 'react'
import { GalleryLightbox } from './Gallery'
import useT from '../../i18n/useT'

/**
 * Makes the editorial photos inside a destination page's body expandable in
 * the shared full-screen viewer (the same GalleryLightbox the tour galleries
 * and the hotel panels open).
 *
 * The body of a region, city, tourist-site or things-to-do page is one
 * container (`contentRef` on each page): locale HTML rendered through
 * dangerouslySetInnerHTML — `<figure class="body-img">`,
 * `<figure class="city-body-figure">` and the bare `<img class="wine-img">`
 * photos — plus the JSX BodyFigure/portrait inlines CityPage and SitePage
 * weave between chunks. Everything that is NOT body copy sits OUTSIDE that
 * container: the hero (a CSS background above the section), the EntityTours
 * row, the things-to-do CTA, the FAQ accordion and every card grid. So "an
 * <img> inside the container" IS the content-image role; hero and card imagery
 * can never be reached from here, and no page-by-page opt-in is needed.
 *
 * Two structural exclusions on top of that:
 *   - an <img> inside an <a> is navigation (the link keeps its click);
 *   - anything under a `data-no-lightbox` ancestor is left alone — an escape
 *     hatch for a future decorative asset, unused by any page today.
 *
 * Events are delegated on the container, exactly like the `a[data-internal]`
 * interception each page already runs on the same element, so nothing has to
 * be re-bound when a locale switch replaces the innerHTML. Eligible images are
 * marked `data-lightbox` (drives the pointer cursor) and made focusable so the
 * keyboard path matches the tour tiles: Enter/Space opens, Escape closes, and
 * focus returns to the photo that opened the viewer. The marking runs after
 * hydration, so the prerendered HTML is byte-identical to before.
 *
 * All eligible photos on the page form one collection in DOM order, so the
 * viewer's existing previous/next arrows, arrow keys, swipe and `n / N`
 * counter work across the page's editorial images.
 */
const MARK = 'data-lightbox'

function isEligible(img, root) {
  if (!root.contains(img)) return false
  if (img.closest('a')) return false
  if (img.closest('[data-no-lightbox]')) return false
  return true
}

/* The expanded view wants the biggest rendition the page ships. Body figures
   are <picture>s with AVIF + WebP ladders, so take the top `w` rung of the
   WebP <source> (the same choice the tour lightbox makes from `widths`). An
   <img> with its own srcset is read the same way; a plain <img> falls back to
   whatever the browser resolved. */
function largestSource(img) {
  const picture = img.closest('picture')
  const source = picture
    ? picture.querySelector('source[type="image/webp"]') || picture.querySelector('source[srcset]')
    : null
  const srcset = source ? source.getAttribute('srcset') : img.getAttribute('srcset')
  if (srcset) {
    let best = null
    for (const candidate of srcset.split(',')) {
      const [url, descriptor] = candidate.trim().split(/\s+/)
      if (!url) continue
      const w = descriptor && descriptor.endsWith('w') ? parseFloat(descriptor) : 0
      if (!best || w > best.w) best = { url, w }
    }
    if (best) return best.url
  }
  return img.currentSrc || img.src
}

/* Reuses the photo's own metadata: the visible <figcaption> (when the figure
   has one) becomes the viewer caption, the <img alt> stays the alt. A photo
   without a caption gets none in the viewer either. */
function toItem(img) {
  const figure = img.closest('figure')
  const figcaption = figure ? figure.querySelector('figcaption') : null
  const caption = figcaption ? figcaption.textContent.trim() : ''
  return {
    url: largestSource(img),
    lightboxAlt: img.getAttribute('alt') || '',
    caption: caption || undefined,
  }
}

export default function ContentImageLightbox({ containerRef }) {
  const t = useT()
  const [images, setImages] = useState(null)
  const [index, setIndex] = useState(null)
  const opener = useRef(null)

  const open = useCallback((img, root) => {
    const all = Array.from(root.querySelectorAll('img')).filter((el) => isEligible(el, root))
    const i = all.indexOf(img)
    if (i < 0) return
    opener.current = img
    setImages(all.map(toItem))
    setIndex(i)
  }, [])

  const close = useCallback(() => {
    setIndex(null)
    setImages(null)
    if (opener.current instanceof HTMLElement) opener.current.focus()
    opener.current = null
  }, [])

  /* No dependency array on purpose: the container's innerHTML is replaced
     whenever the page re-renders with new content (locale switch, another
     slug on the same route), and those fresh <img> nodes need marking. Adding
     and removing two listeners per render is negligible. */
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    for (const img of root.querySelectorAll('img')) {
      if (!isEligible(img, root)) continue
      img.setAttribute(MARK, '')
      if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '0')
    }
    const onClick = (e) => {
      const img = e.target instanceof Element ? e.target.closest('img') : null
      if (!img || !isEligible(img, root)) return
      e.preventDefault()
      open(img, root)
    }
    const onKeyDown = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      const img = e.target
      if (!(img instanceof HTMLImageElement) || !isEligible(img, root)) return
      e.preventDefault()
      open(img, root)
    }
    root.addEventListener('click', onClick)
    root.addEventListener('keydown', onKeyDown)
    return () => {
      root.removeEventListener('click', onClick)
      root.removeEventListener('keydown', onKeyDown)
    }
  })

  if (index === null || !images) return null
  return (
    <GalleryLightbox
      images={images}
      startIndex={index}
      onClose={close}
      label={t('tour.viewImage')}
    />
  )
}
