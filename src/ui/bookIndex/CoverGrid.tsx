import NextLink from 'next/link'
import {styled} from '@linaria/react'
import type {LocalBook} from '@/data/archive'

const shuffle = <T,>(items: T[]): T[] => {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = next[i]
    next[i] = next[j]
    next[j] = current
  }
  return next
}

export const CoverGrid = ({books, heading}: {books: LocalBook[]; heading?: string}) => (
  <Main role="main" className={heading ? 'interior' : undefined}>
    {heading ? <Heading>{heading}</Heading> : null}
    <Grid className={heading ? 'plain' : 'featured'}>
      {shuffle(books).map((book, index) => (
        <Cover key={`${book.slug}-${index}`}>
          <NextLink href={`/book/${book.slug}`} title={book.title}>
            <img src={`${book.cover}?w=640&f=webp`} alt={`cover of ${book.title}`} />
          </NextLink>
        </Cover>
      ))}
    </Grid>
  </Main>
)

const Main = styled.main`
  &.interior {
    padding-bottom: 56px;
  }
`

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
`

const Heading = styled.h1`
  max-width: 18ch;
  margin: 0 0 8px;
  color: #111;
  font-family: var(--title), 'DM Sans', sans-serif;
  font-size: clamp(1.8rem, 4.8vw, 3.75rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.05em;
  text-wrap: balance;
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
