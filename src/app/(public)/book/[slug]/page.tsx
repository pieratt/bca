import {sanityFetch} from '@/sanity/lib/live'
import {bookQuery} from '@/sanity/queries'
import {notFound} from 'next/navigation'
import {BookPage} from '@/ui'

type BookPageContextBundle = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Book(props: BookPageContextBundle) {
  const {slug} = await props.params
  const {data: book} = await sanityFetch({
    query: bookQuery,
    params: {slug},
  })
  if (!book) {
    console.error('unable to retrieve books')
    notFound()
  }

  return <BookPage book={book} />
}
