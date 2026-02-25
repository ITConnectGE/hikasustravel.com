import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { navLinks } from '../../data/siteData'
import asset from '../../utils/basePath'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import LocaleLink from '../../i18n/LocaleLink'
import LanguageSwitcher from './LanguageSwitcher'

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
        {navLinks.map((link) => (
          <span key={link.to}>
            <LocaleLink
              to={link.to}
              title={t(link.labelKey)}
              className={location.pathname === `/${lang}${link.to}` ? 'active' : ''}
            >
              {t(link.labelKey)}
            </LocaleLink>
          </span>
        ))}
      </nav>
      {isSticky && <div style={{ height: menuHeight.current }} />}
    </header>
  )
}
