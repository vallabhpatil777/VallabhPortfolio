import { DRACO_PATH, MODEL_URL } from './avatarConfig'

/**
 * Avatar download, decoupled from three.js.
 *
 * Why this is not just `useGLTF.preload()`:
 *
 * 1. **Ordering.** `useGLTF` lives in drei, so preloading through it means
 *    waiting for the ~790 kB three.js chunk to arrive *before* the 1.9 MB model
 *    request even starts. Those two downloads are independent, and running them
 *    back to back is most of the "blank box, then the avatar suddenly appears"
 *    delay. Fetching the bytes here — from a module with no heavy imports —
 *    puts the model on the wire immediately, alongside the JS.
 *
 * 2. **Progress.** Owning the fetch means a real byte count, so the loading
 *    stage can show a truthful percentage from the first frame instead of an
 *    indeterminate spinner over an empty panel.
 *
 * The bytes are then handed to three's own `Cache` (see `primeLoaderCache`)
 * under the exact URL the loader will ask for, so `GLTFLoader` resolves from
 * memory instead of issuing a second request. `FileLoader` builds its cache key
 * as `path + url` and `path` is empty here, so `MODEL_URL` is the key on both
 * sides.
 *
 * Note the deliberate absence of a `useGLTF.preload()` call anywhere in this
 * file: that helper starts its *own* fetch of the same file, which would race
 * this one and download the model twice.
 */

/** Rough size used only to fake a curve when the server sends no Content-Length. */
const ESTIMATED_BYTES = 1_960_000

/**
 * Draco decoder pieces `DRACOLoader` pulls in to unpack the compressed geometry.
 * Only the wasm path matters in practice; `draco_decoder.js` is the asm.js
 * fallback and is left alone so it is never fetched on a modern browser.
 */
const DRACO_FILES = ['draco_wasm_wrapper.js', 'draco_decoder.wasm']

type Listener = (fraction: number) => void

const listeners = new Set<Listener>()
let fraction = 0
let downloadPromise: Promise<ArrayBuffer | null> | null = null
let dracoWarmed = false

function emit(value: number) {
  // Never let the readout go backwards — a re-emit at a lower value reads as a
  // stall even when the download is healthy.
  if (value <= fraction) return
  fraction = value
  for (const listener of listeners) listener(value)
}

/** Current download progress, 0–1. */
export function getAvatarProgress(): number {
  return fraction
}

/** Subscribe to download progress. Fires immediately with the current value. */
export function subscribeAvatarProgress(listener: Listener): () => void {
  listeners.add(listener)
  listener(fraction)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Pulls the Draco decoder into the HTTP cache.
 *
 * `DRACOLoader` only asks for these once it is already parsing the GLB, which
 * puts another ~250 kB *after* the model download rather than beside it.
 * Fire-and-forget: if it fails, the loader fetches them itself as usual.
 */
export function warmDracoDecoder() {
  if (dracoWarmed || typeof fetch !== 'function') return
  dracoWarmed = true
  for (const file of DRACO_FILES) {
    void fetch(`${DRACO_PATH}${file}`, { credentials: 'same-origin' }).catch(() => {})
  }
}

/**
 * Streams the GLB, reporting progress as it goes. Safe to call repeatedly — the
 * first call owns the request and everyone else shares its promise.
 *
 * Resolves to `null` on any failure, which is not an error case: it simply means
 * "no pre-fetched bytes", and `GLTFLoader` falls back to fetching the file
 * itself exactly as it did before.
 */
export function startAvatarDownload(): Promise<ArrayBuffer | null> {
  if (downloadPromise) return downloadPromise

  downloadPromise = (async () => {
    try {
      const response = await fetch(MODEL_URL, { credentials: 'same-origin' })
      if (!response.ok || !response.body) {
        emit(1)
        return null
      }

      const declared = Number(response.headers.get('content-length'))
      const total = Number.isFinite(declared) && declared > 0 ? declared : 0

      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []
      let received = 0

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        received += value.length
        // Hold just short of 100% until the bytes are actually in hand, so the
        // readout cannot sit at "100%" while the model is still being parsed.
        emit(Math.min(0.98, received / (total || ESTIMATED_BYTES)))
      }

      const bytes = new Uint8Array(received)
      let offset = 0
      for (const chunk of chunks) {
        bytes.set(chunk, offset)
        offset += chunk.length
      }

      emit(1)
      return bytes.buffer
    } catch {
      emit(1)
      return null
    }
  })()

  return downloadPromise
}

/**
 * Minimal three.js `Cache` surface. Typed structurally so this module never has
 * to import three — importing it here would pull the renderer onto the critical
 * path, which is the exact problem this file exists to avoid.
 */
type ThreeCache = {
  enabled: boolean
  add: (key: string, file: unknown) => void
  remove: (key: string) => void
}

/**
 * Hands the downloaded bytes to three's loader cache.
 *
 * Called by `Avatar3D` — which already has three imported — *before* it renders
 * anything that touches `useGLTF`. Waiting for this is what guarantees the model
 * is fetched exactly once.
 */
export async function primeLoaderCache(cache: ThreeCache): Promise<void> {
  const bytes = await startAvatarDownload()
  if (!bytes) return
  cache.enabled = true
  cache.add(MODEL_URL, bytes)
}

/**
 * Warms every network resource the avatar needs, as early as the app knows it
 * will be used: the model bytes, the Draco decoder, and the three.js/drei chunk.
 */
export async function preloadAvatar() {
  startAvatarDownload()
  warmDracoDecoder()
  // Pull the renderer chunk down in parallel with the bytes above. The import is
  // for its side effect on the module cache; `Avatar3D` is what actually uses it.
  await import('@react-three/drei')
}

/**
 * Drops the raw GLB bytes once the model is on screen.
 *
 * drei keeps the *parsed* scene in its own suspense cache, so the ~1.9 MB
 * ArrayBuffer is pure overhead from that point on — worth reclaiming on phones.
 * A later re-mount simply re-reads the file from the browser's HTTP cache.
 */
export function releaseAvatarBytes(cache: ThreeCache) {
  cache.remove(MODEL_URL)
  downloadPromise = Promise.resolve(null)
}
