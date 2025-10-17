import {defineQuery} from 'next-sanity'
import {imageFragment} from './fragments'

export const bookQuery = defineQuery(`
  *[_type == 'book' && slug.current == $slug][0]{
    ...,
    notes[],
    designers[] -> {
      name
    },
    authors[] -> {
      name
    },
    illustrators[] -> {
      name
    },
    artDirectors[] -> {
      name
    },
    photographers[] -> {
      name
    },
    images[] ${imageFragment}
  }
`)

export const bookIndexQuery = defineQuery(`
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
      images[] ${imageFragment}
    },
    "total": count(*[_type == 'book'])
  }
`)
