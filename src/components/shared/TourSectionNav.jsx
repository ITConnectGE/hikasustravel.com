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

  // Use IntersectionObserver on sentinel to toggle fixed positioning
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsFixed(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
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
