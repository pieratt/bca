import {sanityFetch} from '@/sanity/lib/live'
import {bookIndexQuery} from '@/sanity/queries'
import {notFound} from 'next/navigation'
import {BOOK_INDEX_LIMIT} from '@/lib'
import {BookIndex, Pagination} from '@/ui'
import {console} from 'inspector/promises'

type PageContextBundle = {
  params: Promise<{
    page?: string
  }>
}

export default async function Page(props: PageContextBundle) {
  const {page} = await props.params
  const {data} = await sanityFetch({
    query: bookIndexQuery,
    params: {start: (Number(page) - 1) * BOOK_INDEX_LIMIT, end: Number(page) * BOOK_INDEX_LIMIT},
  })
  if (!data) {
    console.error('unable to retrieve books')
    notFound()
  }

  return (
    <>
      <BookIndex books={data.books} />
      <Pagination page={Number(page)} total={data.total} />
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
