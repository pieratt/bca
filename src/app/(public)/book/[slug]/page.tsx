import {getBookPageData, listBookSlugs} from '@/data/catalog'
import {notFound} from 'next/navigation'
import {BookPage} from '@/ui'

type BookPageContextBundle = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Book(props: BookPageContextBundle) {
  const {slug} = await props.params
  const book = await getBookPageData(slug)
  if (!book) notFound()
  return <BookPage book={book} />
}

export async function generateStaticParams() {
  const slugs = await listBookSlugs()
  return slugs.map((slug) => ({slug}))
}
