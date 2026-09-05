/**
 * Shared between the avatar component and its preloader so the two cannot drift.
 *
 * IMPORTANT: `netlify.toml` serves this path with `max-age=31536000, immutable`,
 * and the filename carries no content hash. To ship a new avatar you must give
 * it a NEW name (`/model.v2.glb`) and change this constant — overwriting
 * `model.glb` in place would leave every returning visitor on the old model
 * until their browser cache evicts it, which could be months.
 */
export const MODEL_URL = '/model.glb'

/**
 * Self-hosted Draco decoder, copied out of the `three` package by
 * `npm run assets:draco`. Passing the path explicitly (rather than relying on
 * drei's default) keeps the model off a third-party CDN, and both the render and
 * the preload call must pass the same value to share one loader cache entry.
 */
export const DRACO_PATH = '/draco/'
