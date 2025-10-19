import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {bookQuery, bookIndexQuery} from '@/sanity/queries'
import {notFound} from 'next/navigation'
import {BookPage} from '@/ui'

type BookPageContextBundle = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Book(props: BookPageContextBundle) {
  try {
    const {slug} = await props.params
    const {data: book} = await sanityFetch({
      query: bookQuery,
      params: {slug},
    })
    if (!book) {
      throw new Error('book not found')
    }
    return <BookPage book={book} />
  } catch {
    console.error('unable to retrieve book')
    notFound()
  }
}

// export async function generateMetadata(props: EventContextBundle): Promise<Metadata> {
// const {slug} = await props.params
// const {data} = await sanityFetch({
//   query: eventQuery,
//   params: {slug},
// })
// const {data: siteSettings} = await sanityFetch({
//   query: siteSettingsQuery,
// })
// if (!data?.metadata) throw new Error(`page metadata not found: ${slug}`)
// if (!siteSettings) throw new Error('site settings not found')
// const metadata = processMetadata(
//   siteSettings,
//   data._type,
//   data.metadata as any as Sanity.Metadata
// )
// return metadata
// }

export async function generateStaticParams() {
  const {books} = await client.fetch(bookIndexQuery, {
    start: 0,
    end: 99999,
    // we don't actually need 50 books, but this will let us use a cached query
  })
  if (!books) {
    throw new Error('unable to retrieve book slugs')
  }
  return books.map((book) => ({
    slug: book.slug.current,
  }))
}
