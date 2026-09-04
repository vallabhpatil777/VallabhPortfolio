import { lazy, Suspense, useEffect, useState } from 'react'
import { usePrefersReducedMotion, useIsTouch } from '../hooks/useMediaQuery'
import { useSaveData } from '../hooks/useSaveData'

// Kept out of the entry chunk: the backdrop is decorative and must never delay
// first paint of the actual content.
const Snowfall = lazy(() => import('react-snowfall'))

/**
 * Decorative snow layer behind the page.
 *
 * It is skipped entirely for reduced-motion users, touch devices and Data Saver
 * connections — a full-screen canvas repainting every frame is the kind of thing
 * that drains a phone battery for no informational value. When it does run, it
 * only mounts once the browser is idle, so it never competes with hydration.
 */
export default function SnowfallComponent() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isTouch = useIsTouch()
  const saveData = useSaveData()
  const [ready, setReady] = useState(false)

  const enabled = !prefersReducedMotion && !isTouch && !saveData

  useEffect(() => {
    if (!enabled) {
      setReady(false)
      return
    }

    const idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : window.setTimeout(() => setReady(true), 1200)

    return () => {
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle as number)
      else window.clearTimeout(idle as number)
    }
  }, [enabled])

  if (!enabled || !ready) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 select-none"
    >
      <Suspense fallback={null}>
        <Snowfall snowflakeCount={40} speed={[0.4, 1.2]} radius={[0.5, 1.8]} />
      </Suspense>
    </div>
  )
}
