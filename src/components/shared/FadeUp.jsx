import useIntersectionObserver from '../../hooks/useIntersectionObserver'

export default function FadeUp({ children, className = '' }) {
  const [ref, isVisible] = useIntersectionObserver({ rootMargin: '0px', threshold: 0.1 })

  return (
    <div ref={ref} className={`fade-up${isVisible ? ' visible' : ''} ${className}`}>
      {children}
    </div>
  )
}
