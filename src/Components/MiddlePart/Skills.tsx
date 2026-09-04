import { useCallback, useRef, type PointerEvent } from 'react'
import SectionHeading from '../common/SectionHeading'
import Reveal from '../common/Reveal'
import { skillSets, type SkillSet } from '../../data/skills'
import { useIsTouch, usePrefersReducedMotion } from '../../hooks/useMediaQuery'

const MAX_TILT_DEG = 12

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
 * Card with a pointer-tracked 3D tilt.
 *
 * The tilt is written straight to CSS custom properties on the element rather
 * than through React state or framer-motion springs, so pointer movement never
 * triggers a re-render and the transform stays on the compositor.
 */
function SkillCard({ set, tiltEnabled }: { set: SkillSet; tiltEnabled: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current
      if (!card || !tiltEnabled) return

      const rect = card.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5

      card.style.setProperty('--tilt-x', `${(-py * MAX_TILT_DEG * 2).toFixed(2)}deg`)
      card.style.setProperty('--tilt-y', `${(px * MAX_TILT_DEG * 2).toFixed(2)}deg`)
    },
    [tiltEnabled],
  )

  const resetTilt = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--tilt-x', '0deg')
    card.style.setProperty('--tilt-y', '0deg')
  }, [])

  return (
    <Reveal className="h-full [perspective:1000px]">
      <div
        ref={cardRef}
        onPointerMove={tiltEnabled ? handlePointerMove : undefined}
        onPointerLeave={tiltEnabled ? resetTilt : undefined}
        style={{ '--tilt-x': '0deg', '--tilt-y': '0deg' } as React.CSSProperties}
        className="surface-card h-full p-5 transition-transform duration-200 ease-out will-change-transform sm:p-6
                   [transform:rotateX(var(--tilt-x))_rotateY(var(--tilt-y))] [transform-style:preserve-3d]
                   motion-reduce:!transform-none"
      >
        <h3 className="mb-5 text-center text-lg font-semibold text-[#bbbdbf] sm:text-xl lg:text-2xl">
          {set.title}
        </h3>

        <ul className="flex flex-wrap justify-center gap-2">
          {set.skills.map((skill) => (
            <li
              key={skill.name}
              className="flex min-w-0 items-center gap-2 rounded-2xl border border-hairline bg-black/20 px-3 py-2 shadow-sm"
            >
              {skill.image ? (
                <img
                  src={skill.image}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="h-6 w-6 shrink-0 object-contain sm:h-8 sm:w-8"
                />
              ) : (
                // Capabilities (RAG, Error Analysis, ...) have no brand mark, so
                // they get a lettered tile at the same footprint as an icon —
                // the chips stay the same shape either way.
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-[10px] font-semibold uppercase text-brand-400 sm:h-8 sm:w-8 sm:text-xs"
                >
                  {initials(skill.name)}
                </span>
              )}
              <span className="font-sans text-xs text-[#a3a6a8] sm:text-sm">{skill.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export default function Skills() {
  const isTouch = useIsTouch()
  const prefersReducedMotion = usePrefersReducedMotion()
  const tiltEnabled = !isTouch && !prefersReducedMotion

  return (
    <div className="container-page">
      <SectionHeading
        title="Skills"
        subtitle="An overview of the technical skills acquired through hands-on experience and continuous learning."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {skillSets.map((set) => (
          <SkillCard key={set.title} set={set} tiltEnabled={tiltEnabled} />
        ))}
      </div>
    </div>
  )
}
