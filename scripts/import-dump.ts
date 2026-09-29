import dotenv from 'dotenv'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {PrismaClient} from '@prisma/client'

dotenv.config({path: '.env'})
dotenv.config({path: '.env.local'})

const prisma = new PrismaClient()
const DUMP_PATH = join(process.cwd(), 'prisma/catalog-dump.json')

type Dump = {
  Genre: Array<Record<string, unknown>>
  Person: Array<Record<string, unknown>>
  Typeface: Array<Record<string, unknown>>
  Book: Array<Record<string, unknown>>
  BookImage: Array<Record<string, unknown>>
  BookCredit: Array<Record<string, unknown>>
  BookTypeface: Array<Record<string, unknown>>
}

const chunk = <T,>(items: T[], size: number) =>
  Array.from({length: Math.ceil(items.length / size)}, (_, index) =>
    items.slice(index * size, (index + 1) * size)
  )

const asDate = (value: unknown) => {
  if (value == null || value === '') return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === 'number') return new Date(value)
  if (typeof value === 'string' && /^\d+$/.test(value)) return new Date(Number(value))
  const parsed = new Date(String(value))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const asInt = (value: unknown) => {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

async function main() {
  const dump = JSON.parse(await readFile(DUMP_PATH, 'utf8')) as Dump
  console.log(
    `Loaded dump: ${dump.Book.length} books, ${dump.Person.length} people, ${dump.BookImage.length} images`
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

  for (const group of chunk(dump.Genre, 100)) {
    await prisma.genre.createMany({
      data: group.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        slug: String(row.slug),
      })),
    })
  }

  for (const group of chunk(dump.Person, 100)) {
    await prisma.person.createMany({
      data: group.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        slug: String(row.slug),
        homepage: row.homepage == null ? null : String(row.homepage),
        createdAt: asDate(row.createdAt) ?? undefined,
        updatedAt: asDate(row.updatedAt) ?? undefined,
      })),
    })
  }

  for (const group of chunk(dump.Typeface, 100)) {
    await prisma.typeface.createMany({
      data: group.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        slug: String(row.slug),
        url: row.url == null ? null : String(row.url),
      })),
    })
  }

  for (const group of chunk(dump.Book, 50)) {
    await prisma.book.createMany({
      data: group.map((row) => ({
        id: String(row.id),
        title: String(row.title),
        slug: String(row.slug),
        datePublished: asDate(row.datePublished),
        isbn: row.isbn == null ? null : String(row.isbn),
        publisher: row.publisher == null ? null : String(row.publisher),
        year: asInt(row.year),
        notes: row.notes == null ? null : String(row.notes),
        legacyId: row.legacyId == null ? null : String(row.legacyId),
        genreId: row.genreId == null ? null : String(row.genreId),
        createdAt: asDate(row.createdAt) ?? undefined,
        updatedAt: asDate(row.updatedAt) ?? undefined,
      })),
    })
  }

  for (const group of chunk(dump.BookImage, 100)) {
    await prisma.bookImage.createMany({
      data: group.map((row) => ({
        id: String(row.id),
        bookId: String(row.bookId),
        url: String(row.url),
        width: asInt(row.width),
        height: asInt(row.height),
        position: asInt(row.position) ?? 0,
      })),
    })
  }

  for (const group of chunk(dump.BookCredit, 100)) {
    await prisma.bookCredit.createMany({
      data: group.map((row) => ({
        id: String(row.id),
        bookId: String(row.bookId),
        personId: String(row.personId),
        role: String(row.role) as 'AUTHOR' | 'DESIGNER' | 'ILLUSTRATOR' | 'ART_DIRECTOR' | 'PHOTOGRAPHER',
        position: asInt(row.position) ?? 0,
      })),
    })
  }

  for (const group of chunk(dump.BookTypeface, 100)) {
    await prisma.bookTypeface.createMany({
      data: group.map((row) => ({
        bookId: String(row.bookId),
        typefaceId: String(row.typefaceId),
      })),
    })
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
