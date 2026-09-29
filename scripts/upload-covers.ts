import dotenv from 'dotenv'
import {readFile, readdir, stat} from 'node:fs/promises'
import {join} from 'node:path'
import {PrismaClient} from '@prisma/client'

dotenv.config({path: '.env'})
dotenv.config({path: '.env.local'})

const prisma = new PrismaClient()
const COVERS_DIR = join(process.cwd(), 'public/covers')
const CONCURRENCY = 6

const runPool = async <T,>(items: T[], worker: (item: T) => Promise<void>) => {
  let index = 0
  await Promise.all(
    Array.from({length: Math.min(CONCURRENCY, items.length)}, async () => {
      while (index < items.length) {
        const current = items[index++]
        await worker(current)
      }
    })
  )
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is missing')
  }

  const {put} = await import('@vercel/blob')
  const files = (await readdir(COVERS_DIR)).filter((name) => !name.startsWith('.'))
  console.log(`Uploading ${files.length} covers to Vercel Blob`)

  let ok = 0
  let failed = 0
  const uploaded = new Map<string, string>()

  await runPool(files, async (filename) => {
    const path = join(COVERS_DIR, filename)
    try {
      const info = await stat(path)
      if (!info.size) throw new Error('empty file')
      const blob = await put(`covers/${filename}`, await readFile(path), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
      })
      uploaded.set(filename, blob.url)
      ok += 1
      if (ok % 50 === 0) console.log(`uploaded ${ok}/${files.length}`)
    } catch (error) {
      failed += 1
      console.error(`fail ${filename} ${(error as Error).message}`)
    }
  })

  let rewritten = 0
  for (const [filename, url] of uploaded) {
    const result = await prisma.bookImage.updateMany({
      where: {url: `/covers/${filename}`},
      data: {url},
    })
    rewritten += result.count
  }

  const remaining = await prisma.bookImage.count({
    where: {url: {startsWith: '/covers/'}},
  })
  console.log(`done uploaded=${ok} failed=${failed} rewritten=${rewritten} stillLocal=${remaining}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
