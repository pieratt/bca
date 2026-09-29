import dotenv from 'dotenv'
import {CreditRole, PrismaClient} from '@prisma/client'
import {createWriteStream} from 'node:fs'
import {readFile, mkdir} from 'node:fs/promises'
import {pipeline} from 'node:stream/promises'
import {Readable} from 'node:stream'
import {dirname, join} from 'node:path'
import slugify from 'slugify'

dotenv.config({path: '.env'})
dotenv.config({path: '.env.local'})

const prisma = new PrismaClient()
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ps8jihhe'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-04'
const EXPORT_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/export/${DATASET}`
const EXPORT_PATH = join(process.cwd(), 'prisma/sanity-export.ndjson')

type SanityDoc = {
  _id: string
  _type: string
  _createdAt?: string
  _updatedAt?: string
  title?: string
  name?: string
  homepage?: string
  url?: string
  isbn?: string | string[]
  publisher?: string | string[]
  genre?: string
  datePublished?: string
  legacyId?: string
  notes?: unknown
  slug?: {current?: string}
  images?: Array<{asset?: {_ref?: string}}>
  authors?: Array<{_ref?: string}>
  designers?: Array<{_ref?: string}>
  illustrators?: Array<{_ref?: string}>
  artDirectors?: Array<{_ref?: string}>
  photographers?: Array<{_ref?: string}>
  typefaces?: Array<{_ref?: string}>
}

type ImageAsset = SanityDoc & {
  url?: string
  metadata?: {dimensions?: {width?: number; height?: number}}
}

const toSlug = (value: string) => slugify(value, {lower: true, strict: true})

const asText = (value: unknown) => {
  if (Array.isArray(value)) {
    const joined = value.map((item) => String(item).trim()).filter(Boolean).join(', ')
    return joined || null
  }
  if (typeof value !== 'string') return value == null ? null : String(value)
  const trimmed = value.trim()
  if (!trimmed || trimmed === 'undefined' || trimmed === 'unknown') return null
  return trimmed
}

const chunk = <T,>(items: T[], size: number) =>
  Array.from({length: Math.ceil(items.length / size)}, (_, index) =>
    items.slice(index * size, (index + 1) * size)
  )

const when = (value?: string) => (value ? new Date(value) : undefined)

async function downloadExport() {
  console.log(`Downloading ${EXPORT_URL}`)
  const response = await fetch(EXPORT_URL)
  if (!response.ok || !response.body) {
    throw new Error(`Sanity export failed: ${response.status} ${await response.text()}`)
  }
  await mkdir(dirname(EXPORT_PATH), {recursive: true})
  await pipeline(Readable.fromWeb(response.body as never), createWriteStream(EXPORT_PATH))
  console.log(`Wrote ${EXPORT_PATH}`)
}

function parseExport(raw: string) {
  const people: SanityDoc[] = []
  const genres: SanityDoc[] = []
  const typefaces: SanityDoc[] = []
  const books: SanityDoc[] = []
  const assets = new Map<string, ImageAsset>()

  for (const line of raw.split('\n')) {
    if (!line.trim()) continue
    const doc = JSON.parse(line) as SanityDoc
    if (doc._type === 'person') people.push(doc)
    else if (doc._type === 'genre') genres.push(doc)
    else if (doc._type === 'typeface') typefaces.push(doc)
    else if (doc._type === 'book') books.push(doc)
    else if (doc._type === 'sanity.imageAsset') assets.set(doc._id, doc as ImageAsset)
  }

  return {people, genres, typefaces, books, assets}
}

function genreKey(value?: string) {
  if (!value || value === 'undefined') return null
  return toSlug(value.replace(/-/g, ' '))
}

async function main() {
  if (process.argv.includes('--reuse')) {
    console.log(`Reusing ${EXPORT_PATH}`)
  } else {
    await downloadExport()
  }
  const {people, genres, typefaces, books, assets} = parseExport(await readFile(EXPORT_PATH, 'utf8'))
  console.log(
    `Parsed ${books.length} books, ${people.length} people, ${genres.length} genres, ${typefaces.length} typefaces, ${assets.size} assets`
  )

  await prisma.$transaction([
    prisma.bookCredit.deleteMany(),
    prisma.bookImage.deleteMany(),
    prisma.bookTypeface.deleteMany(),
    prisma.book.deleteMany(),
    prisma.person.deleteMany(),
    prisma.genre.deleteMany(),
    prisma.typeface.deleteMany(),
  ])

  for (const group of chunk(people, 100)) {
    await prisma.person.createMany({
      data: group.map((person) => ({
        id: person._id,
        name: person.name || 'Untitled',
        slug: person.slug?.current || toSlug(person.name || person._id),
        homepage: person.homepage || null,
        createdAt: when(person._createdAt),
        updatedAt: when(person._updatedAt),
      })),
    })
  }

  const extraGenres = new Map<string, {id: string; name: string; slug: string}>()
  for (const genre of genres) {
    const slug = genre.slug?.current || toSlug(genre.name || genre._id)
    extraGenres.set(slug, {
      id: genre._id,
      name: genre.name || slug,
      slug,
    })
  }
  for (const book of books) {
    const slug = genreKey(book.genre)
    if (slug && !extraGenres.has(slug)) {
      extraGenres.set(slug, {id: `genre-${slug}`, name: book.genre!.replace(/-/g, ' '), slug})
    }
  }
  await prisma.genre.createMany({data: [...extraGenres.values()]})

  for (const group of chunk(typefaces, 100)) {
    await prisma.typeface.createMany({
      data: group.map((typeface) => ({
        id: typeface._id,
        name: typeface.name || 'Untitled',
        slug: typeface.slug?.current || toSlug(typeface.name || typeface._id),
        url: typeface.url || null,
      })),
    })
  }

  const personIds = new Set(people.map((person) => person._id))
  const typefaceIds = new Set(typefaces.map((typeface) => typeface._id))
  const genreBySlug = extraGenres

  for (const group of chunk(books, 50)) {
    await prisma.book.createMany({
      data: group.map((book) => {
        const published = when(book.datePublished)
        return {
          id: book._id,
          title: book.title || 'Untitled',
          slug: book.slug?.current || toSlug(book.title || book._id),
          datePublished: published,
          isbn: asText(book.isbn),
          publisher: asText(book.publisher),
          year: published && !Number.isNaN(published.getFullYear()) ? published.getFullYear() : null,
          notes: book.notes ? JSON.stringify(book.notes) : null,
          legacyId: book.legacyId || book._id,
          genreId: genreBySlug.get(genreKey(book.genre) || '')?.id ?? null,
          createdAt: when(book._createdAt),
          updatedAt: when(book._updatedAt),
        }
      }),
    })
  }

  const images = []
  const credits = []
  const bookTypefaces = []
  const creditRoles: [keyof SanityDoc, CreditRole][] = [
    ['authors', CreditRole.AUTHOR],
    ['designers', CreditRole.DESIGNER],
    ['illustrators', CreditRole.ILLUSTRATOR],
    ['artDirectors', CreditRole.ART_DIRECTOR],
    ['photographers', CreditRole.PHOTOGRAPHER],
  ]

  for (const book of books) {
    for (const [position, image] of (book.images || []).entries()) {
      const asset = image.asset?._ref ? assets.get(image.asset._ref) : undefined
      if (!asset?.url) continue
      images.push({
        bookId: book._id,
        url: asset.url,
        width: asset.metadata?.dimensions?.width ?? null,
        height: asset.metadata?.dimensions?.height ?? null,
        position,
      })
    }

    for (const [field, role] of creditRoles) {
      for (const [position, ref] of ((book[field] as Array<{_ref?: string}>) || []).entries()) {
        if (!ref?._ref || !personIds.has(ref._ref)) continue
        credits.push({
          bookId: book._id,
          personId: ref._ref,
          role,
          position,
        })
      }
    }

    for (const ref of book.typefaces || []) {
      if (!ref?._ref || !typefaceIds.has(ref._ref)) continue
      bookTypefaces.push({bookId: book._id, typefaceId: ref._ref})
    }
  }

  for (const group of chunk(images, 100)) {
    await prisma.bookImage.createMany({data: group})
  }
  for (const group of chunk(credits, 100)) {
    await prisma.bookCredit.createMany({data: group})
  }
  for (const group of chunk(bookTypefaces, 100)) {
    await prisma.bookTypeface.createMany({data: group})
  }

  const [bookCount, personCount, imageCount, creditCount] = await Promise.all([
    prisma.book.count(),
    prisma.person.count(),
    prisma.bookImage.count(),
    prisma.bookCredit.count(),
  ])
  console.log(
    `Imported ${bookCount} books, ${personCount} people, ${imageCount} images, ${creditCount} credits`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
