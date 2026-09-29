import RSS from 'rss'
import {listBooksPage} from '@/data/catalog'

export async function GET() {
  const {books} = await listBooksPage(1, 50)
  const feed = new RSS({
    title: 'Book Cover Archive',
    description: 'yeah dem books',
    site_url: 'https://bookcoverarchive.com',
    feed_url: 'https://bookcoverarchive.com/feed.xml',
    copyright: `${new Date().getFullYear()} InternetLand and Eric Jacobsen`,
    language: 'en',
    pubDate: new Date(),
  })

  books.forEach((book) => {
    feed.item({
      title: book.title,
      guid: `https://bookcoverarchive.com/book/${book.slug}`,
      url: `https://bookcoverarchive.com/book/${book.slug}`,
      date: book.year ? new Date(`${book.year}-01-01`) : new Date(),
      description: `<img src="${book.cover}" alt="cover of ${book.title}" />`,
    })
  })

  return new Response(feed.xml({indent: true}), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
