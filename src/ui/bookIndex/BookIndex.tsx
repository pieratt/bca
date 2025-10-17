import {styled} from '@linaria/react'
import {BookThumb} from './BookThumb'
import {Pagination} from '@/ui'

export const BookIndex = ({books}: Pick<Sanity.BookIndexQueryResult, 'books'>) => (
  <main role="main">
    <Books>
      {books.map((book) => (
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
`
