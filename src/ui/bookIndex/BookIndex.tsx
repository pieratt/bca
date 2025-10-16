import NextLink from 'next/link'
import {styled} from '@linaria/react'
import Image from 'next/image'

export const BookIndex = ({books}: {books: Sanity.BookIndexQueryResult}) => (
  <main role="main">
    <Books>
      {books.map((book) => (
        <Book key={book._id}>
          <NextLink href={`/book/${book.slug.current}`} title={book.title}>
            <Image
              src={book.images?.[0]?.asset?.url!}
              alt={`cover of ${book.title}`}
              width={book.images?.[0]?.asset?.metadata?.dimensions?.width}
              height={book.images?.[0]?.asset?.metadata?.dimensions?.height}
              sizes="(min-width:744) 15vw, 50vw"
            />
          </NextLink>
        </Book>
      ))}
    </Books>

    <div className="grid_footer">
      <p>SEARCH AND PAGINATION HERE</p>
    </div>
  </main>
)

const Books = styled.section`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(auto, 1fr);
  gap: 35px 25px;
`

const Book = styled.article`
  &:first-child {
    grid-column-end: span 2;
    grid-row-end: span 2;
  }
  img {
    width: 100%;
    height: auto;
  }
`
