import {client} from '@/sanity/lib/client'
import type {MetadataRoute} from 'next'
import {booksQuery, peopleQuery} from '@/sanity/queries'
import {BASE_URL} from '@/lib'

// todo: look into splitting up sitemaps
// https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {books: booksData} = await client.fetch(booksQuery, {
    start: 0,
    end: 99999,
  })
  if (!booksData) {
    throw new Error('unable to retrieve book slugs')
  }
  let books = booksData.map((book) => {
    return {
      url: `${BASE_URL}/book/${book.slug?.current}`,
      lastModified: book._updatedAt,
      priority: 0.7,
    }
  })

  const lastModified = booksData[0].datePublished

  const peopleData = await client.fetch(peopleQuery)
  if (!peopleData) {
    throw new Error('unable to retrieve person slugs')
  }
  let people = peopleData.map((person) => {
    return {
      url: `${BASE_URL}/person/${person.slug?.current}`,
      lastModified: person._updatedAt,
      priority: 0.3,
    }
  })

  return [
    {
      url: BASE_URL,
      lastModified: lastModified ?? undefined,
      priority: 1,
    },
    ...books,
    ...people,
  ]
}
