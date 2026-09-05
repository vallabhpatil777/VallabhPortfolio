import { useEffect, useRef } from 'react'
import Reveal from './Reveal'
import { useSpotlight } from '../../hooks/useSpotlight'

export type TimelineEntry = {
  id: number
  organisation: string
  role: string
  duration: string
  description: string
  /** Label for the trailing detail row — "Skills" or "Grade". */
  metaLabel: string
  meta: string
  /** Optional — entries without a brand logo fall back to a monogram medallion. */
  logo?: string
  /**
   * How the logo fills its medallion. `cover` (the default) suits square marks;
   * `contain` letterboxes a wide logo on a white disc so it is not cropped.
   */
  logoFit?: 'cover' | 'contain'
}

/** Initials for the monogram medallion, e.g. "N&S Consultants, Birmingham UK" -> "NS". */
function monogram(organisation: string) {
  const name = organisation.split(',')[0]
  const letters = name.match(/[A-Z]/g)
  if (letters && letters.length >= 2) return letters.slice(0, 2).join('')
  return name.slice(0, 2).toUpperCase()
}

/** The `meta` field is a "•"-separated list; render it as chips instead of prose. */
function metaTags(meta: string) {
  return meta
    .split('•')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function TimelineCard({ entry, isCurrent }: { entry: TimelineEntry; isCurrent: boolean }) {
  const spotlight = useSpotlight<HTMLElement>()
  const tags = metaTags(entry.meta)

  return (
    <article
      ref={spotlight.ref}
      onPointerMove={spotlight.onPointerMove}
      className="surface-card spotlight card-lift p-5 text-white sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h3 className="text-base font-semibold sm:text-lg">{entry.role}</h3>
          <p className="mt-1 text-sm text-gray-300">{entry.organisation}</p>
        </div>

        {isCurrent && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Current
          </span>
        )}
      </div>

      <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-brand-400">
        {entry.duration}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-gray-300">{entry.description}</p>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
        {entry.metaLabel}
      </p>

      {/* Wraps freely — a long skills list must never widen the card. */}
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li
            key={tag}
            className="chip hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-300"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  )
}

/**
 * The vertical rail, drawn progressively as the section scrolls past.
 *
 * A dim track runs the full height and a brand-gradient fill grows down it,
 * headed by a glowing node that tracks the fill point. Progress is written
 * straight to `transform: scaleY()` and `top` on refs inside a rAF-coalesced
 * scroll handler — no React state, so scrolling costs no renders.
 *
 * Done in JS rather than with CSS `animation-timeline: scroll()`, which Firefox
 * still does not support; this behaves identically everywhere.
 */
function Spine({ trackRef }: { trackRef: React.RefObject<HTMLOListElement> }) {
  const fillRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = trackRef.current
    const fill = fillRef.current
    const head = headRef.current
    if (!list || !fill || !head) return

    // Respect the OS setting by simply drawing the rail complete and skipping
    // the listener entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fill.style.transform = 'scaleY(1)'
      head.style.opacity = '0'
      return
    }

    let frame = 0

    const measure = () => {
      frame = 0
      const rect = list.getBoundingClientRect()
      // Start filling once the list's top passes 85% of the viewport height, and
      // finish as its bottom clears the same line — so the rail is complete just
      // as the last card settles rather than only at the very end of the page.
      const line = window.innerHeight * 0.85
      const progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height))

      fill.style.transform = `scaleY(${progress.toFixed(4)})`
      head.style.top = `${(progress * 100).toFixed(2)}%`
      // Hide the node at the extremes, where it would sit detached above the
      // first card or past the last one.
      head.style.opacity = progress > 0.01 && progress < 0.995 ? '1' : '0'
    }

    const onScroll = () => {
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
  }, [trackRef])

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 lg:left-1/2"
    >
      {/* Unlit track. */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Lit portion. `scaleY` from the top edge keeps this on the compositor. */}
      <div
        ref={fillRef}
        className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-brand-500 via-brand-400 to-accent-500"
      />

      {/* Glowing head at the fill point. */}
      <div
        ref={headRef}
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400 opacity-0 shadow-[0_0_12px_3px_rgba(56,189,248,0.7)] transition-opacity duration-300"
      />
    </div>
  )
}

/**
 * Alternating vertical timeline.
 *
 * Layout is a two-column grid that collapses to a single left-rail column below
 * `lg`. The previous implementation positioned each row with hard-coded
 * `right-[810px]` / `ml-[810px]` offsets, which only lined up at one viewport
 * width and pushed content off-screen at every other size.
 */
export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const listRef = useRef<HTMLOListElement>(null)

  return (
    <ol ref={listRef} className="relative mx-auto mt-12 w-full max-w-5xl list-none p-0">
      <Spine trackRef={listRef} />

      {entries.map((entry, index) => {
        const isLeft = index % 2 === 0
        const isCurrent = /present|current/i.test(entry.duration)
        const contain = entry.logoFit === 'contain'

        return (
          <li
            key={entry.id}
            className="relative mb-10 pl-16 last:mb-0 sm:pl-20 lg:grid lg:grid-cols-2 lg:gap-x-24 lg:pl-0"
          >
            {/* Logo medallion, centred on the spine at every breakpoint.
                The centring translate lives on this wrapper, NOT on `Reveal`:
                Reveal writes an inline `transform`, which would overwrite a
                `-translate-x-1/2` utility on the same element and knock the
                medallion off the spine. */}
            <div className="absolute left-5 top-1 z-10 -translate-x-1/2 lg:left-1/2 lg:top-2">
              <Reveal from="scale">
                <span className="relative flex h-11 w-11 items-center justify-center sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                  {/* Halo ring; pulses only on the role held today. */}
                  {isCurrent && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400/30 motion-reduce:hidden"
                    />
                  )}
                  <span
                    className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 shadow-glow-sm ${
                      contain ? 'bg-white p-1.5' : 'bg-ink'
                    } ${isCurrent ? 'border-emerald-400/70' : 'border-brand-500/50'}`}
                  >
                    {entry.logo ? (
                      <img
                        src={entry.logo}
                        alt=""
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full rounded-full ${
                          contain ? 'object-contain' : 'object-cover'
                        }`}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="text-xs font-semibold tracking-tight text-brand-300 sm:text-sm lg:text-base"
                      >
                        {monogram(entry.organisation)}
                      </span>
                    )}
                  </span>
                </span>
              </Reveal>
            </div>

            <Reveal
              delay={80}
              from={isLeft ? 'left' : 'right'}
              className={isLeft ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2 lg:row-start-1'}
            >
              <TimelineCard entry={entry} isCurrent={isCurrent} />
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}
