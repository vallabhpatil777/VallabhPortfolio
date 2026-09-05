import SectionHeading from '../common/SectionHeading'
import Timeline from '../common/Timeline'
import Reveal from '../common/Reveal'
import { useSpotlight } from '../../hooks/useSpotlight'
import { education } from '../../data/education'
import { certifications, type Certification } from '../../data/certifications'

function CertificationCard({ certification }: { certification: Certification }) {
  const spotlight = useSpotlight<HTMLElement>()

  return (
    <article
      ref={spotlight.ref}
      onPointerMove={spotlight.onPointerMove}
      className="surface-card spotlight card-lift flex h-full flex-col gap-2 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            certification.isAward
              ? 'bg-brand-500/20 text-brand-300'
              : 'bg-white/5 text-gray-400'
          }`}
        >
          {certification.isAward && (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M12 2 9.6 8.2 3 8.8l5 4.3L6.5 20 12 16.5 17.5 20 16 13.1l5-4.3-6.6-.6z" />
            </svg>
          )}
          {certification.isAward ? 'Award' : 'Certification'}
        </span>
        <span className="shrink-0 text-xs text-gray-500">{certification.date}</span>
      </div>

      <h4 className="text-sm font-semibold leading-snug text-white sm:text-base">
        {certification.title}
      </h4>
      <p className="text-sm text-gray-400">{certification.issuer}</p>
    </article>
  )
}

export default function Education() {
  return (
    <div className="container-page">
      <SectionHeading
        eyebrow="Where I studied"
        title="Education"
        subtitle="An outline of my academic qualifications and the knowledge gained throughout my academic journey."
      />
      <Timeline entries={education} />

      {/* Certifications sit under Education rather than in their own nav section,
          so the primary navigation stays at six items. */}
      <div className="mx-auto mt-20 w-full max-w-5xl">
        <Reveal className="text-center">
          <h3 className="font-sans text-xl font-semibold text-white sm:text-2xl">
            Certifications &amp; Awards
          </h3>
          <span
            aria-hidden="true"
            className="mx-auto mt-3 block h-[3px] w-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          />
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {certifications.map((certification, index) => (
            <Reveal
              key={certification.title}
              delay={Math.min(index, 5) * 70}
              as="li"
              className="h-full"
            >
              <CertificationCard certification={certification} />
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}
