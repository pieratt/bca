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
  try {
    await fs.mkdir(`${process.cwd()}/src/generated`)
    console.log('prebuild: created `/src/generated` folder')
  } catch {
    console.log('error prebuilding search json')
  }

  const {books} = await client.fetch(booksQuery)
  if (!books) {
    throw new Error('unable to retrieve book slugs')
  }
  const parsed = books.map((book) => ({
    slug: book.slug.current,
    title: book.title,
    cover: book.image,
  }))

  await fs.writeFile(`${process.cwd()}/src/generated/books.json`, JSON.stringify(parsed))
  console.log('prebuild: created `books.json`')

  const people = await client.fetch(peopleQuery)
  if (!people) {
    throw new Error('unable to retrieve people')
  }
  await fs.writeFile(`${process.cwd()}/src/generated/people.json`, JSON.stringify(people))
  console.log('prebuild: created `people.json`')
}

await generateStaticJson()
