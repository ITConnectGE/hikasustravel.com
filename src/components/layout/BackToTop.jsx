import useScrollPosition from '../../hooks/useScrollPosition'

export default function BackToTop() {
  const scrollY = useScrollPosition()
  const isVisible = scrollY > window.innerHeight * 1.2

  const handleClick = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`backtotop${isVisible ? ' visible' : ''}`}>
      <a href="#" onClick={handleClick}>Back to top</a>
    </div>
  )
}
