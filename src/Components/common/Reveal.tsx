import type { ElementType, ReactNode } from 'react'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

type Props = {
  children: ReactNode
  className?: string
  /** Stagger, in milliseconds. */
  delay?: number
  as?: ElementType
}

/**
 * Fade-and-rise reveal driven by a CSS transition and one IntersectionObserver.
 *
 * This replaces framer-motion for the scroll animations — the library was ~110 KB
 * gzipped for effects the compositor can do on its own, and it was being driven by
 * hooks called inside a `.map()`, which is a rules-of-hooks violation waiting to
 * break the moment a list becomes dynamic.
 */
export default function Reveal({ children, className = '', delay = 0, as }: Props) {
  const Tag = (as ?? 'div') as ElementType
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}
