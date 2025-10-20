import {defineQuery} from 'next-sanity'
import {imageFragment} from './fragments'

export const personQuery = defineQuery(`
  *[_type == 'person' && slug.current == $slug][0]{
    ...,
    "books": *[_type == "book" && references(^._id)] | order(datePublished desc)  {
      _id,
      slug,
      title,
      "cover": images[0] ${imageFragment}
    }
  }
`)

export const peopleQuery = defineQuery(`
  *[_type == 'person'] {
    slug,
    _updatedAt
  }
`)
