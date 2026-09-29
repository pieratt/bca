import archive from './archive.json'

export type LocalPerson = {
  slug: string
  name: string
}

export type LocalBook = {
  slug: string
  title: string
  cover: string
  width: number
  height: number
  authors: LocalPerson[]
  designers: LocalPerson[]
  illustrators: LocalPerson[]
  artDirectors?: LocalPerson[]
  photographers: LocalPerson[]
  publisher: string
  isbn: string
  genre: string
  year: number | null
  notes?: unknown
}

export const localBooks = archive.books as LocalBook[]

const bookMentionsPerson = (book: LocalBook, slug?: string) =>
  [book.authors, book.designers, book.illustrators, book.photographers].some((group) =>
    group.some((person) => person.slug === slug)
  )

export const getLocalBook = (slug?: string) => localBooks.find((book) => book.slug === slug)

export const getLocalPerson = (slug?: string) => {
  const person = archive.people.find((item) => item.slug === slug)
  if (!person) return null
  return {
    ...person,
    books: localBooks.filter((book) => bookMentionsPerson(book, slug)),
  }
}

export const localPeople = archive.people

const uniquePeople = (people: LocalPerson[]) => {
  const map = new Map<string, LocalPerson>()
  people.forEach((person) => {
    if (person.slug && !map.has(person.slug)) map.set(person.slug, person)
  })
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

export const archiveDesigners = uniquePeople(localBooks.flatMap((book) => book.designers))
export const archiveIllustrators = uniquePeople(localBooks.flatMap((book) => book.illustrators))
export const archivePhotographers = uniquePeople(localBooks.flatMap((book) => book.photographers))
export const archiveGenres = [
  ...new Set(localBooks.map((book) => book.genre.replace(/-/g, ' ')).filter(Boolean)),
].sort((a, b) => a.localeCompare(b, 'en'))
export const archiveYears = [...new Set(localBooks.map((book) => book.year).filter((year): year is number => !!year))].sort(
  (a, b) => a - b
)

export const splitColumns = <T,>(items: T[], count: number) => {
  const size = Math.ceil(items.length / count)
  return Array.from({length: count}, (_, index) => items.slice(index * size, (index + 1) * size))
}

const toSlug = (slug: string) => ({_type: 'slug' as const, current: slug})

const toCredits = (people: LocalPerson[]) =>
  people.map((person) => ({
    name: person.name,
    slug: toSlug(person.slug),
  }))

export const toBookPageData = (book: LocalBook) =>
  ({
    _id: book.slug,
    _type: 'book',
    _createdAt: '',
    _updatedAt: '',
    _rev: '',
    title: book.title,
    slug: toSlug(book.slug),
    isbn: book.isbn || undefined,
    publisher: book.publisher || undefined,
    genre: book.genre.replace(/-/g, ' ') || undefined,
    authors: book.authors.length ? toCredits(book.authors) : null,
    designers: book.designers.length ? toCredits(book.designers) : null,
    illustrators: book.illustrators.length ? toCredits(book.illustrators) : null,
    artDirectors: book.artDirectors?.length ? toCredits(book.artDirectors) : null,
    photographers: book.photographers.length ? toCredits(book.photographers) : null,
    notes: book.notes ?? null,
    images: [
      {
        _type: 'image',
        _key: book.slug,
        asset: {
          url: book.cover,
          originalFilename: null,
          metadata: {
            lqip: null,
            blurHash: null,
            dimensions: {
              _type: 'sanity.imageDimensions',
              width: book.width,
              height: book.height,
              aspectRatio: book.width / book.height,
            },
          },
        },
      },
    ],
  }) as Sanity.BookQueryResult
