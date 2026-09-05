import { useCallback, useRef, type PointerEvent } from 'react'

/**
 * Pointer-tracked highlight for a card.
 *
 * Writes the pointer position straight to `--mx` / `--my` CSS custom properties
 * on the element, which the `.spotlight` class in index.css reads. Going through
 * CSS variables rather than React state means moving the mouse never triggers a
 * re-render, and the resulting paint stays off the React commit path.
 *
 * Pair with the `.spotlight` class:
 *
 *   const spotlight = useSpotlight<HTMLDivElement>()
 *   <div ref={spotlight.ref} onPointerMove={spotlight.onPointerMove} className="spotlight …" />
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  // Coalesce to one write per frame; pointermove can fire far faster than that.
  const frame = useRef(0)
  const next = useRef({ x: 0, y: 0 })

  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    next.current = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    }

    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const current = ref.current
      if (!current) return
      current.style.setProperty('--mx', `${next.current.x.toFixed(2)}%`)
      current.style.setProperty('--my', `${next.current.y.toFixed(2)}%`)
    })
  }, [])

  return { ref, onPointerMove }
}
