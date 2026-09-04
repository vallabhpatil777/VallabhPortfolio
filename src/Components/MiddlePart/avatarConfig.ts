/** Shared between the avatar component and its preloader so the two cannot drift. */
export const MODEL_URL = '/model.glb'

/**
 * Self-hosted Draco decoder, copied out of the `three` package by
 * `npm run assets:draco`. Passing the path explicitly (rather than relying on
 * drei's default) keeps the model off a third-party CDN, and both the render and
 * the preload call must pass the same value to share one loader cache entry.
 */
export const DRACO_PATH = '/draco/'
