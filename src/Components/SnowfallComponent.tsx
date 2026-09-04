import { lazy, Suspense } from 'react'

// Lazily imported so the library sits in its own chunk rather than the entry
// bundle. This is a build-time split only — the effect itself behaves exactly as
// it did originally.
const Snowfall = lazy(() => import('react-snowfall'))

/**
 * Decorative snow layer behind the page.
 *
 * Two things here are load-bearing and easy to break:
 *
 * 1. The page background must live on `html` ONLY (see index.css). If `body`
 *    also carries a background, it stops propagating to the page canvas and
 *    paints as body's own box — directly over this `-z-10` layer, hiding the
 *    snow completely.
 * 2. `snowflakeCount={50}` with the library's default radius/speed is the
 *    original look. Lowering the count or damping radius/speed makes the effect
 *    read as "the snow is gone".
 */
export default function SnowfallComponent() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 select-none">
      <Suspense fallback={null}>
        <Snowfall snowflakeCount={50} />
      </Suspense>
    </div>
  )
}
