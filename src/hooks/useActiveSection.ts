import { useEffect, useState } from 'react'

/**
 * Reports which section is currently under the navbar, for the nav's active state.
 *
 * Replaces react-scroll's `spy` — that library pulled ~130 kB (lodash and
 * prop-types included) into the critical path to do smooth scrolling and scroll
 * spying. Smooth scrolling is now plain `href="#id"` anchors plus CSS
 * `scroll-behavior` and `scroll-margin-top`; this hook covers the spy.
 *
 * It measures rather than relying on IntersectionObserver thresholds: adjacent
 * full-width sections both "intersect" at their shared boundary, so a threshold
 * approach highlights the previous section the moment you land on the next one.
 * Picking the section whose top sits closest to (but not below) the navbar line
 * is unambiguous at every scroll position.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const navHeight =
        parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80
      // A little slack so a section counts as active just before its top edge
      // reaches the bar, rather than a pixel after.
      const line = navHeight + 4

      let current: string | null = null
      let bestTop = -Infinity

      for (const id of ids) {
        const element = document.getElementById(id)
        if (!element) continue
        const { top } = element.getBoundingClientRect()
        // The deepest section that has already started scrolling past the bar.
        if (top <= line && top > bestTop) {
          bestTop = top
          current = id
        }
      }

      // Before the first section reaches the bar, fall back to the first one.
      setActive(current ?? ids[0] ?? null)
    }

    const onScroll = () => {
      // Coalesce to one measurement per frame.
      if (frame === 0) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}
