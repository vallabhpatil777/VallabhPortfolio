import Reveal from './Reveal'

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
}

/** Initials for the monogram medallion, e.g. "N&S Consultants, Birmingham UK" -> "NS". */
function monogram(organisation: string) {
  const name = organisation.split(',')[0]
  const letters = name.match(/[A-Z]/g)
  if (letters && letters.length >= 2) return letters.slice(0, 2).join('')
  return name.slice(0, 2).toUpperCase()
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
  return (
    <ol className="relative mx-auto mt-10 w-full max-w-5xl list-none p-0">
      {/* Spine: hugs the left edge on mobile, centred from `lg` up. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-5 top-0 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-500/70 via-white/25 to-transparent lg:left-1/2"
      />

      {entries.map((entry, index) => {
        const isLeft = index % 2 === 0

        return (
          <li
            key={entry.id}
            className="relative mb-10 pl-16 last:mb-0 sm:pl-20 lg:grid lg:grid-cols-2 lg:gap-x-24 lg:pl-0"
          >
            {/* Logo medallion, centred on the spine at every breakpoint. */}
            <Reveal className="absolute left-5 top-1 z-10 -translate-x-1/2 lg:left-1/2 lg:top-2">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-800 shadow-md sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                {entry.logo ? (
                  <img
                    src={entry.logo}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="text-xs font-semibold tracking-tight text-brand-400 sm:text-sm lg:text-base"
                  >
                    {monogram(entry.organisation)}
                  </span>
                )}
              </span>
            </Reveal>

            <Reveal
              delay={80}
              className={
                isLeft
                  ? 'lg:col-start-1 lg:row-start-1'
                  : 'lg:col-start-2 lg:row-start-1'
              }
            >
              <article className="surface-card relative p-5 text-white sm:p-6">
                {/* Connector notch pointing back at the spine (desktop only). */}
                <span
                  aria-hidden="true"
                  className={`absolute top-6 hidden h-0 w-0 border-y-8 border-y-transparent lg:block ${
                    isLeft
                      ? '-right-2 border-l-8 border-l-hairline'
                      : '-left-2 border-r-8 border-r-hairline'
                  }`}
                />

                <h3 className="text-base font-semibold sm:text-lg">{entry.role}</h3>
                <p className="mt-1 text-sm text-gray-300">{entry.organisation}</p>
                <p className="text-sm text-gray-400">{entry.duration}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-200">{entry.description}</p>
                <p className="mt-3 text-sm font-semibold">{entry.metaLabel}:</p>
                <p className="text-sm text-gray-300">{entry.meta}</p>
              </article>
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}
