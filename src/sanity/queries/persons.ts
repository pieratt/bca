import {defineQuery} from 'next-sanity'
import {imageFragment} from './fragments'

export const personQuery = defineQuery(`
  *[_type == 'person' && slug.current == $slug][0]{
    ...,
    "books": *[_type == "book" && references(^._id)] | order(datePublished desc)  {
      ...,
      images[] ${imageFragment}
    }
  }
`)

export const personIndexQuery = defineQuery(`
  *[_type == 'person'] | order(name desc) {
    ...
  }
`)
// TODO: this is for sitemap
