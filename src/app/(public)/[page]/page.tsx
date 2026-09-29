import {listBooksPage} from '@/data/catalog'
import {notFound} from 'next/navigation'
import {BOOK_INDEX_LIMIT} from '@/lib'
import {CoverGrid, Pagination} from '@/ui'

export const dynamic = 'force-dynamic'

type PageContextBundle = {
  params: Promise<{
    page?: string
  }>
}

export default async function Page(props: PageContextBundle) {
  const {page} = await props.params
  const pageNumber = Number(page)
  if (!pageNumber || pageNumber < 2) notFound()

  const {books, total} = await listBooksPage(pageNumber, BOOK_INDEX_LIMIT)
  if (!books.length) notFound()

  return (
    <>
      <CoverGrid books={books} />
      <Pagination page={pageNumber} total={total} />
    </>
  )
}

export async function generateStaticParams() {
  const {total} = await listBooksPage(1, BOOK_INDEX_LIMIT)
  const pages = Math.ceil(total / BOOK_INDEX_LIMIT)
  return Array.from({length: Math.max(pages - 1, 0)}, (_, index) => ({
    page: String(index + 2),
  }))
}
