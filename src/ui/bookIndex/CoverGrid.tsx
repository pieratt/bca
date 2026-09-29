import {styled} from '@linaria/react'
import type {LocalBook} from '@/data/archive'
import {FluidThumbGrid, HomeCoverGrid} from './HomeCoverGrid'

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

const FEATURED_POOL = 16

const featuredPoolFor = (books: LocalBook[]) => {
  const latest = books[0]
  if (!latest) return []
  return [latest, ...shuffle(books.slice(1)).slice(0, FEATURED_POOL - 1)]
}

export const CoverGrid = ({
  books,
  heading,
  featured = false,
}: {
  books: LocalBook[]
  heading?: string
  featured?: boolean
}) => (
  <Main role="main" className={heading ? 'interior' : undefined}>
    {heading ? <Heading>{heading}</Heading> : null}
    {featured ? (
      <HomeCoverGrid books={books.slice(1)} featuredPool={featuredPoolFor(books)} />
    ) : (
      <FluidThumbGrid books={books} />
    )}
  </Main>
)

const Main = styled.main`
  &.interior {
    padding-bottom: 56px;
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
