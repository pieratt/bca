import RSS from 'rss'
import {client} from '@/sanity/lib/client'
import {bookIndexQuery} from '@/sanity/queries'

export async function GET() {
  const {books} = await client.fetch(bookIndexQuery, {
    start: 0,
    end: 50,
    // we don't actually need 50 books, but this will let us use a cached query
  })

  const pubDate = books[0]?.datePublished

  const feed = new RSS({
    title: 'Book Cover Archive',
    description: 'yeah dem books',
    site_url: 'https://bookcoverarchive.com',
    feed_url: `https://bookcoverarchive.com/feed.xml`,
    copyright: `${new Date().getFullYear()} InternetLand and Eric Jacobsen`,
    language: 'en',
    pubDate: pubDate ?? new Date(),
  })

  books?.forEach((book) => {
    feed.item({
      title: book.title,
      guid: `https://bookcoverarchive.com/book/${book.slug.current}`,
      url: `https://bookcoverarchive.com/book/${book.slug.current}`,
      date: book.datePublished!,
      description: `${designers(book.designers)}<img src="${book.image?.asset?.url}" />`,
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
