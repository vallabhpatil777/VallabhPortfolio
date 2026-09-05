import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import ErrorBoundary from '../common/ErrorBoundary'
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useSaveData } from '../../hooks/useSaveData'
import { AvatarFrame, AvatarLoadingStage } from './AvatarStage'
import { preloadAvatar } from './avatarPreload'
import { projects } from '../../data/projects'

// three.js + drei are ~600 KB of the bundle. They live in their own chunk that is
// only requested when we have actually decided to render the avatar.
const Avatar3D = lazy(() => import('./Avatar3D'))

const ROLES = [
  'AI Engineer',
  'Full Stack Developer',
  'AI & ML Engineer',
  'Cloud Enthusiast',
] as const
const TYPING_MS = 110
const DELETING_MS = 60
const HOLD_MS = 1600

/**
 * Served from `public/` rather than Google Drive, so the button always resolves
 * to the CV committed alongside the site — no sharing permissions to expire.
 */
const RESUME_URL = '/Vallabh-Patil-CV.pdf'

const SUMMARY =
  'AI Engineer with hands-on experience building and improving LLM-based systems, including RAG pipelines and AI agents — evaluating model outputs, identifying failure cases, and improving response quality through prompt design and retrieval strategies.'

const STATS = [
  { value: '3+', label: 'Years experience' },
  { value: `${projects.length}`, label: 'Projects shipped' },
  // Value + label read as one phrase down the column: "MSc / Advanced Computer
  // Science". Cardiff is left to the Education timeline rather than crammed in.
  { value: 'MSc', label: 'Advanced Computer Science, Distinction' },
] as const

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/vallabhpatil777',
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vallabh-patil-63248b144',
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.65h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H9z',
  },
  {
    label: 'Email',
    href: 'mailto:vallabhpatil777@gmail.com',
    path: 'M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5zm2.4-.5 7.6 5.6L19.6 6z',
  },
] as const

/** Cycles the role strings with a typewriter effect. Static when motion is reduced. */
function useTypewriter(enabled: boolean) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const current = ROLES[index % ROLES.length]

    if (!isDeleting && text === current) {
      const hold = setTimeout(() => setIsDeleting(true), HOLD_MS)
      return () => clearTimeout(hold)
    }

    if (isDeleting && text === '') {
      setIsDeleting(false)
      setIndex((value) => value + 1)
      return
    }

    const timer = setTimeout(
      () =>
        setText((prev) =>
          isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1),
        ),
      isDeleting ? DELETING_MS : TYPING_MS,
    )
    return () => clearTimeout(timer)
  }, [text, isDeleting, index, enabled])

  // `role` is the full word being typed; the article ("a"/"an") has to agree with
  // it rather than with the partially-typed `text`, which is empty between roles.
  const role = ROLES[index % ROLES.length]
  return enabled ? { text, role } : { text: ROLES[0], role: ROLES[0] }
}

/**
 * Entrance stagger. The hero is above the fold, so it animates on mount rather
 * than on scroll — no observer needed, and `animation-fill-mode: both` means the
 * reduced-motion override in index.css lands it straight on the final state.
 */
const enter = (delay: number): CSSProperties => ({ animationDelay: `${delay}ms` })

