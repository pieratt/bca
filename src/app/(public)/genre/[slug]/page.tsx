import {getGenreBySlug, listGenreSlugs} from '@/data/catalog'
import {notFound, redirect} from 'next/navigation'
import {GenrePage} from '@/ui'

type GenrePageContextBundle = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Genre(props: GenrePageContextBundle) {
  const {slug} = await props.params
  const genre = await getGenreBySlug(slug)
  if (!genre) notFound()
  if (genre.alias) redirect(`/genre/${genre.slug}`)
  return <GenrePage name={genre.name} books={genre.books} />
}

export async function generateStaticParams() {
  const slugs = await listGenreSlugs()
  return slugs.map((slug) => ({slug}))
}
