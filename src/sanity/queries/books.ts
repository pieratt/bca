import {defineQuery} from 'next-sanity'
import {imageFragment} from './fragments'

export const bookQuery = defineQuery(`
  *[_type == 'book' && slug.current == $slug][0]{
    ...,
    notes[],
    designers[] -> {
      name,
      slug
    },
    authors[] -> {
      name,
      slug
    },
    illustrators[] -> {
      name,
      slug
    },
    artDirectors[] -> {
      name,
      slug
    },
    photographers[] -> {
      name,
      slug
    },
    images[] ${imageFragment}
  }
`)

export const booksQuery = defineQuery(`
  {
    "books": *[_type == 'book'] | order(datePublished desc) [$start...$end] {
      ...,
      notes[],
      designers[] -> {
        name
      },
      authors[] -> {
        name
      },
      "cover": images[0] ${imageFragment}
    },
    "total": count(*[_type == 'book'])
  }
`)

export const bookCount = defineQuery(`
  count(*[_type == 'book'])
`)

export const headerStatsQuery = defineQuery(`
  {
    "books": count(*[_type == 'book']),
    "designers": count(array::unique(*[_type == 'book'].designers[]._ref))
  }
`)
