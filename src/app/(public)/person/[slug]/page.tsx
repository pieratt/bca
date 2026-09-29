import {getPersonBySlug, listPersonSlugs} from '@/data/catalog'
import {notFound} from 'next/navigation'
import {PersonPage} from '@/ui'

type PersonPageContextBundle = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Person(props: PersonPageContextBundle) {
  const {slug} = await props.params
  const person = await getPersonBySlug(slug)
  if (!person) notFound()
  return <PersonPage name={person.name} books={person.books} role={person.role} />
}

export async function generateStaticParams() {
  const slugs = await listPersonSlugs()
  return slugs.map((slug) => ({slug}))
}
