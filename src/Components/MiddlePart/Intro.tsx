import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import ErrorBoundary from '../common/ErrorBoundary'
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useSaveData } from '../../hooks/useSaveData'

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

/** Shown while the 3D chunk downloads, and in place of it on opt-out paths. */
function AvatarPlaceholder({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-hairline bg-surface/40">
      {children}
    </div>
  )
}

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

  // Warm the model cache in the background once we know it will be needed.
  useEffect(() => {
    if (!shouldRender) return
    let cancelled = false
    import('./avatarPreload').then((module) => {
      if (!cancelled) void module.preloadAvatar()
    })
    return () => {
      cancelled = true
    }
  }, [shouldRender])

  return (
    <div className="container-page flex flex-col items-center pb-8 pt-6 sm:pb-12 sm:pt-10 lg:pb-20 lg:pt-16">
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        {/* Copy — first in the DOM so it renders (and is read) before the avatar. */}
        <div className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left">
          <h1 className="font-sans text-[clamp(2rem,7vw,3.125rem)] font-semibold leading-tight text-white">
            Hi, I am
            <span className="block">Vallabh Patil</span>
          </h1>

          <p className="flex flex-wrap items-center justify-center gap-x-2 py-4 font-sans text-[clamp(1rem,3.6vw,1.5rem)] font-semibold text-white sm:py-5 lg:justify-start">
            {/* "an AI Engineer" but "a Full Stack Developer" — the article has to
                follow whichever role is currently typed out. */}
            <span>I am {/^[AEIOU]/i.test(currentRole) ? 'an' : 'a'}</span>
            {/* aria-live keeps the cycling text from being announced repeatedly. */}
            <span className="text-brand-600" aria-live="off">
              {text}
            </span>
            {!prefersReducedMotion && (
              <span className="animate-blink text-brand-600" aria-hidden="true">
                |
              </span>
            )}
          </p>

          <p className="font-sans text-sm tracking-wide text-gray-500 sm:text-base">
            INNOVATING TODAY FOR A SMARTER TOMORROW
          </p>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base lg:mx-0">
            {SUMMARY}
          </p>

          <p className="mt-4 text-sm text-gray-500">
            <span aria-hidden="true">📍</span> Birmingham, UK
          </p>

          <div className="mt-8 lg:mt-10">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary h-12 w-full max-w-[280px] text-base sm:h-14 sm:max-w-[300px] sm:text-lg"
            >
              Resume
            </a>
          </div>
        </div>

        {/* 3D stage — fluid box, so it never forces horizontal scroll on a phone. */}
        <div
          ref={stageRef}
          className="order-1 w-full max-w-[min(88vw,340px)] shrink-0 [aspect-ratio:4/5] xs:max-w-[min(80vw,400px)] sm:max-w-[440px] lg:order-2 lg:max-w-[min(45vw,520px)]"
        >
          {shouldRender ? (
            <ErrorBoundary
              label="Avatar3D"
              fallback={
                <AvatarPlaceholder>
                  <p className="px-6 text-center text-sm text-gray-400">
                    The 3D avatar could not be displayed on this device.
                  </p>
                </AvatarPlaceholder>
              }
            >
              <div className="relative h-full w-full">
                <Suspense
                  fallback={
                    <AvatarPlaceholder>
                      <div
                        className="h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-brand-500"
                        role="status"
                        aria-label="Loading 3D avatar"
                      />
                    </AvatarPlaceholder>
                  }
                >
                  <Avatar3D active={inView} highQuality={!isMobile && !prefersReducedMotion} />
                </Suspense>
              </div>
            </ErrorBoundary>
          ) : (
            <AvatarPlaceholder>
              {requiresOptIn ? (
                <div className="px-6 text-center">
                  <p className="mb-4 text-sm text-gray-400">
                    The interactive 3D avatar is a large download and was skipped because
                    your device is set to save data.
                  </p>
                  <button type="button" onClick={() => setOptedIn(true)} className="btn-primary text-sm">
                    Load 3D avatar
                  </button>
                </div>
              ) : null}
            </AvatarPlaceholder>
          )}
        </div>
      </div>
    </div>
  )
}
