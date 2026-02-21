import sharp from 'sharp'
import { readdirSync, mkdirSync, existsSync } from 'fs'
import { join, extname } from 'path'

const INPUT_DIR = join(import.meta.dirname, '..', 'public', 'images', 'files')
const OUTPUT_DIR = join(import.meta.dirname, '..', 'public', 'images', 'files-thumb')

const THUMB_WIDTH = 20
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

async function generateThumbnails() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = readdirSync(INPUT_DIR).filter((f) => {
    const ext = extname(f).toLowerCase()
    return SUPPORTED_EXTENSIONS.includes(ext) && !f.endsWith('.tmp')
  })

  console.log(`Found ${files.length} images to process...`)

  let processed = 0
  let skipped = 0

  for (const file of files) {
    const inputPath = join(INPUT_DIR, file)
    const outputPath = join(OUTPUT_DIR, file)

    if (existsSync(outputPath)) {
      skipped++
      continue
    }

    try {
      await sharp(inputPath)
        .resize(THUMB_WIDTH)
        .jpeg({ quality: 50 })
        .toFile(outputPath)
      processed++
      console.log(`  Generated: ${file}`)
    } catch (err) {
      console.error(`  Error processing ${file}:`, err.message)
    }
  }

  console.log(`\nDone! Processed: ${processed}, Skipped: ${skipped}, Total: ${files.length}`)
}

generateThumbnails()
