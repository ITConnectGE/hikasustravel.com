import useT from '../../i18n/useT'

function SearchIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  )
}

/**
 * The button that opens the global search.
 *
 * Rendered twice by Header, and which one you see is decided in CSS:
 *   variant="nav" — an item in the desktop nav row (icon + label), hidden <=900px
 *   variant="bar" — an icon-only button in the compact mobile header bar,
 *                   hidden >900px, so search stays one tap away on phones
 *                   instead of being buried in the hamburger drawer.
 *
 * `onOpen` receives the button element so the overlay can hand focus back to
 * the exact control that opened it.
 */
export default function SearchButton({ variant = 'nav', onOpen, onPreload, expanded }) {
  const t = useT()
  const label = t('search.open')

  return (
    <button
      type="button"
      className={`nav-search nav-search--${variant}`}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      onClick={(e) => onOpen(e.currentTarget)}
      // Warm the lazy overlay chunk on intent, so the first open is instant
      // rather than waiting on a round trip. Hover and focus cover mouse and
      // keyboard; pointer/touch-down cover touch, firing before the click so
      // the request is already in flight when the panel opens.
      onMouseEnter={onPreload}
      onFocus={onPreload}
      onPointerDown={onPreload}
      onTouchStart={onPreload}
    >
      <SearchIcon />
      <span className="nav-search__label">{label}</span>
    </button>
  )
}
