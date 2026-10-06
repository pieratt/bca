import NextLink from 'next/link'
import {styled} from '@linaria/react'
import type {LocalBook} from '@/data/archive'
import {CoverImage} from './CoverImage'

const CoverThumb = ({book, size, priority}: {book: LocalBook; size: 'featured' | 'thumb'; priority?: boolean}) => (
  <Cover>
    <NextLink href={`/book/${book.slug}`} title={book.title}>
      <CoverImage
        src={book.cover}
        alt={`cover of ${book.title}`}
        width={book.width}
        height={book.height}
        size={size}
        priority={priority}
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
        priority={index === 0}
      />
    ))}
  </Grid>
)

export const FluidThumbGrid = ({books}: {books: LocalBook[]}) => (
  <Grid>
    {books.map((book, index) => (
      <CoverThumb key={`${book.slug}-${index}`} book={book} size="thumb" />
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
    align-self: start;
  }

  @media only screen and (min-width: 744px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px;

    &.featured > article:first-child {
      grid-column: span 3;
      grid-row: span 3;
      align-self: start;
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
