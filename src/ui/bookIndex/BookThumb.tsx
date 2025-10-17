'use client'

import NextLink from 'next/link'
import {styled} from '@linaria/react'
import Image from 'next/image'
import {Blur} from '@/ui'
import {useState} from 'react'
import {resolveReference} from '@/lib'

export const BookThumb = ({book}: {book: Sanity.Book}) => {
  const [loaded, setLoaded] = useState(false)
  return (
    <Wrapper key={book._id}>
      <NextLink href={`/book/${book.slug.current}`} title={book.title}>
        <NextImage
          src={resolveReference(book.images?.[0]?.asset)?.url!}
          alt={`cover of ${book.title}`}
          width={resolveReference(book.images?.[0]?.asset)?.metadata?.dimensions?.width}
          height={resolveReference(book.images?.[0]?.asset)?.metadata?.dimensions?.height}
          sizes="140px"
          onLoad={() => setLoaded(true)}
          className={loaded ? 'loaded' : ''}
        />
        {resolveReference(book.images?.[0]?.asset)?.metadata?.blurHash && (
          <Blur hash={resolveReference(book.images?.[0]?.asset)?.metadata!.blurHash!} />
        )}
      </NextLink>
    </Wrapper>
  )
}

const Wrapper = styled.article`
  position: relative;
  align-self: end;
  &:first-child {
    grid-column-end: span 2;
    grid-row-end: span 2;
  }
  @media only screen and (min-width: 744px) {
    &:first-child {
      grid-column-end: span 3;
      grid-row-end: span 3;
    }
  }
  img {
    position: relative;
    z-index: 1;
    width: 100%;
    height: auto;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    &.loaded {
      opacity: 1;
    }
  }
`

const NextImage = styled(Image)`
  position: relative;
`
