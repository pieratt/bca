import {CreditRole, PrismaClient} from '@prisma/client'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import slugify from 'slugify'

const prisma = new PrismaClient()

type SeedPerson = {slug: string; name: string}
type SeedBook = {
  slug: string
  title: string
  cover: string
  width: number
  height: number
  authors: SeedPerson[]
  designers: SeedPerson[]
  illustrators: SeedPerson[]
  photographers: SeedPerson[]
  publisher: string
  isbn: string
  genre: string
  year: number | null
}

const archive = JSON.parse(readFileSync(join(__dirname, '../src/data/archive.json'), 'utf8')) as {
  books: SeedBook[]
  people: SeedPerson[]
}

const toSlug = (value: string) => slugify(value, {lower: true, strict: true})

async function upsertPerson(person: SeedPerson) {
  return prisma.person.upsert({
    where: {slug: person.slug},
    update: {name: person.name},
    create: {slug: person.slug, name: person.name},
  })
}

async function upsertGenre(name: string) {
  const slug = toSlug(name)
  return prisma.genre.upsert({
    where: {slug},
    update: {name},
    create: {slug, name},
  })
}

async function main() {
  const people = new Map<string, SeedPerson>()
  archive.people.forEach((person) => people.set(person.slug, person))
  archive.books.forEach((book) => {
    ;[...book.authors, ...book.designers, ...book.illustrators, ...book.photographers].forEach((person) => {
      if (!people.has(person.slug)) people.set(person.slug, person)
    })
  })

  for (const person of people.values()) {
    await upsertPerson(person)
  }

  for (const book of archive.books) {
    const genre = book.genre ? await upsertGenre(book.genre.replace(/-/g, ' ')) : null
    const record = await prisma.book.upsert({
      where: {slug: book.slug},
      update: {
        title: book.title,
        isbn: book.isbn || null,
        publisher: book.publisher || null,
        year: book.year,
        genreId: genre?.id,
        datePublished: book.year ? new Date(`${book.year}-01-01`) : undefined,
      },
      create: {
        title: book.title,
        slug: book.slug,
        isbn: book.isbn || null,
        publisher: book.publisher || null,
        year: book.year,
        genreId: genre?.id,
        datePublished: book.year ? new Date(`${book.year}-01-01`) : undefined,
      },
    })

    await prisma.bookImage.deleteMany({where: {bookId: record.id}})
    await prisma.bookImage.create({
      data: {
        bookId: record.id,
        url: book.cover,
        width: book.width,
        height: book.height,
        position: 0,
      },
    })

    await prisma.bookCredit.deleteMany({where: {bookId: record.id}})
    const credits: {people: SeedPerson[]; role: CreditRole}[] = [
      {people: book.authors, role: CreditRole.AUTHOR},
      {people: book.designers, role: CreditRole.DESIGNER},
      {people: book.illustrators, role: CreditRole.ILLUSTRATOR},
      {people: book.photographers, role: CreditRole.PHOTOGRAPHER},
    ]

    for (const group of credits) {
      for (const [position, person] of group.people.entries()) {
        const saved = await upsertPerson(person)
        await prisma.bookCredit.create({
          data: {
            bookId: record.id,
            personId: saved.id,
            role: group.role,
            position,
          },
        })
      }
    }
  }

  console.log(`Seeded ${archive.books.length} books and ${people.size} people from archive.json`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
