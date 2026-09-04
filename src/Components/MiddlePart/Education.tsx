import SectionHeading from '../common/SectionHeading'
import Timeline from '../common/Timeline'
import Reveal from '../common/Reveal'
import { education } from '../../data/education'
import { certifications } from '../../data/certifications'

export default function Education() {
  return (
    <div className="container-page">
      <SectionHeading
        title="Education"
        subtitle="An outline of my academic qualifications and the knowledge gained throughout my academic journey."
      />
      <Timeline entries={education} />

      {/* Certifications sit under Education rather than in their own nav section,
          so the primary navigation stays at six items. */}
      <div className="mx-auto mt-16 w-full max-w-5xl">
        <h3 className="text-center font-sans text-xl font-semibold text-white sm:text-2xl">
          Certifications &amp; Awards
        </h3>

        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {certifications.map((certification, index) => (
            <Reveal key={certification.title} delay={index * 60} as="li" className="h-full">
              <article className="surface-card flex h-full flex-col gap-2 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      certification.isAward
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {certification.isAward ? 'Award' : 'Certification'}
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">{certification.date}</span>
                </div>

                <h4 className="text-sm font-semibold leading-snug text-white sm:text-base">
                  {certification.title}
                </h4>
                <p className="text-sm text-gray-400">{certification.issuer}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}
