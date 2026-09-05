import Reveal from './Reveal'

type Props = {
  title: string
  subtitle?: string
  /** Short uppercase label above the title, e.g. "What I work with". */
  eyebrow?: string
}

export default function SectionHeading({ title, subtitle, eyebrow }: Props) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}

      <Reveal delay={60}>
        {/* Kept solid white: the hero already carries a gradient wordmark, and a
            second gradient at heading size would compete with it. The colour
            accent for a section is the rule below instead. */}
        <h2 className="section-title mt-4">{title}</h2>
      </Reveal>

      {/* Accent rule under the title, sized to the text rather than the column. */}
      <Reveal delay={100}>
        <span
          aria-hidden="true"
          className="mx-auto mt-4 block h-[3px] w-16 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
        />
      </Reveal>

      {subtitle && (
        <Reveal delay={140}>
          <p className="section-subtitle mt-5">{subtitle}</p>
        </Reveal>
      )}
    </header>
  )
}
