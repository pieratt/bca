import pluralize from 'pluralize'

export const People = ({label, people}: {label: string; people?: {name: string}[] | null}) =>
  !people ? null : (
    <h2>
      {pluralize(label, people?.length)}:{' '}
      {people.map((person, i) => (
        <>
          {person.name}
          {i !== people.length - 1 ? ', ' : ''}
        </>
      ))}
    </h2>
  )
