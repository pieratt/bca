import type {MetadataRoute} from 'next'
import {BASE_URL} from '@/lib'
import {prisma} from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, people, genres] = await Promise.all([
    prisma.book.findMany({
      select: {slug: true, updatedAt: true, datePublished: true},
      orderBy: {datePublished: 'desc'},
    }),
    prisma.person.findMany({select: {slug: true, updatedAt: true}}),
    prisma.genre.findMany({
      where: {books: {some: {}}},
      select: {slug: true},
    }),
  ])

  return [
    {
      url: BASE_URL,
      lastModified: books[0]?.datePublished ?? undefined,
      priority: 1,
    },
    ...books.map((book) => ({
      url: `${BASE_URL}/book/${book.slug}`,
      lastModified: book.updatedAt,
      priority: 0.7,
    })),
    ...people.map((person) => ({
      url: `${BASE_URL}/person/${person.slug}`,
      lastModified: person.updatedAt,
      priority: 0.3,
    })),
    ...genres.map((genre) => ({
      url: `${BASE_URL}/genre/${genre.slug}`,
      priority: 0.4,
    })),
  ]
}
