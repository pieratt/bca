import {defineQuery} from 'next-sanity'
import {imageFragment} from './fragments'

export const personQuery = defineQuery(`
  *[_type == 'person' && slug.current == $slug][0]{
    ...,
    "books": *[_type == "book" && references(^._id)] | order(datePublished desc)  {
      ...,
      "cover": images[0] ${imageFragment}
    }
  }
`)

export const allPeopleQuery = defineQuery(`
  *[_type == 'person'] {
    ...,
    "books": *[_type == "book" && references(^._id)] | order(datePublished desc)  {
      _id,
      slug,
      title,
      "cover": images[0] ${imageFragment}
    }
  }
`)
// 1000+ people is too many API calls
// Fetch once, NextJS should use cached version
// And we can use it for /[person] staticParams and sitemap
