import {sanityFetch} from '@/sanity/lib/live'
import {bookIndexQuery} from '@/sanity/queries'
import {notFound} from 'next/navigation'
import {BOOK_INDEX_LIMIT} from '@/lib'
import {BookIndex, Pagination} from '@/ui'

export default async function Home() {
  const {data} = await sanityFetch({
    query: bookIndexQuery,
    params: {start: 0, end: BOOK_INDEX_LIMIT},
  })
  if (!data) {
    console.error('unable to retrieve books')
    notFound()
  }

  return (
    <>
      <BookIndex books={data.books} />
      <Pagination page={1} total={data.total} />
    </>
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
