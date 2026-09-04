import { useSyncExternalStore } from 'react'

/**
 * Subscribes to a CSS media query.
 *
 * `useSyncExternalStore` keeps the value correct through concurrent renders and
 * returns `false` during SSR/prerender rather than touching `window`.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (onChange: () => void) => {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {}
    const mql = window.matchMedia(query)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }

  const getSnapshot = () =>
    typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/** True when the visitor has asked the OS to minimise animation. */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')

/** True below Tailwind's `lg` breakpoint — where the mobile layout applies. */
export const useIsMobile = () => useMediaQuery('(max-width: 1023px)')

/** True for coarse pointers (touch), where hover-driven effects should be skipped. */
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')
