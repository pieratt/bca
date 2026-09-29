import NextLink from 'next/link'
import {styled} from '@linaria/react'
import type {LocalBook} from '@/data/archive'

export const CoverGrid = ({books, heading}: {books: LocalBook[]; heading?: string}) => (
  <main role="main">
    <Grid className={heading ? 'plain' : 'featured'}>
      {heading ? <Heading>{heading}</Heading> : null}
      {books.map((book, index) => (
        <Cover key={`${book.slug}-${index}`}>
          <NextLink href={`/book/${book.slug}`} title={book.title}>
            <img src={`${book.cover}?w=640&f=webp`} alt={`cover of ${book.title}`} />
          </NextLink>
        </Cover>
      ))}
    </Grid>
  </main>
)

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px 16px;
  align-items: end;

  @media only screen and (min-width: 744px) {
    grid-template-columns: repeat(auto-fill, 140px);
    gap: 35px 20px;
  }

  &.featured > article:first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  @media only screen and (min-width: 744px) {
    &.featured > article:first-child {
      grid-column: span 3;
      grid-row: span 3;
    }
  }
`

const Heading = styled.h1`
  grid-column: 1 / -1;
  font-size: 1.4rem;
  line-height: 1.4;
  margin: 0 0 8px;
`

const Cover = styled.article`
  min-width: 0;
  align-self: end;

  a {
    display: block;
    color: inherit;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    vertical-align: bottom;
  }
`
