import type { ElementType, ReactNode } from 'react'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/** Starting transform for each entrance direction. */
const HIDDEN: Record<string, string> = {
  up: 'translate3d(0, 2rem, 0)',
  down: 'translate3d(0, -2rem, 0)',
  left: 'translate3d(-2rem, 0, 0)',
  right: 'translate3d(2rem, 0, 0)',
  scale: 'scale(0.94)',
  fade: 'none',
}

export type RevealFrom = keyof typeof HIDDEN

type Props = {
  children: ReactNode
  className?: string
  /** Stagger, in milliseconds. */
  delay?: number
  /** Which way the element travels in from. Defaults to `up`. */
  from?: RevealFrom
  as?: ElementType
}

/**
 * Fade-and-travel reveal driven by a CSS transition and one IntersectionObserver.
 *
 * This replaces framer-motion for the scroll animations — the library was ~110 KB
 * gzipped for effects the compositor can do on its own, and it was being driven by
 * hooks called inside a `.map()`, which is a rules-of-hooks violation waiting to
 * break the moment a list becomes dynamic.
 *
 * Only `opacity` and `transform` are animated, so every reveal on the page stays
 * on the compositor and never triggers layout.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  from = 'up',
  as,
}: Props) {
  const Tag = (as ?? 'div') as ElementType
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag
      ref={ref}
      style={{
        transitionDelay: inView ? `${delay}ms` : '0ms',
        transform: inView ? 'none' : HIDDEN[from],
        opacity: inView ? 1 : 0,
        // No `will-change` here on purpose. Every not-yet-revealed card would
        // hold its own compositor layer, and there are ~30 of them below the
        // fold; the browser promotes the element anyway once the transition
        // actually starts.
      }}
      className={`transition-[opacity,transform] duration-[900ms] ease-spring motion-reduce:transition-none ${className}`}
    >
      {children}
    </Tag>
  )
}
