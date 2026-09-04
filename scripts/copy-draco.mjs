/**
 * Copies the Draco decoder out of the installed `three` package into `public/draco/`.
 *
 * Self-hosting keeps the avatar independent of a third-party CDN. Re-run this after
 * upgrading `three` so the decoder stays in step with the loader that uses it.
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'node_modules/three/examples/jsm/libs/draco/gltf')
const to = join(root, 'public/draco')

// The encoder is build-time only; the runtime loader needs the wasm wrapper, the
// wasm binary, and the asm.js fallback.
const FILES = ['draco_wasm_wrapper.js', 'draco_decoder.wasm', 'draco_decoder.js']

mkdirSync(to, { recursive: true })
for (const file of FILES) {
  copyFileSync(join(from, file), join(to, file))
  console.log(`copied ${file}`)
}
