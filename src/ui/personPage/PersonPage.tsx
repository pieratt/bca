import NextLink from 'next/link'
import {styled} from '@linaria/react'
import Image from 'next/image'

export const PersonPage = ({person}: {person: Sanity.PersonQueryResult}) =>
  !person ? null : (
    <main role="main">
      <Books>
        <h1>Books that {person.name} had something or other to do with</h1>
        {person.books.map((book) => (
          <Book key={book._id}>
            <NextLink href={`/book/${book.slug.current}`} title={book.title}>
              <Image
                src={book.images?.[0]?.asset?.url!}
                alt={`cover of ${book.title}`}
                width={book.images?.[0]?.asset?.metadata?.dimensions?.width}
                height={book.images?.[0]?.asset?.metadata?.dimensions?.height}
                sizes="(min-width:744px) 15vw, 50vw"
              />
            </NextLink>
          </Book>
        ))}
      </Books>
    </main>
  )

const Books = styled.section`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(auto, 1fr);
  gap: 35px 25px;
  h1 {
    grid-column-end: span 2;
    grid-row-end: span 2;
    font-size: 1.4rem;
    line-height: 1.8rem;
  }
`

const Book = styled.article`
  img {
    width: 100%;
    height: auto;
  }
`
