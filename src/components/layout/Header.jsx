import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { navLinks } from '../../data/siteData'
import asset from '../../utils/basePath'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import LocaleLink from '../../i18n/LocaleLink'
import LanguageSwitcher from './LanguageSwitcher'

function Caret() {
  return (
    <svg
      className="nav-dropdown__caret"
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function NavDropdown({ item, t, lang, pathname }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click / Escape — mirrors the LanguageSwitcher pattern.
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const label = t(item.labelKey)

  return (
    <span className={`nav-dropdown${open ? ' open' : ''}`} ref={ref}>
      <button
        type="button"
        className="nav-dropdown__toggle"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <Caret />
      </button>
      <div className="nav-dropdown__menu" role="menu" aria-label={label}>
        {item.children.map((child) => (
          <LocaleLink
            key={child.to}
            to={child.to}
            role="menuitem"
            className={pathname === `/${lang}${child.to}` ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            {t(child.labelKey)}
          </LocaleLink>
        ))}
      </div>
    </span>
  )
}

export default function Header({ variant = 'default' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const menuRef = useRef(null)
  const stickyThreshold = useRef(0)
  const menuHeight = useRef(0)
  const location = useLocation()
  const t = useT()
  const { lang } = useLang()

  // Close mobile menu on navigation - this is a legitimate sync with router state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    // On mobile the header is already position:fixed via CSS, so skip sticky logic
    if (window.innerWidth <= 900) return

    let ticking = false
    // Capture the initial offset once before any sticky toggle
    const menuEl = menuRef.current
    if (menuEl) {
      stickyThreshold.current = menuEl.offsetTop
      menuHeight.current = menuEl.offsetHeight
    }
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsSticky(window.scrollY >= stickyThreshold.current || window.scrollY > 300)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isTaxi = variant === 'taxi'
  const menuClass = `main-menu${isTaxi ? ' taxi-menu' : ''}${isSticky ? ' sticky' : ''}${menuOpen ? ' active' : ''}`

  return (
    <header className={isTaxi ? 'taxi-header' : ''} id="top">
      <div className="logo">
        <LocaleLink to="/" title="Home">
          <img src={asset('/img/hikasustravel.svg')} alt="Hikasus travel" />
        </LocaleLink>
      </div>

      <LanguageSwitcher />

      <button
        className={`hamburger${menuOpen ? ' active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
      </button>

      <nav className={menuClass} id="mainMenu" ref={menuRef}>
        {navLinks.map((link) =>
          link.children ? (
            <NavDropdown
              key={link.labelKey}
              item={link}
              t={t}
              lang={lang}
              pathname={location.pathname}
            />
          ) : (
            <span key={link.to}>
              <LocaleLink
                to={link.to}
                title={t(link.labelKey)}
                className={location.pathname === `/${lang}${link.to}` ? 'active' : ''}
              >
                {t(link.labelKey)}
              </LocaleLink>
            </span>
          )
        )}
      </nav>
      {isSticky && <div style={{ height: menuHeight.current }} />}
    </header>
  )
}
