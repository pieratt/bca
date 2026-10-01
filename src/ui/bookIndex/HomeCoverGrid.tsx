import NextLink from 'next/link'
import {styled} from '@linaria/react'
import type {LocalBook} from '@/data/archive'

const CoverThumb = ({book, size, lazy}: {book: LocalBook; size: 'featured' | 'thumb'; lazy?: boolean}) => (
  <Cover>
    <NextLink href={`/book/${book.slug}`} title={book.title}>
      <img
        src={`${book.cover}?w=${size === 'featured' ? 1200 : 640}&f=webp`}
        alt={`cover of ${book.title}`}
        width={book.width}
        height={book.height}
        loading={lazy ? 'lazy' : 'eager'}
      />
    </NextLink>
  </Cover>
)

export const HomeCoverGrid = ({books}: {books: LocalBook[]}) => (
  <Grid className="featured">
    {books.map((book, index) => (
      <CoverThumb
        key={`${book.slug}-${index}`}
        book={book}
        size={index === 0 ? 'featured' : 'thumb'}
        lazy={index > 11}
      />
    ))}
  </Grid>
)

export const FluidThumbGrid = ({books}: {books: LocalBook[]}) => (
  <Grid>
    {books.map((book, index) => (
      <CoverThumb key={`${book.slug}-${index}`} book={book} size="thumb" lazy={index > 11} />
    ))}
  </Grid>
)

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: end;

  &.featured > article:first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  @media only screen and (min-width: 744px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px;

    &.featured > article:first-child {
      grid-column: span 3;
      grid-row: span 3;
    }
  }
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
