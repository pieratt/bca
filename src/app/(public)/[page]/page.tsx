import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {booksQuery, bookCount} from '@/sanity/queries'
import {notFound} from 'next/navigation'
import {BOOK_INDEX_LIMIT} from '@/lib'
import {BookIndex, Pagination} from '@/ui'
import {range} from 'lodash-es'

type PageContextBundle = {
  params: Promise<{
    page?: string
  }>
}

export default async function Page(props: PageContextBundle) {
  const {page} = await props.params
  try {
    const {data} = await sanityFetch({
      query: booksQuery,
      params: {start: (Number(page) - 1) * BOOK_INDEX_LIMIT, end: Number(page) * BOOK_INDEX_LIMIT},
    })
    return (
      <>
        <BookIndex books={data.books} />
        <Pagination page={Number(page)} total={data.total} />
      </>
    )
  } catch {
    console.error('unable to retrieve books')
    notFound()
  }
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

export async function generateStaticParams() {
  const total = await client.fetch(bookCount)
  if (!total) {
    throw new Error('unable to retrieve book count')
  }
  return range(2, Math.ceil(total / BOOK_INDEX_LIMIT)).map((n) => ({page: n.toString()}))
}
