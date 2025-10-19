import pluralize from 'pluralize'
import NextLink from 'next/link'

export const People = ({
  label,
  people,
}: {
  label: string
  people: Array<Partial<Sanity.Person>> | null
}) =>
  !people ? null : (
    <h2>
      {pluralize(label, people?.length)}:{' '}
      {people.map((person, i) => (
        <>
          <NextLink href={`/person/${person?.slug?.current}`}>{person.name}</NextLink>
          {i !== people.length - 1 ? ', ' : ''}
        </>
      ))}
    </h2>
  )
