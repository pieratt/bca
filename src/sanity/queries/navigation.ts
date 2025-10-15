import {defineQuery} from 'next-sanity'

export const navigationQuery = defineQuery(`
  *[_type == 'navigation' && slug.current == $slug][0]{
    ...,
    links[] {
      ...,
      link {
        ...,
        internalLink -> {
          metadata
        }
      }
    }
  }
`)
