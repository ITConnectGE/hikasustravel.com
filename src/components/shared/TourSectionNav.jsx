import { useState, useEffect, useRef, useCallback } from 'react'
import useT from '../../i18n/useT'

export default function TourSectionNav({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '')
  const [isFixed, setIsFixed] = useState(false)
  const navRef = useRef(null)
  const sentinelRef = useRef(null)
  const t = useT()

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const onScroll = useCallback(() => {
    const offset = 120
    let current = sections[0]?.id || ''

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= offset) current = section.id
      }
    }

    setActiveId(current)
  }, [sections])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  // Use IntersectionObserver on sentinel to toggle fixed positioning.
  // rootMargin offsets the root's top edge by the fixed-nav offset (matching
  // .td-nav--fixed top: 64px desktop / 80px at <=600px) so the nav pins the
  // instant it reaches the bottom of the sticky site bar instead of the top
  // of the viewport. Without it the nav briefly slides up UNDER the site bar
  // during scroll and its top edge (e.g. the "Accommodation" tab) is clipped
  // before it snaps into place.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    // <=900px uses the compact 80px fixed header (see styles.css); above that
    // the section nav sits 64px below the ~51px sticky site bar.
    const mq = window.matchMedia('(max-width: 900px)')
    let observer

    const setup = () => {
      if (observer) observer.disconnect()
      const topOffset = mq.matches ? 80 : 64
      observer = new IntersectionObserver(
        ([entry]) =>
          // Pin only once the nav has actually scrolled up to the offset line.
          // The boundingClientRect.top guard prevents a boundary case: when the
          // hero is ~one viewport tall the sentinel sits right at the fold and
          // isIntersecting can read false at the very top of the page, which
          // would pin the nav while the full-size site header/logo is still on
          // screen — overlapping the nav (e.g. "Accommodation") at 601-900px
          // widths where there is no compact sticky header bar.
          setIsFixed(!entry.isIntersecting && entry.boundingClientRect.top <= topOffset),
        { threshold: 0, rootMargin: `-${topOffset}px 0px 0px 0px` }
      )
      observer.observe(sentinel)
    }

    setup()
    mq.addEventListener('change', setup)
    return () => {
      if (observer) observer.disconnect()
      mq.removeEventListener('change', setup)
    }
  }, [])

  // scroll active tab into view on mobile
  useEffect(() => {
    if (!navRef.current) return
    const active = navRef.current.querySelector('.td-nav__link--active')
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeId])

  return (
    <>
      <div ref={sentinelRef} className="td-nav-sentinel" />
      <nav className={`td-nav${isFixed ? ' td-nav--fixed' : ''}`} ref={navRef} aria-label="Tour sections">
        <div className="td-nav__inner">
          {sections.map(({ id, labelKey }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`td-nav__link${activeId === id ? ' td-nav__link--active' : ''}`}
              onClick={(e) => handleClick(e, id)}
              aria-current={activeId === id ? 'true' : undefined}
            >
              {t(labelKey)}
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
