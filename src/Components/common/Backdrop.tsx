/**
 * Ambient page background: aurora fields, a masked grid, film grain and a
 * vignette.
 *
 * Layering rules that are load-bearing:
 *
 * - This sits at `-z-20`, *behind* the snowfall layer at `-z-10`. Both are
 *   negative, so the page content (normal flow) still paints on top of them.
 * - The page colour still lives on `html` only (see index.css). Nothing here
 *   sets a background on `body`, which would hide the snow.
 *
 * Performance note: the colour fields are `radial-gradient` backgrounds rather
 * than solid circles behind a `filter: blur()`. A gradient is already soft, so
 * the browser never has to run a large blur pass every frame — the only thing
 * animating is a compositor-friendly `transform`.
 */

/** Tiny tiled turbulence — adds texture so the flat dark areas do not band. */
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

type FieldProps = {
  className: string
  /** `rgb()` triplet for the gradient core. */
  color: string
  /** Peak alpha at the centre of the field. */
  alpha: number
}

function Field({ className, color, alpha }: FieldProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full will-change-transform ${className}`}
      style={{
        backgroundImage: `radial-gradient(closest-side, rgba(${color},${alpha}), rgba(${color},${alpha * 0.35}) 45%, transparent 78%)`,
      }}
    />
  )
}

export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Base wash — slightly lifts the top of the page away from pure black. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 50% -20%, rgba(133,76,230,0.20), transparent 60%),' +
            'radial-gradient(90% 60% at 100% 100%, rgba(34,211,238,0.10), transparent 65%),' +
            'linear-gradient(180deg, #0b0b1d 0%, #090917 45%, #07071a 100%)',
        }}
      />

      {/* Aurora fields. Sized in `vmax` so they scale with the viewport instead of
          leaving bald corners on ultrawide monitors. */}
      <Field
        className="left-[-15vmax] top-[-18vmax] h-[62vmax] w-[62vmax] animate-drift-a motion-reduce:animate-none"
        color="133,76,230"
        alpha={0.34}
      />
      <Field
        className="right-[-20vmax] top-[8vmax] h-[55vmax] w-[55vmax] animate-drift-b motion-reduce:animate-none"
        color="34,211,238"
        alpha={0.16}
      />
      {/* Third field is desktop-only: on a phone it would sit almost entirely
          off-screen while still costing a paint. */}
      <Field
        className="bottom-[-22vmax] left-[10vmax] hidden h-[58vmax] w-[58vmax] animate-drift-c motion-reduce:animate-none lg:block"
        color="111,16,191"
        alpha={0.26}
      />

      {/* Blueprint grid, faded out toward the edges so it never reads as a table. */}
      <div
        className="absolute inset-0 bg-grid-fade bg-grid"
        style={{
          maskImage: 'radial-gradient(100% 70% at 50% 0%, #000 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(100% 70% at 50% 0%, #000 10%, transparent 75%)',
        }}
      />

      {/* Grain. `mix-blend-overlay` keeps it from greying out the dark areas. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URL, backgroundSize: '160px 160px' }}
      />

      {/* Vignette — pulls focus to the middle column of content. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 100% at 50% 50%, transparent 45%, rgba(3,3,10,0.55) 100%)',
        }}
      />
    </div>
  )
}
