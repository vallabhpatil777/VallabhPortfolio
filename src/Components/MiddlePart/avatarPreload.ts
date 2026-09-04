import { DRACO_PATH, MODEL_URL } from './avatarConfig'

/**
 * Starts fetching the avatar GLB as soon as the app knows it will be needed, in
 * parallel with the three.js chunk itself.
 *
 * drei is imported dynamically so that merely referencing this helper does not
 * drag three.js into the entry bundle.
 */
export async function preloadAvatar() {
  const { useGLTF } = await import('@react-three/drei')
  useGLTF.preload(MODEL_URL, DRACO_PATH)
}
