/**
 * Extracts the handful of brand icons added with the 2026 CV refresh from
 * `simple-icons` (MIT) into `src/assets`, rendered as small WebP tiles so they
 * match the size profile of the icons already in the set.
 *
 * simple-icons is a devDependency used only here — nothing ships from it at
 * runtime except the generated files.
 *
 * Usage: node scripts/extract-icons.mjs
 */
import * as icons from 'simple-icons'
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'src/assets'
const SIZE = 96

// slug in simple-icons -> output basename
const WANTED = [
  ['siPytorch', 'pytorch'],
  ['siHuggingface', 'huggingface'],
  ['siRedis', 'redis'],
  ['siPrometheus', 'prometheus'],
  ['siQdrant', 'qdrant'],
  ['siClaude', 'claude'],
  ['siOpenapiinitiative', 'openapi'],
]

for (const [key, name] of WANTED) {
  const icon = icons[key]
  if (!icon) {
    console.warn(`!! ${key} not found in simple-icons`)
    continue
  }

  // simple-icons ships a monochrome path plus the brand's hex colour.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${SIZE}" height="${SIZE}"><path fill="#${icon.hex}" d="${icon.path}"/></svg>`

  await sharp(Buffer.from(svg), { density: 384 })
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, effort: 6 })
    .toFile(join(OUT, `${name}.webp`))

  console.log(`wrote ${name}.webp  (${icon.title}, #${icon.hex})`)
}
