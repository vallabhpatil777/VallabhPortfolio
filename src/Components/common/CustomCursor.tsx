import { useEffect, useRef } from 'react'
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Two-part pointer: a small brand dot that tracks exactly, and a ring that eases
 * toward it a few frames behind.
 *
 * Design rules this follows, because a custom cursor is very easy to get wrong:
 *
 * - **The dot never lags.** Aiming accuracy is the one thing a cursor cannot
 *   trade away, so only the decorative ring is interpolated.
 * - **Fine pointers only.** On touch there is no cursor to replace, and hiding
 *   the native one on a hybrid device that later uses a mouse would be worse
 *   than doing nothing — hence the live `matchMedia` query rather than a
 *   one-time check.
 * - **Text fields keep their I-beam.** Losing the caret affordance while typing
 *   is a real usability cost for a cosmetic gain, so the custom cursor hides
 *   itself over inputs and the native `text` cursor comes back.
 * - **Reduced motion opts out entirely**, native cursor included.
 *
 * Positions are written straight to `transform` on refs. Nothing here ever calls
 * `setState`, so pointer movement costs no React work at all.
 */

/** Anything that should make the ring bloom. `canvas` covers the 3D avatar. */
const INTERACTIVE = 'a, button, [role="button"], summary, label[for], canvas, [data-cursor="hover"]'
const TEXT_FIELD = 'input, textarea, select, [contenteditable="true"]'

/** How far the ring closes on the dot each frame. Lower = longer tail. */
const EASING = 0.18

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // A hybrid laptop can switch between trackpad and touch, so this is a live
  // subscription rather than a snapshot taken at mount.
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const prefersReducedMotion = usePrefersReducedMotion()
  const enabled = isFinePointer && !prefersReducedMotion

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Scopes the `cursor: none` rule in index.css to exactly the sessions where
    // a replacement is actually being drawn.
    document.documentElement.classList.add('has-custom-cursor')

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const trail = { ...pointer }
    let frame = 0
    let visible = false

    const draw = () => {
      const dx = pointer.x - trail.x
      const dy = pointer.y - trail.y
      trail.x += dx * EASING
      trail.y += dy * EASING

      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`

      // Park the loop once the ring has caught up; a pointer move restarts it.
      // Otherwise this would burn a frame callback for the whole session.
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        frame = 0
        return
      }
      frame = requestAnimationFrame(draw)
    }

    const start = () => {
      if (frame === 0) frame = requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent) => {
      // A pen or finger event on a hybrid device must not drag the mouse cursor
      // around, and should not reveal it either.
      if (event.pointerType !== 'mouse') return

      pointer.x = event.clientX
      pointer.y = event.clientY

      if (!visible) {
        visible = true
        dot.dataset.visible = 'true'
        ring.dataset.visible = 'true'
        // Jump the ring to the pointer on the first sighting rather than letting
        // it sweep in from the middle of the screen.
        trail.x = pointer.x
        trail.y = pointer.y
      }

      const target = event.target as Element | null
      const overField = !!target?.closest?.(TEXT_FIELD)
      const overInteractive = !overField && !!target?.closest?.(INTERACTIVE)

      // `hidden` here is the custom cursor stepping aside so the native I-beam
      // can do its job inside a form field.
      dot.dataset.hidden = String(overField)
      ring.dataset.hidden = String(overField)
      ring.dataset.hover = String(overInteractive)

      start()
    }

    const hide = () => {
      visible = false
      dot.dataset.visible = 'false'
      ring.dataset.visible = 'false'
    }

    const onDown = () => {
      ring.dataset.pressed = 'true'
    }
    const onUp = () => {
      ring.dataset.pressed = 'false'
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    // Leaving the window (or tabbing away) must not leave a stranded dot behind.
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" data-visible="false" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" data-visible="false" />
    </>
  )
}
