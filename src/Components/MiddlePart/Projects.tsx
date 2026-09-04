import { useMemo, useState } from 'react'
import SectionHeading from '../common/SectionHeading'
import Reveal from '../common/Reveal'
import { CATEGORIES, projects, type Category, type Project } from '../../data/projects'

function ProjectCard({ project, priority }: { project: Project; priority: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-card-hover">
      {/* Fixed aspect ratio reserves the space before the image decodes, so the
          grid never jumps as cards load. The fallback keeps that exact ratio, so
          cards stay aligned whether or not a screenshot exists. */}
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
          className="aspect-[16/10] w-full bg-black/30 object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-brand-700/40 via-brand-500/20 to-transparent px-6"
        >
          <span className="text-center text-sm font-semibold leading-snug text-brand-400">
            {project.topic}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-base font-semibold text-white sm:text-lg">{project.topic}</h3>
        <p className="mt-1 text-sm text-gray-400">{project.duration}</p>

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
          className="-mx-1 -mb-1 mt-1 self-start px-1 py-2 text-sm font-medium text-brand-400 underline underline-offset-2 hover:text-brand-500"
        >
          {expanded ? 'Read less' : 'Read more'}
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
              className="flex-1 rounded-full border border-brand-500 px-4 py-2 text-center text-sm font-medium text-brand-400 transition duration-300 hover:bg-brand-600 hover:text-white"
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
        title="Projects"
        subtitle="A showcase of key projects that highlight my skills across various domains, demonstrating innovation and problem-solving."
      />

      {/* Wraps instead of overflowing — the old `flex space-x-6` row pushed the
          page sideways on narrow screens. */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3"
      >
        {CATEGORIES.map((category) => {
          const isActive = filter === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 text-xs font-medium transition duration-300 sm:text-sm ${
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'border border-hairline text-gray-400 hover:bg-brand-500 hover:text-white'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-center text-sm text-gray-500" aria-live="polite">
        Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project, index) => (
          <Reveal key={project.id} delay={Math.min(index, 5) * 60} className="h-full">
            <ProjectCard project={project} priority={index < 3} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
