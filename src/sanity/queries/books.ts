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
  *[_type == 'book'] | order(datePublished desc) [$offset...$limit] {
    ...,
    notes[],
    designers[] -> {
      name
    },
    authors[] -> {
      name
    },
    images[] ${imageFragment}
  }
`)
