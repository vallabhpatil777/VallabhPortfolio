import { useEffect, useRef, useState } from 'react'

/**
 * Fires once, the first time the element scrolls into view.
 *
 * Replaces `react-intersection-observer` for the reveal animations. Because it
 * disconnects after the first hit, scrolling back up never re-triggers and the
 * observer stops costing anything.
 */
export function useInViewOnce<T extends HTMLElement>(rootMargin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Without IntersectionObserver, show the content rather than hiding it.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { threshold: 0.15, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
