import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const

const SECTION_IDS = NAV_LINKS.map((link) => link.id)
const GITHUB_URL = 'https://github.com/vallabhpatil777'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const activeSection = useActiveSection(SECTION_IDS)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  // Solidify the bar once the page scrolls away from the hero.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Resizing into the desktop layout must not leave an orphaned drawer on screen.
  useEffect(() => {
    if (!isMenuOpen) return
    const mql = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mql.matches && closeMenu()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [isMenuOpen, closeMenu])

  // Escape closes, outside clicks close, and the page behind stays put.
  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeMenu()
      toggleRef.current?.focus()
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panelRef.current?.contains(target) && !toggleRef.current?.contains(target)) {
        closeMenu()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isMenuOpen, closeMenu])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'border-b border-hairline bg-ink/90 shadow-md backdrop-blur-md'
          : 'bg-ink'
      }`}
    >
      <nav
        aria-label="Primary"
        className="container-page flex h-full items-center justify-between gap-4"
      >
        <a
          href="#about"
          className="shrink-0 font-sans text-base font-semibold tracking-wide text-white sm:text-lg"
        >
          PORTFOLIO
        </a>

        {/* Desktop navigation — shown only where six links plus a button genuinely
            fit. The old breakpoint was `sm` (640px), which crushed them together. */}
        <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={activeSection === id ? 'true' : undefined}
                className={`text-sm font-semibold transition-colors duration-300 hover:text-brand-600 xl:text-base ${
                  activeSection === id ? 'text-brand-400' : 'text-white'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 rounded-full border border-brand-500 px-4 py-2 text-sm font-medium text-brand-500 transition duration-300 hover:bg-brand-600 hover:text-white lg:inline-flex xl:px-5"
        >
          Github Profile
        </a>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          // 44px minimum, so the tap target meets touch guidelines.
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <div
        id={menuId}
        ref={panelRef}
        hidden={!isMenuOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-b border-hairline bg-ink/95 shadow-xl backdrop-blur-md lg:hidden"
      >
        <ul className="container-page flex flex-col py-2">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={closeMenu}
                aria-current={activeSection === id ? 'true' : undefined}
                className={`block rounded-lg px-2 py-3 text-base font-semibold transition-colors duration-200 hover:bg-white/5 hover:text-brand-600 ${
                  activeSection === id ? 'text-brand-400' : 'text-white'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="px-2 py-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-4 py-3 font-medium text-white transition duration-300 hover:bg-brand-500"
            >
              Github Profile
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
