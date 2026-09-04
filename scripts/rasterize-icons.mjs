/**
 * Rasterises the few oversized SVG icons to 96px WebP.
 *
 * These are decorative brand marks rendered at 24-32 CSS px. Keeping them as
 * vector cost 35 KB for a single logo, where a 96px WebP is visually identical on
 * a 3x display at a fraction of the bytes. Small SVGs are left as vector.
 */
import sharp from 'sharp'
import { readdirSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'src/assets'
const THRESHOLD = 8 * 1024
const SIZE = 96

for (const file of readdirSync(DIR)) {
  if (!file.endsWith('.svg')) continue
  const path = join(DIR, file)
  const before = statSync(path).size
  if (before < THRESHOLD) continue

  const out = path.replace(/\.svg$/, '.webp')
  await sharp(path, { density: 384 })
    .resize(SIZE, SIZE, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, effort: 6 })
    .toFile(out)

  const after = statSync(out).size
  console.log(
    `${file.padEnd(24)} ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB`,
  )
  unlinkSync(path)
}
