import RSS from 'rss'
import {sanityFetch} from '@/sanity/lib/live'
import {bookIndexQuery} from '@/sanity/queries'

export async function GET() {
  const {data: books} = await sanityFetch({
    query: bookIndexQuery,
    params: {offset: 0, limit: 50},
  })

  const pubDate = books[0]?.datePublished

  const feed = new RSS({
    title: 'Book Cover Archive',
    description: 'yeah dem books',
    site_url: 'https://yourwebsite.com',
    feed_url: `https://yourwebsite.com/feed.xml`,
    copyright: `${new Date().getFullYear()} InternetLand and Eric Jacobsen`,
    language: 'en',
    pubDate: pubDate ?? new Date(),
  })

  books?.forEach((book) => {
    feed.item({
      title: book.title,
      guid: `https://yourwebsite.com/book/${book.slug.current}`,
      url: `https://yourwebsite.com/book/${book.slug.current}`,
      date: book.datePublished!,
      description: `${designers(book.designers)}<img src="${book.images?.[0]?.asset?.url}" />`,
    })
  })

  return new Response(feed.xml({indent: true}), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

const designers = (people?: Array<{name: string}> | null) => {
  if (!people || people.length < 1) return ''

  return `<p>Designed by: ${people.map((a) => a.name).join(', ')}</p>`
}
