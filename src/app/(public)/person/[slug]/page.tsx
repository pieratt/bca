import {sanityFetch} from '@/sanity/lib/live'
import {personQuery} from '@/sanity/queries'
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
    const {data: person} = await sanityFetch({
      query: personQuery,
      params: {slug},
    })
    if (!person) {
      throw new Error('person not found')
    }
    return <PersonPage person={person} />
  } catch {
    console.error('unable to retrieve person')
    notFound()
  }
}
