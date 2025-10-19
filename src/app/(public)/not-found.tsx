import {sanityFetch} from '@/sanity/lib/live'
import books from '@/generated/books.json'
import {sample} from 'lodash-es'
import {bookQuery} from '@/sanity/queries'
import {BookPage} from '@/ui'

export default async function NotFoundPage() {
  const randomBook = sample(books)
  const {data: book} = await sanityFetch({
    query: bookQuery,
    params: {slug: randomBook?.slug},
  })
  return (
    <>
      <h1 className="not-found">Not found. Here’s a random book.</h1>
      <BookPage book={book} />
    </>
  )
}
