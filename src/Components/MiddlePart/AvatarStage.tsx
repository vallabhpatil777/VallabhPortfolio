import { useSyncExternalStore, type ReactNode } from 'react'
import { getAvatarProgress, subscribeAvatarProgress } from './avatarPreload'

/**
 * The hero's 3D stage and the placeholder shown while it loads.
 *
 * Deliberately free of any three.js import: this has to be in the entry bundle so
 * it can paint on the very first frame, long before the ~790 kB renderer chunk
 * lands. That is the whole point — the old placeholder was an empty bordered box
 * that sat blank for the entire download and then swapped abruptly to a fully
 * rendered avatar.
 */

const RING_RADIUS = 46
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

/** Live download progress (0–1) from the shared preloader. */
function useAvatarProgress(): number {
  return useSyncExternalStore(subscribeAvatarProgress, getAvatarProgress, () => 0)
}

/**
 * Decorative shell the avatar sits inside: a soft brand halo behind it and a
 * floor glow that reads as a pedestal. Deliberately frameless — a bordered box
 * around the model looked like a placeholder that had failed to fill in.
 * Rendered for both the loading state and the live canvas so nothing shifts when
 * the two swap over.
 */
export function AvatarFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full">
      {/* Halo behind the whole stage. The bleed past the box is kept small and
          the gradient fades to nothing well before its edge, so the glow can
          never wash over the copy column sitting beside it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%] rounded-full opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(closest-side, rgba(133,76,230,0.30), rgba(34,211,238,0.10) 55%, transparent 78%)',
        }}
      />

      {/* Floor glow under the model's feet. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[6%] left-1/2 h-[10%] w-[62%] -translate-x-1/2 rounded-[50%] blur-md"
        style={{
          backgroundImage:
            'radial-gradient(closest-side, rgba(133,76,230,0.45), transparent 72%)',
        }}
      />

      <div className="relative h-full w-full">{children}</div>
    </div>
  )
}

/**
 * Loading state: a determinate ring driven by the real byte count, a drifting
 * sheen and a ghosted figure so the panel reads as "an avatar is arriving"
 * rather than "something is broken".
 */
export function AvatarLoadingStage() {
  const progress = useAvatarProgress()
  const percent = Math.round(progress * 100)
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress)

  return (
    // `progressbar` rather than a live region: `role="status"` would make a
    // screen reader read out every single percentage change.
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden"
      role="progressbar"
      aria-label="Loading 3D avatar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Sheen sweeping across the empty stage. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.07] to-transparent motion-reduce:hidden"
      />

      {/* Ghosted figure: head + shoulders, hinting at what is about to appear. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 150"
        className="pointer-events-none absolute bottom-[14%] left-1/2 h-[52%] -translate-x-1/2 opacity-[0.09]"
      >
        <circle cx="60" cy="34" r="26" fill="currentColor" className="text-brand-300" />
        <path
          d="M12 150c0-30 21-52 48-52s48 22 48 52z"
          fill="currentColor"
          className="text-brand-300"
        />
      </svg>

      <div className="relative grid h-28 w-28 place-items-center">
        {/* Slowly rotating dashed ring — the indeterminate half of the signal, so
            the panel still feels alive during the pre-download pause. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 110 110"
          className="absolute inset-0 h-full w-full animate-spin-slow text-brand-500/35 motion-reduce:animate-none"
        >
          <circle
            cx="55"
            cy="55"
            r="53"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 10"
            strokeLinecap="round"
          />
        </svg>

        {/* Determinate progress arc. */}
        <svg aria-hidden="true" viewBox="0 0 110 110" className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="55"
            cy="55"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="3"
          />
          <circle
            cx="55"
            cy="55"
            r={RING_RADIUS}
            fill="none"
            stroke="url(#avatar-ring)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 400ms ease-out' }}
          />
          <defs>
            <linearGradient id="avatar-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#854CE6" />
            </linearGradient>
          </defs>
        </svg>

        <span className="text-lg font-semibold tabular-nums text-white">{percent}%</span>
      </div>

      <p className="px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
        {percent < 100 ? 'Loading avatar' : 'Almost there'}
      </p>
    </div>
  )
}
