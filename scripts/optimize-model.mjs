/**
 * Asset pipeline for the hero avatar (`public/model.glb`).
 *
 * The Avaturn export shipped 187 facial blendshapes (morph targets) totalling
 * ~6.4 MB. Nothing drives them: all three animation clips only animate node
 * translation/rotation/scale, and no node carries explicit morph weights — so
 * they cost every visitor megabytes and never change a rendered pixel.
 *
 * This script drops them, then runs the standard compression passes:
 * textures to WebP at 1024px, geometry through Draco.
 *
 * Usage: node scripts/optimize-model.mjs <input.glb> <output.glb>
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import {
  dedup,
  draco,
  prune,
  resample,
  textureCompress,
  weld,
} from '@gltf-transform/functions'
import draco3d from 'draco3dgltf'
import sharp from 'sharp'
import { statSync } from 'node:fs'

const [input, output] = process.argv.slice(2)
if (!input || !output) {
  console.error('usage: node scripts/optimize-model.mjs <input.glb> <output.glb>')
  process.exit(1)
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
})

const document = await io.read(input)
const root = document.getRoot()

// --- Verify the morph targets really are inert before removing them. ---
const drivesWeights = root
  .listAnimations()
  .some((animation) =>
    animation.listChannels().some((channel) => channel.getTargetPath() === 'weights'),
  )

if (drivesWeights) {
  console.error('Aborting: an animation channel targets morph weights; they are in use.')
  process.exit(1)
}

let removedTargets = 0
for (const mesh of root.listMeshes()) {
  for (const primitive of mesh.listPrimitives()) {
    for (const target of primitive.listTargets()) {
      primitive.removeTarget(target)
      target.dispose()
      removedTargets++
    }
  }
  mesh.setWeights([])
  mesh.setExtras({ ...mesh.getExtras(), targetNames: undefined })
}
console.log(`removed ${removedTargets} morph targets`)

await document.transform(
  dedup(),
  // `prune` sweeps up the accessors the morph targets left behind.
  prune({ keepLeaves: false }),
  weld(),
  // Drop redundant keyframes from the animation tracks.
  resample(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024] }),
  draco(),
)

await io.write(output, document)

const before = statSync(input).size
const after = statSync(output).size
console.log(
  `${input} (${(before / 1e6).toFixed(2)} MB) -> ${output} (${(after / 1e6).toFixed(2)} MB)` +
    `  ${(100 - (after / before) * 100).toFixed(1)}% smaller`,
)
