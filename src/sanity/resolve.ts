import {defineDocuments, defineLocations, PresentationPluginOptions} from 'sanity/presentation'
import {getBlockDateParts} from '@/lib'

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {
      route: '/',
      filter: `_type == "page" && metadata.slug.current == "home"`,
    },
    {
      route: '/:slug',
      filter: `_type == "page" && metadata.slug.current == $slug`,
    },
    {
      route: '/news/:year/:month/:day/:slug',
      filter: `_type == "post" && metadata.slug.current == $slug`,
    },
  ]),
  locations: {
    page: defineLocations({
      select: {
        title: 'metadata.title',
        slug: 'metadata.slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/${doc?.slug}`,
          },
          {
            title: 'Home',
            href: '/',
          },
        ],
      }),
    }),

    post: defineLocations({
      select: {
        title: 'metadata.title',
        slug: 'metadata.slug.current',
        publishDate: 'publishDate',
      },
      resolve: (doc) => {
        let {year, month, day} = getBlockDateParts(doc?.publishDate)
        return {
          locations: [
            {
              title: doc?.title || 'Untitled',
              href: `/news/${year}/${month}/${day}/${doc?.slug}`,
            },
          ],
        }
      },
    }),

    navigation: defineLocations({
      message: 'This document is used on all pages',
      tone: 'caution',
    }),
    siteSettings: defineLocations({
      message: 'This document is used on all pages',
      tone: 'caution',
    }),
  },
}
