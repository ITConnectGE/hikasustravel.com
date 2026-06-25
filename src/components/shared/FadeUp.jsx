import useIntersectionObserver from '../../hooks/useIntersectionObserver'

export default function FadeUp({ children, className = '' }) {
  // threshold 0 (reveal as soon as any part enters the viewport) instead of 0.1:
  // an element taller than ~10x the viewport — e.g. the long Places to Visit
  // card grid — can never reach 10% visibility, so a 0.1 threshold would leave
  // it stuck at opacity:0. threshold 0 fires for any element height.
  const [ref, isVisible] = useIntersectionObserver({ rootMargin: '0px', threshold: 0 })

  return (
    <div ref={ref} className={`fade-up${isVisible ? ' visible' : ''} ${className}`}>
      {children}
    </div>
  )
}
