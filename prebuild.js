import dotenv from 'dotenv'
dotenv.config({path: '.env.local'})
import {createClient} from '@sanity/client'
import * as fs from 'node:fs/promises'
import groq from 'groq'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-05-12',
  useCdn: false,
})

export const booksQuery = groq`
  {
    "books": *[_type == 'book'] | order(datePublished desc) {
      title,
      slug,
      "image": images[0] {
        ...,
        asset-> {
          metadata {
            dimensions
          },
          url
        }
      }
    },
    "total": count(*[_type == 'book'])
  }
`

export const peopleQuery = groq`
  *[_type == 'person'] | order(name asc) {
    name,
    slug
  }
`

const generateStaticJson = async () => {
  const {books} = await client.fetch(booksQuery)
  if (!books) {
    throw new Error('unable to retrieve book slugs')
  }
  const parsed = books.map((book) => ({
    slug: book.slug.current,
    title: book.title,
    cover: book.image,
  }))

  fs.writeFile('./src/generated/books.json', JSON.stringify(parsed))

  const people = await client.fetch(peopleQuery)
  if (!people) {
    throw new Error('unable to retrieve people')
  }
  fs.writeFile('./src/generated/people.json', JSON.stringify(people))
}

await generateStaticJson()
