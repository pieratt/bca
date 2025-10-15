import {client} from '@/sanity/lib/client'
import type {MetadataRoute} from 'next'
import {pageIndexQuery} from '@/sanity/queries'
import {BASE_URL} from '@/lib'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await client.fetch(pageIndexQuery)

  const parsedPages = pages.map((page) => ({
    url: `${BASE_URL}/${page.metadata.slug.current}`,
    lastModified: page._updatedAt,
    priority: page.metadata.slug.current === 'home' ? 1 : 0.8,
  }))

  return [...parsedPages]
}
