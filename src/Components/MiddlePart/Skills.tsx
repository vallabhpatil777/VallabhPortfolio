import { lazy, Suspense, useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import SectionHeading from '../common/SectionHeading'
import Reveal from '../common/Reveal'
import ErrorBoundary from '../common/ErrorBoundary'
import { skillSets, type SkillSet } from '../../data/skills'
import { useIsMobile, useIsTouch, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useSpotlight } from '../../hooks/useSpotlight'

// Shares the three.js chunk the hero avatar already pulled in, so this adds only
// its own few hundred bytes — but it is still lazy so it cannot land on the
// critical path for someone who never scrolls this far.
const KnowledgeGraph = lazy(() => import('./KnowledgeGraph'))

const MAX_TILT_DEG = 8

/** Up to two letters for the lettered tile shown when a skill has no brand icon. */
function initials(name: string) {
  // Only alphanumeric words count, so "Faithfulness & Answer Relevancy" reads
  // "FA" rather than picking up the ampersand.
  const words = name.split(/[^A-Za-z0-9]+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2)
  return words[0][0] + words[1][0]
}

/**
 * Card with a pointer-tracked 3D tilt and a highlight that follows the cursor.
 *
 * Both effects are written straight to CSS custom properties on the element
 * rather than through React state or a spring library, so pointer movement never
 * triggers a re-render and the transform stays on the compositor.
 */
function SkillCard({ set, index, tiltEnabled }: { set: SkillSet; index: number; tiltEnabled: boolean }) {
  const spotlight = useSpotlight<HTMLDivElement>()

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      // The highlight is worth having on its own, so it runs whether or not the
      // tilt does.
      spotlight.onPointerMove(event)

      const card = spotlight.ref.current
      if (!card || !tiltEnabled) return

      const rect = card.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5

      card.style.setProperty('--tilt-x', `${(-py * MAX_TILT_DEG * 2).toFixed(2)}deg`)
      card.style.setProperty('--tilt-y', `${(px * MAX_TILT_DEG * 2).toFixed(2)}deg`)
    },
    [spotlight, tiltEnabled],
  )

  const resetTilt = useCallback(() => {
    const card = spotlight.ref.current
    if (!card) return
    card.style.setProperty('--tilt-x', '0deg')
    card.style.setProperty('--tilt-y', '0deg')
  }, [spotlight])

  return (
    <Reveal delay={Math.min(index, 5) * 70} className="h-full [perspective:1200px]">
      <div
        ref={spotlight.ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        style={{ '--tilt-x': '0deg', '--tilt-y': '0deg' } as React.CSSProperties}
        className="surface-card spotlight h-full p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out
                   will-change-transform hover:border-brand-500/40 hover:shadow-card-hover sm:p-6
                   [transform:rotateX(var(--tilt-x))_rotateY(var(--tilt-y))]
                   motion-reduce:!transform-none"
      >
        <div className="mb-5 flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px w-6 bg-gradient-to-r from-transparent to-brand-500/60" />
          <h3 className="text-center text-base font-semibold text-white sm:text-lg lg:text-xl">
            {set.title}
          </h3>
          <span aria-hidden="true" className="h-px w-6 bg-gradient-to-l from-transparent to-brand-500/60" />
        </div>

        <ul className="flex flex-wrap justify-center gap-2">
          {set.skills.map((skill) => (
            <li
              key={skill.name}
              className="flex min-w-0 items-center gap-2 rounded-xl border border-hairline bg-black/25 px-3 py-2
                         transition-[transform,background-color,border-color] duration-300 ease-spring
                         hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-brand-500/10
                         motion-reduce:hover:translate-y-0"
            >
              {skill.image ? (
                <img
                  src={skill.image}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7"
                />
              ) : (
                // Capabilities (RAG, Error Analysis, ...) have no brand mark, so
                // they get a lettered tile at the same footprint as an icon —
                // the chips stay the same shape either way.
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-[10px] font-semibold uppercase text-brand-300 sm:h-7 sm:w-7 sm:text-xs"
                >
                  {initials(skill.name)}
                </span>
              )}
              <span className="font-sans text-xs text-gray-300 sm:text-sm">{skill.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export default function Skills() {
  const isTouch = useIsTouch()
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()
  const tiltEnabled = !isTouch && !prefersReducedMotion

  const graphRef = useRef<HTMLDivElement>(null)
  const [graphInView, setGraphInView] = useState(false)
  const [graphSeen, setGraphSeen] = useState(false)

  // Mount the graph only once the section approaches, and stop its render loop
  // the moment it leaves — the same discipline the hero avatar uses, so two
  // canvases are never both drawing at once during normal scrolling.
  useEffect(() => {
    const node = graphRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setGraphInView(entry.isIntersecting)
        if (entry.isIntersecting) setGraphSeen(true)
      },
      { rootMargin: '150px 0px', threshold: 0.01 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="container-page">
      {/* Ambient graph behind the heading. `-z-10` puts it behind the copy but
          still above the page backdrop, and the radial mask fades it out before
          it reaches the text so the heading never loses contrast. */}
      <div className="relative">
        <div
          ref={graphRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[420px] w-[min(90vw,560px)] -translate-x-1/2 -translate-y-1/2 opacity-70 sm:block"
          style={{
            maskImage: 'radial-gradient(closest-side, #000 35%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 35%, transparent 78%)',
          }}
        >
          {graphSeen && !prefersReducedMotion && (
            <ErrorBoundary label="KnowledgeGraph" fallback={null}>
              <Suspense fallback={null}>
                <KnowledgeGraph active={graphInView} animate={!isMobile} />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>

        <SectionHeading
          eyebrow="What I work with"
          title="Skills"
          subtitle="An overview of the technical skills acquired through hands-on experience and continuous learning."
        />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {skillSets.map((set, index) => (
          <SkillCard key={set.title} set={set} index={index} tiltEnabled={tiltEnabled} />
        ))}
      </div>
    </div>
  )
}
