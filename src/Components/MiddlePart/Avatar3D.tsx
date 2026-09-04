import { useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useAnimations, useGLTF, useProgress } from '@react-three/drei'
import { LoopOnce, LoopRepeat, type AnimationAction, type Group } from 'three'
import { DRACO_PATH, MODEL_URL } from './avatarConfig'

const pickClip = (names: string[], wanted: string, fallbackIndex: number) =>
  names.find((name) => name.toLowerCase() === wanted) ?? names[fallbackIndex] ?? names[0]

function Model({ interactive }: { interactive: boolean }) {
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

/** Percentage read-out driven by the real GLTF download progress. */
function LoadingOverlay() {
  const { active, progress } = useProgress()
  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div
        className="h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-brand-500"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading 3D avatar"
      />
      <span className="text-sm tabular-nums text-gray-400">{Math.round(progress)}%</span>
    </div>
  )
}

type Props = {
  /** Pause the render loop when the hero scrolls out of view. */
  active: boolean
  /** Shadows and antialiasing are skipped on low-power devices. */
  highQuality: boolean
}

export default function Avatar3D({ active, highQuality }: Props) {
  return (
    <>
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

        <mesh position={[0.3, -2.3, 0]} receiveShadow>
          <cylinderGeometry args={[1.1, 1.4, 0.2, 48]} />
          <meshStandardMaterial color="#5B595E" />
        </mesh>

        <Model interactive={active} />
      </Canvas>
      <LoadingOverlay />
    </>
  )
}
