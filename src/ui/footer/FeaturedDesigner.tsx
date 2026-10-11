import NextLink from 'next/link'
import {styled} from '@linaria/react'
import {CoverImage} from '../bookIndex/CoverImage'
import type {LocalBook} from '@/data/archive'

const STRIP_LIMIT = 32

export const FeaturedCreative = ({
  label,
  name,
  slug,
  books,
}: {
  label: string
  name: string
  slug: string
  books: LocalBook[]
}) => (
  <Block>
    <h2>
      Featured {label}: <NextLink href={`/person/${slug}`}>{name}</NextLink>
    </h2>
    <Strip>
      {books.slice(0, STRIP_LIMIT).map((book) => (
        <Thumb key={book.slug}>
          <NextLink href={`/book/${book.slug}`} title={book.title}>
            <CoverImage
              src={book.cover}
              alt={`cover of ${book.title}`}
              width={book.width}
              height={book.height}
              size="strip"
            />
          </NextLink>
        </Thumb>
      ))}
    </Strip>
  </Block>
)

const Block = styled.section`
  margin: 0 0 24px;

  &:last-of-type {
    margin-bottom: 48px;
  }

  h2 {
    margin: 0 0 8px;
  }

  h2 a {
    color: inherit;
    text-decoration: none;
  }

  h2 a:hover {
    text-decoration: underline;
  }
`

const Strip = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  gap: 8px;
  overflow: hidden;
  max-width: 100%;
`

const Thumb = styled.article`
  flex: 0 0 64px;
  width: 64px;
  min-width: 64px;

  a {
    display: block;
    color: inherit;
  }

  img {
    display: block;
    width: 64px;
    height: auto;
    vertical-align: bottom;
  }
`
