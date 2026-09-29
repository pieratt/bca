import {listBooksPage} from '@/data/catalog'
import {BOOK_INDEX_LIMIT} from '@/lib'
import {CoverGrid, Pagination} from '@/ui'

export default async function Home() {
  const {books, total} = await listBooksPage(1, BOOK_INDEX_LIMIT)
  return (
    <>
      <CoverGrid books={books} />
      {total > BOOK_INDEX_LIMIT ? <Pagination page={1} total={total} /> : null}
    </>
  )
}
