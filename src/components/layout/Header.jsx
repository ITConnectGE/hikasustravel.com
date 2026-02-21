import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '../../data/siteData'
import asset from '../../utils/basePath'

export default function Header({ variant = 'default' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()

  // Close mobile menu on navigation - this is a legitimate sync with router state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const menuEl = menuRef.current
          if (menuEl) {
            setIsSticky(window.scrollY >= menuEl.offsetTop || window.scrollY > 300)
          }
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
        <Link to="/" title="Home">
          <img src={asset('/img/hikasustravel.svg')} alt="Hikasus travel" />
        </Link>
      </div>

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
            <Link
              to={link.to}
              title={link.title}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          </span>
        ))}
      </nav>
    </header>
  )
}
