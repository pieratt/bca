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
    genreSlug: book.genre?.slug ?? '',
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

export type IndexPerson = LocalPerson & {count: number; cover?: string}
export type IndexGenre = {name: string; slug: string; count: number; cover?: string}

const GENRE_ALIASES: Record<string, string> = {
  'biographies-and-memoires': 'memoir',
  'biographies-and-memoirs': 'memoir',
  'biographies and memoires': 'memoir',
}

const byCount = <T extends {name: string; count: number}>(items: T[]) =>
  [...items].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'en'))

const creditCover = (images?: Array<{url: string}>) => images?.[0]?.url

const tallyPeople = (
  rows: Array<{person: LocalPerson; cover?: string | null}>
): IndexPerson[] => {
  const map = new Map<string, IndexPerson>()
  rows.forEach((row) => {
    if (!row.person.slug) return
    const current = map.get(row.person.slug)
    const cover = row.cover || undefined
    if (current) {
      current.count += 1
      if (!current.cover && cover) current.cover = cover
    } else {
      map.set(row.person.slug, {...row.person, count: 1, cover})
    }
  })
  return byCount([...map.values()])
}

const tallyGenres = (books: LocalBook[]): IndexGenre[] => {
  const map = new Map<string, IndexGenre>()
  books.forEach((book) => {
    const name = book.genre.replace(/-/g, ' ').trim()
    if (!name) return
    const slug = book.genreSlug || name.toLowerCase().replace(/\s+/g, '-')
    const current = map.get(slug)
    if (current) {
      current.count += 1
      if (!current.cover && book.cover) current.cover = book.cover
    } else {
      map.set(slug, {name, slug, count: 1, cover: book.cover || undefined})
    }
  })
  return byCount([...map.values()])
}

export async function getArchiveIndex() {
  const creditInclude = {
    person: true,
    book: {include: {images: {orderBy: {position: 'asc' as const}, take: 1}}},
  }

  try {
    const [designerRows, illustratorRows, photographerRows, genreRows] = await Promise.all([
      prisma.bookCredit.findMany({
        where: {role: CreditRole.DESIGNER},
        include: creditInclude,
      }),
      prisma.bookCredit.findMany({
        where: {role: CreditRole.ILLUSTRATOR},
        include: creditInclude,
      }),
      prisma.bookCredit.findMany({
        where: {role: CreditRole.PHOTOGRAPHER},
        include: creditInclude,
      }),
      prisma.genre.findMany({
        include: {
          _count: {select: {books: true}},
          books: {
            take: 1,
            orderBy: [{datePublished: 'desc'}, {createdAt: 'desc'}],
            include: {images: {orderBy: {position: 'asc'}, take: 1}},
          },
        },
      }),
    ])

    return {
      designers: tallyPeople(
        designerRows.map((row) => ({
          person: {slug: row.person.slug, name: row.person.name},
          cover: creditCover(row.book.images),
        }))
      ),
      illustrators: tallyPeople(
        illustratorRows.map((row) => ({
          person: {slug: row.person.slug, name: row.person.name},
          cover: creditCover(row.book.images),
        }))
      ),
      photographers: tallyPeople(
        photographerRows.map((row) => ({
          person: {slug: row.person.slug, name: row.person.name},
          cover: creditCover(row.book.images),
        }))
      ),
      genres: byCount(
        genreRows
          .filter((genre) => genre._count.books > 0)
          .map((genre) => ({
            name: genre.name,
            slug: genre.slug,
            count: genre._count.books,
            cover: creditCover(genre.books[0]?.images),
          }))
      ),
    }
  } catch (error) {
    console.warn('Prisma unavailable, using archive.json', error)
    const books = localBooks
    return {
      designers: tallyPeople(books.flatMap((book) => book.designers.map((person) => ({person, cover: book.cover})))),
      illustrators: tallyPeople(
        books.flatMap((book) => book.illustrators.map((person) => ({person, cover: book.cover})))
      ),
      photographers: tallyPeople(
        books.flatMap((book) => book.photographers.map((person) => ({person, cover: book.cover})))
      ),
      genres: tallyGenres(books),
    }
  }
}

export async function listGenreSlugs() {
  try {
    return (await prisma.genre.findMany({where: {books: {some: {}}}, select: {slug: true}})).map(
      (genre) => genre.slug
    )
  } catch {
    return [...new Set(localBooks.map((book) => book.genreSlug || book.genre.toLowerCase().replace(/\s+/g, '-')))]
  }
}

export async function getGenreBySlug(slug?: string) {
  if (!slug) return null
  const resolved = GENRE_ALIASES[slug] || slug
  try {
    const genre = await prisma.genre.findUnique({
      where: {slug: resolved},
      include: {
        books: {
          include: bookInclude,
          orderBy: [{datePublished: 'desc'}, {createdAt: 'desc'}],
        },
      },
    })
    if (genre) {
      return {
        slug: genre.slug,
        name: genre.name,
        books: genre.books.map(toLocalBook),
        alias: slug !== genre.slug,
      }
    }
  } catch (error) {
    console.warn('Prisma unavailable, using archive.json', error)
  }

  const books = localBooks.filter((book) => {
    const bookSlug = book.genreSlug || book.genre.toLowerCase().replace(/[_\s]+/g, '-')
    return bookSlug === resolved || book.genre.toLowerCase() === resolved
  })
  if (!books.length) return null
  return {slug: resolved, name: books[0].genre || resolved, books, alias: slug !== resolved}
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
