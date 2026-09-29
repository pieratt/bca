import {listBooksPage, getBookPageData} from '@/data/catalog'
import {BookPage} from '@/ui'

export default async function NotFoundPage() {
  const {books} = await listBooksPage(1, 20)
  const pick = books[Math.floor(Math.random() * Math.max(books.length, 1))]
  const book = pick ? await getBookPageData(pick.slug) : null

  return (
    <>
      <h1 className="not-found">Not found. Here’s a random book.</h1>
      {book ? <BookPage book={book} /> : null}
    </>
  )
}
