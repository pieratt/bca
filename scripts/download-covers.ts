import dotenv from 'dotenv'
import {createWriteStream} from 'node:fs'
import {mkdir, stat} from 'node:fs/promises'
import {pipeline} from 'node:stream/promises'
import {Readable} from 'node:stream'
import {join} from 'node:path'
import {PrismaClient} from '@prisma/client'

dotenv.config({path: '.env'})
dotenv.config({path: '.env.local'})

const prisma = new PrismaClient()
const OUT_DIR = join(process.cwd(), 'public/covers')
const CONCURRENCY = 4
const rewrite = process.argv.includes('--rewrite')

const filenameFor = (url: string) => {
  const clean = url.split('?')[0]
  const name = clean.split('/').pop() || `${Date.now()}.jpg`
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

const alreadyThere = async (path: string) => {
  try {
    const info = await stat(path)
    return info.size > 0
  } catch {
    return false
  }
}

async function download(url: string, dest: string) {
  const response = await fetch(url)
  if (!response.ok || !response.body) {
    throw new Error(`${response.status} ${url}`)
  }
  await pipeline(Readable.fromWeb(response.body as never), createWriteStream(dest))
}

async function runPool<T>(items: T[], worker: (item: T) => Promise<void>) {
  let index = 0
  const workers = Array.from({length: Math.min(CONCURRENCY, items.length)}, async () => {
    while (index < items.length) {
      const current = items[index++]
      await worker(current)
    }
  })
  await Promise.all(workers)
}

async function main() {
  await mkdir(OUT_DIR, {recursive: true})
  const images = await prisma.bookImage.findMany({
    where: {url: {startsWith: 'https://cdn.sanity.io/'}},
    select: {id: true, url: true},
  })
  console.log(`Downloading ${images.length} covers to ${OUT_DIR}`)

  let ok = 0
  let skipped = 0
  let failed = 0

  await runPool(images, async (image) => {
    const filename = filenameFor(image.url)
    const dest = join(OUT_DIR, filename)
    try {
      if (await alreadyThere(dest)) {
        skipped += 1
      } else {
        await download(image.url, dest)
        ok += 1
      }
      if (rewrite) {
        await prisma.bookImage.update({
          where: {id: image.id},
          data: {url: `/covers/${filename}`},
        })
      }
      if ((ok + skipped + failed) % 50 === 0) {
        console.log(`progress ${ok + skipped + failed}/${images.length}`)
      }
    } catch (error) {
      failed += 1
      console.error(`fail ${image.url} ${(error as Error).message}`)
    }
  })

  console.log(`done downloaded=${ok} skipped=${skipped} failed=${failed}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
