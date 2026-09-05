import fbIcon from '../../assets/fbicon.svg'
import instaIcon from '../../assets/instagram.svg'
import linkedIcon from '../../assets/linkedinIcon.svg'

const SOCIALS = [
  { href: 'https://www.facebook.com/vallabh.patil.92', icon: fbIcon, label: 'Facebook' },
  {
    href: 'https://www.linkedin.com/in/vallabh-patil-63248b144',
    icon: linkedIcon,
    label: 'LinkedIn',
  },
  { href: 'https://www.instagram.com/vallabh_patil_777/', icon: instaIcon, label: 'Instagram' },
]

const QUICK_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const

export default function Footer() {
  return (
    <footer className="relative mt-8">
      {/* Fades the page out into the footer rather than ending on a hard rule. */}
      <div aria-hidden="true" className="divider-glow" />

      <div className="container-page flex flex-col items-center gap-8 py-14 text-center">
        <a href="#about" className="group flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-glow-sm transition-transform duration-500 ease-spring group-hover:scale-105"
          >
            VP
          </span>
          <span className="text-lg font-semibold text-white">Vallabh Patil</span>
        </a>

        <p className="max-w-md text-sm leading-relaxed text-gray-500">
          AI Engineer building LLM-powered systems — RAG pipelines, agents and the backends
          that keep them honest.
        </p>

        {/* Secondary navigation: useful once a visitor has scrolled this far. */}
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {QUICK_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-sm text-gray-400 transition-colors duration-300 hover:text-brand-300"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex items-center gap-3">
          {SOCIALS.map(({ href, icon, label }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={label}
                className="inline-grid h-11 w-11 place-items-center rounded-full border border-hairline
                           transition-[transform,background-color,border-color] duration-300 ease-spring
                           hover:-translate-y-1 hover:border-brand-500/60 hover:bg-brand-500/10
                           motion-reduce:hover:translate-y-0"
              >
                <img src={icon} alt="" width={22} height={22} loading="lazy" className="h-5 w-5" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-4">
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-500 transition-colors duration-300 hover:text-brand-300"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 4.6l6 6-1.4 1.4L13 8.4V20h-2V8.4l-3.6 3.6L6 10.6z" />
            </svg>
            Back to top
          </a>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Vallabh Patil. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
