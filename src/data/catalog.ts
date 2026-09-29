import {CreditRole} from '@prisma/client'
import {prisma} from '@/lib/prisma'
import {localBooks, toBookPageData, type LocalBook, type LocalPerson} from './archive'

const bookInclude = {
  genre: true,
  images: {orderBy: {position: 'asc' as const}},
  credits: {
    orderBy: {position: 'asc' as const},
    include: {person: true},
  },
}

type BookRecord = Awaited<ReturnType<typeof prisma.book.findFirst<{include: typeof bookInclude}>>>

const creditsFor = (book: NonNullable<BookRecord>, role: CreditRole): LocalPerson[] =>
  book.credits
    .filter((credit) => credit.role === role)
    .map((credit) => ({
      slug: credit.person.slug,
      name: credit.person.name,
    }))

const parseNotes = (notes?: string | null) => {
  if (!notes) return undefined
  try {
    return JSON.parse(notes)
  } catch {
    return notes
  }
}

export const toLocalBook = (book: NonNullable<BookRecord>): LocalBook => {
  const cover = book.images[0]
  return {
    slug: book.slug,
    title: book.title,
    cover: cover?.url ?? '',
    width: cover?.width ?? 1000,
    height: cover?.height ?? 1500,
    authors: creditsFor(book, CreditRole.AUTHOR),
    designers: creditsFor(book, CreditRole.DESIGNER),
    illustrators: creditsFor(book, CreditRole.ILLUSTRATOR),
    artDirectors: creditsFor(book, CreditRole.ART_DIRECTOR),
    photographers: creditsFor(book, CreditRole.PHOTOGRAPHER),
    publisher: book.publisher ?? '',
    isbn: book.isbn ?? '',
    genre: book.genre?.name ?? '',
    year: book.year,
    notes: parseNotes(book.notes),
  }
}

