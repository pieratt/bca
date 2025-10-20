import {styled} from '@linaria/react'
import {BookThumb} from '@/ui'

export const PersonPage = ({person}: {person: Sanity.PersonQueryResult}) =>
  !person ? null : (
    <main role="main">
      <Books>
        <h1>Books that {person.name} had something or other to do with</h1>
        {person.books.map((book) => (
          <BookThumb key={book._id} book={book as any as Sanity.Book} />
        ))}
      </Books>
    </main>
  )

const Books = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, calc((100vw - 80px) / 3));
  gap: 25px 20px;
  @media only screen and (min-width: 744px) {
    grid-template-columns: repeat(auto-fill, 140px);
    gap: 35px 20px;
  }

  h1 {
    grid-column-end: span 2;
    grid-row-end: span 2;
    font-size: 1.4rem;
    line-height: 1.8rem;
  }
`
