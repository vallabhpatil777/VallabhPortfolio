import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, useAnimations, useGLTF } from '@react-three/drei'
import {
  Cache,
  LoopOnce,
  LoopRepeat,
  MathUtils,
  type AnimationAction,
  type Group,
  type Points,
} from 'three'
import { DRACO_PATH, MODEL_URL } from './avatarConfig'
import { primeLoaderCache, releaseAvatarBytes } from './avatarPreload'
import { AvatarLoadingStage } from './AvatarStage'

const pickClip = (names: string[], wanted: string, fallbackIndex: number) =>
  names.find((name) => name.toLowerCase() === wanted) ?? names[fallbackIndex] ?? names[0]

function Model({ interactive, onReady }: { interactive: boolean; onReady: () => void }) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(MODEL_URL, DRACO_PATH)
  const { actions, mixer } = useAnimations(animations, group)

  const clips = useMemo(() => {
    const names = animations.map((clip) => clip.name)
    return {
      crouch: pickClip(names, 'crouch', 0),
      waving: pickClip(names, 'waving', 1),
      stagger: pickClip(names, 'stagger', 2),
    }
  }, [animations])

  // This component only mounts once `useGLTF` has resolved *and* parsed, so this
  // is the exact moment the avatar becomes real. Two frames of slack let the
  // renderer actually draw it before the parent cross-fades the canvas in —
  // otherwise the fade reveals one blank frame first, which is the flicker the
  // whole loading treatment exists to remove.
  useEffect(() => {
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(onReady)
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [onReady])

  // Intro sequence: crouch once, then settle into the looping wave.
  useEffect(() => {
    const crouch = actions[clips.crouch]
    const waving = actions[clips.waving]
    if (!waving) return

    const startWaving = () => {
      waving.reset().setLoop(LoopRepeat, Infinity).fadeIn(0.3).play()
    }

    if (crouch && crouch !== waving) {
      crouch.reset().setLoop(LoopOnce, 1).play()
      crouch.clampWhenFinished = true

      const onFinished = (event: { action: AnimationAction }) => {
        if (event.action === crouch) startWaving()
      }

      mixer.addEventListener('finished', onFinished as never)
      return () => {
        mixer.removeEventListener('finished', onFinished as never)
        mixer.stopAllAction()
      }
    }

    startWaving()
    return () => mixer.stopAllAction()
  }, [actions, clips, mixer])

  // Note: `useAnimations` already advances the mixer inside its own `useFrame`,
  // which is what ties playback to the (pausable) render loop. Do not step the
  // mixer again here or every clip plays at double speed.

  const handleClick = () => {
    if (!interactive) return
    const stagger = actions[clips.stagger]
    const waving = actions[clips.waving]
    if (!stagger || stagger === waving) return

    // Ignore repeat clicks while the reaction is still playing, otherwise each
    // click resets the clip and it never visibly completes.
    if (stagger.isRunning()) return

    // The wave has to be faded OUT for the click reaction to read. An
    // AnimationMixer blends every running action by weight, so leaving `waving`
    // at full weight averages the two clips together and the stagger barely
    // moves the model — which looks like clicking does nothing at all.
    waving?.fadeOut(0.2)

    stagger.reset().setEffectiveWeight(1).setLoop(LoopOnce, 1).play()
    stagger.clampWhenFinished = true

    const onFinished = (event: { action: AnimationAction }) => {
      if (event.action !== stagger) return
      mixer.removeEventListener('finished', onFinished as never)
      // Hand the model back to the idle wave.
      stagger.fadeOut(0.25)
      waving?.reset().setEffectiveWeight(1).setLoop(LoopRepeat, Infinity).fadeIn(0.25).play()
    }
    mixer.addEventListener('finished', onFinished as never)
  }

  return (
    <group ref={group}>
      <primitive
        object={scene}
        dispose={null}
        scale={2.6}
        position={[-0.1, -2.1, 0]}
        onClick={handleClick}
        onPointerOver={() => {
          if (interactive) document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
        castShadow
        receiveShadow
      />
    </group>
  )
}

/**
 * Drifting point cloud behind the avatar.
 *
 * Costs no extra bytes — three.js is already here for the model — and gives the
 * stage depth, so the avatar reads as standing *in* something rather than
 * floating on a flat panel. Sits at negative Z so it can never occlude the
 * model, and opts out of raycasting so it cannot steal the click that plays the
 * reaction animation.
 */
function ParticleField({ count, animate }: { count: number; animate: boolean }) {
  const ref = useRef<Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 20
      array[i * 3 + 1] = (Math.random() - 0.5) * 16
      // Pushed to z <= -6 for two reasons: it keeps the field behind the model,
      // and it puts every particle outside the ContactShadows ortho frustum
      // below (9 units wide, so z from -4.5 to 4.5). That matters because
      // ContactShadows renders the *whole* scene through an override depth
      // material with no way to exclude an object — any particle inside its
      // frustum would speckle the shadow under the avatar's feet.
      array[i * 3 + 2] = -6 - Math.random() * 10
    }
    return array
  }, [count])

  useFrame((state, delta) => {
    const points = ref.current
    if (!points || !animate) return
    points.rotation.y += delta * 0.02
    // Parallax toward the pointer. `lerp` rather than a direct set, so the field
    // trails the cursor instead of snapping to it.
    points.position.x = MathUtils.lerp(points.position.x, state.pointer.x * 0.5, 0.04)
    points.position.y = MathUtils.lerp(points.position.y, state.pointer.y * 0.3, 0.04)
  })

  return (
    <points ref={ref} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#9d6ef0"
        transparent
        opacity={0.75}
        sizeAttenuation
        // Points overlap heavily; without this they punch holes in each other.
        depthWrite={false}
      />
    </points>
  )
}

