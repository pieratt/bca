import {sanityFetch} from '@/sanity/lib/live'
import {bookIndexQuery} from '@/sanity/queries'
import {notFound} from 'next/navigation'
import {BOOK_INDEX_LIMIT} from '@/lib'
import NextLink from 'next/link'

type PageContextBundle = {
  params: Promise<{
    page?: string
  }>
}

export default async function Page(props: PageContextBundle) {
  const {page} = await props.params
  const {data: books} = await sanityFetch({
    query: bookIndexQuery,
    params: {offset: Number(page), limit: Number(page) + BOOK_INDEX_LIMIT},
  })
  if (!books) {
    console.error('unable to retrieve books')
    notFound()
  }

  return (
    <ul>
      {books?.map((book) => (
        <li key={book._id}>
          <NextLink href={`/book/${book.slug.current}`}>{book.title}</NextLink>
        </li>
      ))}
    </ul>
  )
}

// export async function generateMetadata() {
// const {data} = await sanityFetch({
//   query: pageQuery,
//   params: {slug: 'home'},
// })
// if (!data?.metadata) throw new Error('page metadata not found')
// const metadata = processMetadata(data.metadata, 'page')
// return {
//   ...metadata,
//   // title: DEFAULT_SITE_TITLE,
//   openGraph: {
//     ...metadata.openGraph,
//     // title: DEFAULT_SITE_TITLE,
//   },
//   alternates: {
//     // canonical: BASE_URL,
//   },
// }
// }
