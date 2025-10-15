import {defineQuery} from 'next-sanity'
import {imageFragment, linkFragment} from './fragments'

export const pageQuery = defineQuery(`
  *[_type == 'page' && metadata.slug.current == $slug][0]{
    metadata {
      ...
    },
    modules[] {
      ...,
      slides[] {
        ...,
        cta {
          ...,
          link ${linkFragment}
        },
        image ${imageFragment}
      },
      logos[] {
        ...,
        logo ${imageFragment}
      },
      image ${imageFragment},
      images[] ${imageFragment},
      cards[] {
        ...,
        image ${imageFragment}
      },
      columns[] {
        ...,
        image ${imageFragment},
        cta {
          ...,
          link ${linkFragment},
        }
      },
      cta {
        ...,
        link ${linkFragment}
      }
    }
  }
`)

export const pageIndexQuery = defineQuery(`
  *[_type == 'page']{
    _updatedAt,
    metadata {
      ...
    }
  }
`)