/**
 * Eases the camera back as the hero scrolls away, for a little parallax depth.
 *
 * Reads `window.scrollY` inside the frame loop rather than from a scroll
 * listener: the loop is already running (and is stopped entirely once the hero
 * leaves the viewport), so this adds no listener and cannot fire while the
 * canvas is idle.
 */
function ScrollDolly({ enabled }: { enabled: boolean }) {
  const camera = useThree((state) => state.camera)

  useFrame(() => {
    if (!enabled) return
    const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
    camera.position.z = MathUtils.lerp(camera.position.z, 10 + progress * 1.8, 0.08)
    camera.position.y = MathUtils.lerp(camera.position.y, 2 + progress * 0.5, 0.08)
  })

  return null
}

type Props = {
  /** Pause the render loop when the hero scrolls out of view. */
  active: boolean
  /** Shadows and antialiasing are skipped on low-power devices. */
  highQuality: boolean
}

export default function Avatar3D({ active, highQuality }: Props) {
  const [ready, setReady] = useState(false)
  const [primed, setPrimed] = useState(false)

  // `useGLTF` must not run until the pre-fetched bytes are sitting in three's
  // loader cache — otherwise GLTFLoader starts its own request for the same file
  // and the visitor downloads the model twice. `primeLoaderCache` resolves either
  // way (it is a no-op when the pre-fetch failed), so this can never deadlock.
  useEffect(() => {
    let cancelled = false
    void primeLoaderCache(Cache).then(() => {
      if (!cancelled) setPrimed(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const handleReady = useCallback(() => {
    setReady(true)
    // The raw GLB bytes have done their job; drei holds the parsed scene now.
    releaseAvatarBytes(Cache)
  }, [])

  return (
    <div className="relative h-full w-full">
      {/* The canvas mounts immediately — only `Model` suspends, and it does so
          against the boundary *inside* the canvas below. That is what lets the
          progress UI stay on screen instead of the whole component being
          replaced by a bare fallback.

          NEVER put a CSS transform on this element or any ancestor of the
          canvas. react-three-fiber measures the canvas with
          `getBoundingClientRect()` (which returns the *transformed* box) but
          raycasts using `event.offsetX / size.width` — and `offsetX` is in the
          element's own untransformed coordinates. A `scale(0.9)` here therefore
          skews every pointer ray by ~11%, and because a transform change does
          not fire a ResizeObserver, the wrong size sticks even after the scale
          returns to 1. That is what silently broke click-to-react on the model.
          Fade with opacity only; the scale-in lives on the loading overlay,
          which contains no canvas. */}
      <div
        className={`h-full w-full transition-opacity duration-700 ease-out ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Canvas
          // `never` fully stops the render loop once the hero leaves the viewport,
          // so the GPU is idle while the visitor reads the rest of the page.
          frameloop={active ? 'always' : 'never'}
          shadows={highQuality}
          camera={{ position: [0, 2, 10], fov: 35 }}
          // Cap the device pixel ratio: retina phones would otherwise render 3x.
          dpr={[1, highQuality ? 1.75 : 1.25]}
          performance={{ min: 0.5 }}
          gl={{ antialias: highQuality, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.7} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.5}
            penumbra={0.5}
            intensity={2}
            castShadow={highQuality}
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
          {/* Fill light only — no second shadow map to render. */}
          <directionalLight position={[-5, 5, 5]} intensity={0.6} />

          {/* Replaces the flat grey cylinder that used to stand in for a floor.
              A real contact shadow grounds the model instead of parking it on a
              disc, and costs one small render-target pass. */}
          <ContactShadows
            position={[0, -2.26, 0]}
            scale={9}
            far={3}
            blur={2.6}
            opacity={0.7}
            resolution={highQuality ? 512 : 256}
            color="#05030f"
          />

          <ParticleField count={highQuality ? 700 : 260} animate={highQuality} />
          <ScrollDolly enabled={highQuality} />

          <Suspense fallback={null}>
            {primed && <Model interactive={active} onReady={handleReady} />}
          </Suspense>
        </Canvas>
      </div>

      {/* Cross-fade rather than an abrupt swap. The scale lives here, on the
          overlay, precisely because this subtree holds no canvas. */}
      <div
        className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-spring ${
          ready ? 'pointer-events-none scale-105 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {!ready && <AvatarLoadingStage />}
      </div>
    </div>
  )
}