export default function Intro() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const saveData = useSaveData()

  const stageRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)
  const [optedIn, setOptedIn] = useState(false)

  const { text, role: currentRole } = useTypewriter(!prefersReducedMotion)

  // Data Saver users get an explicit opt-in rather than a silent multi-megabyte
  // download; everyone else gets the avatar as soon as the hero is on screen.
  const requiresOptIn = saveData
  const shouldRender = (hasBeenSeen && !requiresOptIn) || optedIn

  useEffect(() => {
    const node = stageRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setHasBeenSeen(true)
      },
      // Start fetching slightly before the stage scrolls in, and keep the render
      // loop alive until it is comfortably out of view.
      { rootMargin: '200px 0px', threshold: 0.01 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Warm every cache the avatar needs the moment we know it will be used: the
  // model bytes, the Draco decoder and the renderer chunk all start together
  // rather than one after another.
  //
  // `preloadAvatar` is imported statically on purpose. The module is tiny and
  // pulls in nothing heavy — `AvatarStage` already needs it for the progress
  // read-out — so routing it through a dynamic `import()` would only add a tick
  // before the model request could start.
  useEffect(() => {
    if (!shouldRender) return
    void preloadAvatar()
  }, [shouldRender])

  return (
    <div className="container-page relative flex flex-col items-center pb-10 pt-6 sm:pb-14 sm:pt-10 lg:pb-24 lg:pt-16">
      <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
        {/* Copy — first in the DOM so it renders (and is read) before the avatar. */}
        <div className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left">
          <p className="animate-fade-up" style={enter(0)}>
            <span className="eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to opportunities
            </span>
          </p>

          <h1
            className="mt-5 animate-fade-up font-sans text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.1] text-white"
            style={enter(80)}
          >
            Hi, I am
            <span className="gradient-text block">Vallabh Patil</span>
          </h1>

          <p
            className="flex animate-fade-up flex-wrap items-center justify-center gap-x-2 py-4 font-sans text-[clamp(1rem,3.6vw,1.5rem)] font-semibold text-white sm:py-5 lg:justify-start"
            style={enter(160)}
          >
            {/* "an AI Engineer" but "a Full Stack Developer" — the article has to
                follow whichever role is currently typed out. */}
            <span>I am {/^[AEIOU]/i.test(currentRole) ? 'an' : 'a'}</span>
            {/* aria-live keeps the cycling text from being announced repeatedly. */}
            <span className="text-brand-400" aria-live="off">
              {text}
            </span>
            {!prefersReducedMotion && (
              <span className="animate-blink text-brand-400" aria-hidden="true">
                |
              </span>
            )}
          </p>

          <p
            className="animate-fade-up font-sans text-xs tracking-[0.22em] text-gray-500 sm:text-sm"
            style={enter(220)}
          >
            INNOVATING TODAY FOR A SMARTER TOMORROW
          </p>

          <p
            className="mx-auto mt-5 max-w-xl animate-fade-up text-sm leading-relaxed text-gray-400 sm:text-base lg:mx-0"
            style={enter(280)}
          >
            {SUMMARY}
          </p>

          {/* Stat strip — three facts a recruiter scans for, above the fold. */}
          <dl
            className="mt-7 flex animate-fade-up flex-wrap justify-center gap-x-8 gap-y-4 lg:justify-start"
            style={enter(340)}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <span className="block text-2xl font-semibold text-white sm:text-[1.75rem]">
                    {stat.value}
                  </span>
                  <span className="mt-0.5 block max-w-[11rem] text-xs text-gray-500">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <p
            className="mt-6 flex animate-fade-up items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start"
            style={enter(380)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-brand-400"
              fill="currentColor"
            >
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
            </svg>
            Birmingham, UK
          </p>

          <div
            className="mt-8 flex animate-fade-up flex-col items-center gap-4 sm:flex-row sm:flex-wrap lg:items-start lg:justify-start"
            style={enter(440)}
          >
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary h-12 w-full max-w-[280px] text-base sm:h-14 sm:w-auto sm:max-w-none sm:text-lg"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 3a1 1 0 0 1 1 1v9.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V4a1 1 0 0 1 1-1zM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z" />
              </svg>
              Resume
            </a>

            <a
              href="#contact"
              className="btn-ghost h-12 w-full max-w-[280px] text-base sm:h-14 sm:w-auto sm:max-w-none sm:text-lg"
            >
              Let&rsquo;s talk
            </a>

            <ul className="flex items-center gap-2 sm:ml-1">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-grid h-11 w-11 place-items-center rounded-full border border-hairline text-gray-400
                               transition-[transform,color,border-color,background-color] duration-300 ease-spring
                               hover:-translate-y-0.5 hover:border-brand-500/60 hover:bg-brand-500/10 hover:text-white
                               motion-reduce:hover:translate-y-0"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3D stage — fluid box, so it never forces horizontal scroll on a phone. */}
        <div
          ref={stageRef}
          className="order-1 w-full max-w-[min(88vw,340px)] shrink-0 animate-fade-up [aspect-ratio:4/5] xs:max-w-[min(80vw,400px)] sm:max-w-[440px] lg:order-2 lg:max-w-[min(45vw,520px)]"
          style={enter(120)}
        >
          <AvatarFrame>
            {shouldRender ? (
              <ErrorBoundary
                label="Avatar3D"
                fallback={
                  <div className="surface-card grid h-full w-full place-items-center">
                    <p className="px-6 text-center text-sm text-gray-400">
                      The 3D avatar could not be displayed on this device.
                    </p>
                  </div>
                }
              >
                {/* The fallback here is the *same* stage the canvas shows while the
                    model streams in, so the handover from "JS chunk downloading"
                    to "model downloading" is invisible. */}
                <Suspense fallback={<AvatarLoadingStage />}>
                  <Avatar3D active={inView} highQuality={!isMobile && !prefersReducedMotion} />
                </Suspense>
              </ErrorBoundary>
            ) : requiresOptIn ? (
              <div className="surface-card grid h-full w-full place-items-center">
                <div className="px-6 text-center">
                  <p className="mb-4 text-sm text-gray-400">
                    The interactive 3D avatar is a large download and was skipped because
                    your device is set to save data.
                  </p>
                  <button type="button" onClick={() => setOptedIn(true)} className="btn-primary text-sm">
                    Load 3D avatar
                  </button>
                </div>
              </div>
            ) : (
              <AvatarLoadingStage />
            )}
          </AvatarFrame>
        </div>
      </div>

      {/* Scroll cue. Hidden on short viewports where it would collide with the
          CTA row rather than sitting clear beneath it. */}
      <a
        href="#skills"
        aria-label="Scroll to skills"
        className="mt-12 hidden animate-fade-up flex-col items-center gap-2 text-gray-500 transition-colors duration-300 hover:text-brand-400 lg:flex"
        style={enter(560)}
      >
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em]">Scroll</span>
        <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-hairline pt-1.5">
          <span className="h-1.5 w-1 animate-scroll-hint rounded-full bg-current motion-reduce:animate-none" />
        </span>
      </a>
    </div>
  )
}
