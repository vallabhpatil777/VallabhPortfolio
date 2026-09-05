import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, MathUtils, type Group } from 'three'

/**
 * Ambient 3D graph behind the Skills heading — nodes joined by edges, turning
 * slowly and drifting with the pointer.
 *
 * Chosen over generic decorative geometry because it is the actual shape of the
 * work: retrieval, embeddings and agent graphs are all nodes and edges.
 *
 * Two deliberate decisions:
 *
 * 1. **Its own `<Canvas>`, not drei's `<View>`.** `<View>` would render this and
 *    the hero avatar from one shared canvas, which is the tidier architecture —
 *    but it requires hoisting a single fixed, viewport-sized canvas to the app
 *    root and re-parenting the avatar into it. Two WebGL contexts is well inside
 *    what browsers allow (the practical ceiling is 8–16), so the second canvas
 *    buys the same result for none of the risk to a hero that already works.
 * 2. **No new bytes.** three.js and fiber are already in the bundle for the
 *    avatar, so this component is only the few hundred bytes below.
 */

const NODE_COUNT = 18
const RADIUS = 2.6
/** Two nodes closer than this get an edge. Tuned for a readable, sparse mesh. */
const LINK_DISTANCE = 2.5

type Vec3 = [number, number, number]

/** Nodes spread evenly over a sphere via the golden-angle spiral. */
function buildNodes(): Vec3[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: NODE_COUNT }, (_, index) => {
    const y = 1 - (index / (NODE_COUNT - 1)) * 2
    const ring = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * index
    return [
      Math.cos(theta) * ring * RADIUS,
      y * RADIUS,
      Math.sin(theta) * ring * RADIUS,
    ] as Vec3
  })
}

function Graph({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null)

  const { nodes, edges } = useMemo(() => {
    const points = buildNodes()

    // One flat position buffer holding a pair of endpoints per edge, drawn as a
    // single `lineSegments` — far cheaper than a mesh per connection.
    const segments: number[] = []
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const [ax, ay, az] = points[i]
        const [bx, by, bz] = points[j]
        const distance = Math.hypot(ax - bx, ay - by, az - bz)
        if (distance > LINK_DISTANCE) continue
        segments.push(ax, ay, az, bx, by, bz)
      }
    }

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(segments, 3))
    return { nodes: points, edges: geometry }
  }, [])

  useFrame((state, delta) => {
    const node = group.current
    if (!node || !animate) return
    node.rotation.y += delta * 0.12
    node.rotation.x = MathUtils.lerp(node.rotation.x, state.pointer.y * 0.35, 0.04)
    node.rotation.z = MathUtils.lerp(node.rotation.z, state.pointer.x * -0.2, 0.04)
  })

  return (
    <group ref={group}>
      <lineSegments geometry={edges} raycast={() => null}>
        <lineBasicMaterial color="#854CE6" transparent opacity={0.32} />
      </lineSegments>

      {nodes.map((position, index) => (
        <mesh key={index} position={position} raycast={() => null}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshBasicMaterial color={index % 4 === 0 ? '#22d3ee' : '#9d6ef0'} />
        </mesh>
      ))}
    </group>
  )
}

type Props = {
  /** Pause the render loop while the section is off screen. */
  active: boolean
  /** Rotation and pointer drift are skipped on low-power and reduced-motion. */
  animate: boolean
}

export default function KnowledgeGraph({ active, animate }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.5]}
      // Purely decorative: it must never intercept a click meant for the
      // heading or the cards behind it.
      style={{ pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Graph animate={animate} />
    </Canvas>
  )
}
