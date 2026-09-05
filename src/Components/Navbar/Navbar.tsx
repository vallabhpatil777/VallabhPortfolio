import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
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

/**
 * Reading-progress bar drawn along the bottom edge of the header.
 *
 * Written straight to `transform` on a ref rather than through state: this
 * updates on every scroll frame, and re-rendering the whole navbar that often
 * would be wasteful. `scaleX` is compositor-only, so it costs nothing to animate.
 */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const bar = barRef.current
      if (!bar) return
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`
    }

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500"
      />
    </div>
  )
}

/**
 * Desktop link rail with a pill that slides to whichever section is active.
 *
 * The pill is positioned by measuring the active anchor rather than by giving
 * each link its own background, so the highlight travels between items instead
 * of blinking on and off. Measurement is redone on resize and once the webfont
 * lands, since both change the label widths.
 */
function DesktopLinks({ activeSection }: { activeSection: string | null }) {
  const listRef = useRef<HTMLUListElement>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const active = list.querySelector<HTMLElement>('[data-active="true"]')
      if (!active) {
        setPill(null)
        return
      }
      setPill({ left: active.offsetLeft, width: active.offsetWidth })
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(list)

    // Poppins loads asynchronously; every label resizes when it swaps in.
    void document.fonts?.ready.then(measure).catch(() => {})

    return () => observer.disconnect()
  }, [activeSection])

  return (
    <ul
      ref={listRef}
      className="relative hidden items-center rounded-full border border-hairline bg-white/[0.03] p-1 backdrop-blur-md lg:flex"
    >
      {/* Sliding highlight. Hidden until the first measurement so it never flashes
          at the origin on mount. */}
      <span
        aria-hidden="true"
        className="absolute bottom-1 top-1 rounded-full bg-brand-500/15 ring-1 ring-brand-500/30 transition-[transform,width,opacity] duration-500 ease-spring"
        style={{
          opacity: pill ? 1 : 0,
          width: pill?.width ?? 0,
          transform: `translateX(${pill?.left ?? 0}px)`,
          left: 0,
        }}
      />

      {NAV_LINKS.map(({ id, label }) => {
        const isActive = activeSection === id
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              data-active={isActive}
              aria-current={isActive ? 'true' : undefined}
              className={`relative block rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-300 xl:px-4 ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

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
      className={`fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
        isScrolled || isMenuOpen
          ? 'border-b border-hairline bg-ink/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="container-page flex h-full items-center justify-between gap-4"
      >
        {/* Monogram + wordmark. The mark keeps the bar anchored when the wordmark
            is dropped on very narrow phones. */}
        <a href="#about" className="group flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-glow-sm transition-transform duration-500 ease-spring group-hover:rotate-[-6deg] group-hover:scale-105"
          >
            VP
          </span>
          <span className="hidden font-sans text-base font-semibold tracking-wide text-white xs:inline sm:text-lg">
            Vallabh<span className="text-brand-400"> Patil</span>
          </span>
        </a>

        {/* Desktop navigation — shown only where six links plus a button genuinely
            fit. The old breakpoint was `sm` (640px), which crushed them together. */}
        <DesktopLinks activeSection={activeSection} />

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center gap-2 rounded-full border border-brand-500/60 px-4 py-2 text-sm font-medium text-brand-300
                     transition-[transform,background-color,color,border-color] duration-300 ease-spring
                     hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-600 hover:text-white lg:inline-flex xl:px-5
                     motion-reduce:hover:translate-y-0"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Github
        </a>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          // 44px minimum, so the tap target meets touch guidelines.
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-hairline text-white transition-colors duration-300 hover:bg-white/10 lg:hidden"
        >
          {/* Three bars that morph into a cross, rather than swapping icons. */}
          <span aria-hidden="true" className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-spring ${
                isMenuOpen ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-spring ${
                isMenuOpen ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </nav>

      <ScrollProgress />

      <div
        id={menuId}
        ref={panelRef}
        hidden={!isMenuOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-b border-hairline bg-ink/95 shadow-2xl backdrop-blur-xl lg:hidden"
      >
        <ul className="container-page flex flex-col py-3">
          {NAV_LINKS.map(({ id, label }, index) => {
            const isActive = activeSection === id
            return (
              <li
                key={id}
                // Staggered slide-in each time the drawer opens. `isMenuOpen`
                // gates the class so it replays rather than running once.
                className={isMenuOpen ? 'animate-fade-up' : ''}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <a
                  href={`#${id}`}
                  onClick={closeMenu}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`text-xs font-medium tabular-nums ${
                      isActive ? 'text-brand-400' : 'text-gray-600'
                    }`}
                  >
                    0{index + 1}
                  </span>
                  {label}
                </a>
              </li>
            )
          })}
          <li className="px-1 pb-2 pt-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="btn-primary w-full"
            >
              Github Profile
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