const uniquePeople = (people: LocalPerson[]) => {
  const map = new Map<string, LocalPerson>()
  people.forEach((person) => {
    if (person.slug && !map.has(person.slug)) map.set(person.slug, person)
  })
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

export async function listBooks(): Promise<LocalBook[]> {
  try {
    const books = await prisma.book.findMany({
      include: bookInclude,
      orderBy: [{datePublished: 'desc'}, {createdAt: 'desc'}],
    })
    if (books.length) return books.map(toLocalBook)
  } catch (error) {
    console.warn('Prisma unavailable, using archive.json', error)
  }
  return localBooks
}

export async function listBookSlugs() {
  try {
    return (await prisma.book.findMany({select: {slug: true}})).map((book) => book.slug)
  } catch {
    return localBooks.map((book) => book.slug)
  }
}

export async function getBookBySlug(slug?: string) {
  if (!slug) return null
  try {
    const book = await prisma.book.findUnique({
      where: {slug},
      include: bookInclude,
    })
    if (book) return toLocalBook(book)
  } catch (error) {
    console.warn('Prisma unavailable, using archive.json', error)
  }
  return localBooks.find((book) => book.slug === slug) ?? null
}

export async function getBookPageData(slug?: string) {
  const book = await getBookBySlug(slug)
  return book ? toBookPageData(book) : null
}

export async function listPeople() {
  try {
    const people = await prisma.person.findMany({orderBy: {name: 'asc'}})
    if (people.length) return people
  } catch (error) {
    console.warn('Prisma unavailable, using archive.json', error)
  }
  return []
}

export async function listPersonSlugs() {
  try {
    return (await prisma.person.findMany({select: {slug: true}})).map((person) => person.slug)
  } catch {
    return []
  }
}

export async function getPersonBySlug(slug?: string) {
  if (!slug) return null
  try {
    const person = await prisma.person.findUnique({
      where: {slug},
      include: {
        credits: {
          include: {
            book: {include: bookInclude},
          },
        },
      },
    })
    if (person) {
      const books = new Map<string, LocalBook>()
      for (const credit of person.credits) {
        books.set(credit.book.slug, toLocalBook(credit.book))
      }
      return {
        slug: person.slug,
        name: person.name,
        homepage: person.homepage,
        books: [...books.values()],
      }
    }
  } catch (error) {
    console.warn('Prisma unavailable, using archive.json', error)
  }
  return null
}

export async function getHeaderStats() {
  try {
    const [books, designers] = await Promise.all([
      prisma.book.count(),
      prisma.bookCredit.findMany({
        where: {role: CreditRole.DESIGNER},
        distinct: ['personId'],
        select: {personId: true},
      }),
    ])
    if (books) {
      return {books, designers: designers.length}
    }
  } catch (error) {
    console.warn('Prisma unavailable, using fallback stats', error)
  }
  return {books: localBooks.length, designers: uniquePeople(localBooks.flatMap((book) => book.designers)).length}
}

export type IndexPerson = LocalPerson & {count: number}
export type IndexGenre = {name: string; count: number}

const countPeople = (people: LocalPerson[]): IndexPerson[] => {
  const map = new Map<string, IndexPerson>()
  people.forEach((person) => {
    if (!person.slug) return
    const current = map.get(person.slug)
    if (current) current.count += 1
    else map.set(person.slug, {...person, count: 1})
  })
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

const countGenres = (names: string[]): IndexGenre[] => {
  const map = new Map<string, number>()
  names.forEach((name) => {
    if (!name) return
    map.set(name, (map.get(name) || 0) + 1)
  })
  return [...map.entries()]
    .map(([name, count]) => ({name, count}))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

export async function getArchiveIndex() {
  try {
    const [designerRows, illustratorRows, photographerRows, genreRows] = await Promise.all([
      prisma.bookCredit.findMany({
        where: {role: CreditRole.DESIGNER},
        include: {person: true},
      }),
      prisma.bookCredit.findMany({
        where: {role: CreditRole.ILLUSTRATOR},
        include: {person: true},
      }),
      prisma.bookCredit.findMany({
        where: {role: CreditRole.PHOTOGRAPHER},
        include: {person: true},
      }),
      prisma.genre.findMany({
        orderBy: {name: 'asc'},
        include: {_count: {select: {books: true}}},
      }),
    ])

    return {
      designers: countPeople(designerRows.map((row) => ({slug: row.person.slug, name: row.person.name}))),
      illustrators: countPeople(illustratorRows.map((row) => ({slug: row.person.slug, name: row.person.name}))),
      photographers: countPeople(photographerRows.map((row) => ({slug: row.person.slug, name: row.person.name}))),
      genres: genreRows.map((genre) => ({name: genre.name, count: genre._count.books})),
    }
  } catch (error) {
    console.warn('Prisma unavailable, using archive.json', error)
    const books = localBooks
    return {
      designers: countPeople(books.flatMap((book) => book.designers)),
      illustrators: countPeople(books.flatMap((book) => book.illustrators)),
      photographers: countPeople(books.flatMap((book) => book.photographers)),
      genres: countGenres(books.map((book) => book.genre.replace(/-/g, ' '))),
    }
  }
}

export async function listBooksPage(page: number, limit: number) {
  try {
    const skip = Math.max(page - 1, 0) * limit
    const [rows, total] = await Promise.all([
      prisma.book.findMany({
        include: {images: {orderBy: {position: 'asc'}, take: 1}},
        orderBy: [{datePublished: 'desc'}, {createdAt: 'desc'}],
        skip,
        take: limit,
      }),
      prisma.book.count(),
    ])
    if (total) {
      return {
        books: rows.map((book) => ({
          slug: book.slug,
          title: book.title,
          cover: book.images[0]?.url ?? '',
          width: book.images[0]?.width ?? 1000,
          height: book.images[0]?.height ?? 1500,
          authors: [],
          designers: [],
          illustrators: [],
          photographers: [],
          publisher: book.publisher ?? '',
          isbn: book.isbn ?? '',
          genre: '',
          year: book.year,
        })) satisfies LocalBook[],
        total,
      }
    }
  } catch (error) {
    console.warn('Prisma unavailable, using archive.json', error)
  }

  const books = localBooks
  const start = (page - 1) * limit
  return {
    books: books.slice(start, start + limit),
    total: books.length,
  }
}
