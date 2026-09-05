import { useMemo, useState } from 'react'
import SectionHeading from '../common/SectionHeading'
import Reveal from '../common/Reveal'
import { useSpotlight } from '../../hooks/useSpotlight'
import { CATEGORIES, projects, type Category, type Project } from '../../data/projects'

function ProjectCard({ project, priority }: { project: Project; priority: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const spotlight = useSpotlight<HTMLElement>()

  return (
    <article
      ref={spotlight.ref}
      onPointerMove={spotlight.onPointerMove}
      className="surface-card spotlight card-lift group flex h-full flex-col overflow-hidden"
    >
      {/* Fixed aspect ratio reserves the space before the image decodes, so the
          grid never jumps as cards load. The fallback keeps that exact ratio, so
          cards stay aligned whether or not a screenshot exists. */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-black/40">
        {project.image ? (
          <img
            src={project.image}
            alt={`Screenshot of ${project.topic}`}
            width={800}
            height={500}
            // The first row is above the fold on desktop; the rest wait until needed.
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-700/40 via-brand-500/20 to-transparent px-6"
          >
            <span className="text-center text-sm font-semibold leading-snug text-brand-300">
              {project.topic}
            </span>
          </div>
        )}

        {/* Scrim so the tag row stays legible over any screenshot. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
        />

        <ul className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
          {project.categories.map((category) => (
            <li
              key={category}
              className="rounded-full border border-brand-500/40 bg-ink/70 px-2.5 py-1 text-[0.6875rem] font-medium text-brand-300 backdrop-blur-sm"
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-base font-semibold text-white transition-colors duration-300 group-hover:text-brand-300 sm:text-lg">
          {project.topic}
        </h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
          {project.duration}
        </p>

        <p
          className={`mt-3 flex-1 text-sm leading-relaxed text-gray-300 ${
            expanded ? '' : 'line-clamp-4'
          }`}
        >
          {project.description}
        </p>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          // `py-2` keeps the tap target above the 24px minimum on touch devices;
          // the negative margin stops that padding from loosening the layout.
          className="-mx-1 -mb-1 mt-1 inline-flex items-center gap-1 self-start px-1 py-2 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          {expanded ? 'Read less' : 'Read more'}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M7.4 9.6 12 14.2l4.6-4.6 1.4 1.4-6 6-6-6z" />
          </svg>
        </button>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={project.codeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 px-4 py-2 text-sm"
          >
            View Code
          </a>
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex-1 px-4 py-2 text-sm"
            >
              View Demo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<Category>('All')

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((project) => project.categories.includes(filter)),
    [filter],
  )

  return (
    <div className="container-page">
      <SectionHeading
        eyebrow="Selected work"
        title="Projects"
        subtitle="A showcase of key projects that highlight my skills across various domains, demonstrating innovation and problem-solving."
      />

      {/* Wraps instead of overflowing — the old `flex space-x-6` row pushed the
          page sideways on narrow screens. */}
      <Reveal className="mt-12">
        <div
          role="group"
          aria-label="Filter projects by category"
          className="flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {CATEGORIES.map((category) => {
            const isActive = filter === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-spring sm:text-sm
                            hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 ${
                              isActive
                                ? 'border border-transparent bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-glow-sm'
                                : 'border border-hairline text-gray-400 hover:border-brand-500/50 hover:text-white'
                            }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </Reveal>

      <p className="mt-4 text-center text-sm text-gray-500" aria-live="polite">
        Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project, index) => (
          <Reveal key={project.id} delay={Math.min(index, 5) * 70} className="h-full">
            <ProjectCard project={project} priority={index < 3} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
