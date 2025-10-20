import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {allPeopleQuery} from '@/sanity/queries'
import {notFound} from 'next/navigation'
import {PersonPage} from '@/ui'

type BookPageContextBundle = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Book(props: BookPageContextBundle) {
  try {
    const {slug} = await props.params
    const {data: people} = await sanityFetch({
      query: allPeopleQuery,
    })
    const person = people.find((person) => person.slug.current === slug)
    if (!person) {
      throw new Error('person not found')
    }
    return <PersonPage person={person} />
  } catch {
    console.error('unable to retrieve person')
    notFound()
  }
}

export async function generateStaticParams() {
  const people = await client.fetch(allPeopleQuery)
  if (!people) {
    throw new Error('unable to retrieve book slugs')
  }
  return people.map((person) => ({
    slug: person.slug.current,
  }))
}
