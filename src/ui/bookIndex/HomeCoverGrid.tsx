'use client'

import {useLayoutEffect, useRef, useState} from 'react'
import NextLink from 'next/link'
import {styled} from '@linaria/react'
import type {LocalBook} from '@/data/archive'

const FEATURED_MIN = 300
const THUMB_MIN = 140
const ROW_GAP = 20
const DESKTOP = '(min-width: 744px)'

const fitCount = (width: number, minSize: number) =>
  Math.max(1, Math.floor((width + ROW_GAP) / (minSize + ROW_GAP)))

const CoverThumb = ({book, size}: {book: LocalBook; size: 'featured' | 'thumb'}) => (
  <Cover>
    <NextLink href={`/book/${book.slug}`} title={book.title}>
      <img
        src={`${book.cover}?w=${size === 'featured' ? 960 : 640}&f=webp`}
        alt={`cover of ${book.title}`}
      />
    </NextLink>
  </Cover>
)

export const HomeCoverGrid = ({books, featuredPool}: {books: LocalBook[]; featuredPool: LocalBook[]}) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const [featuredCount, setFeaturedCount] = useState(1)
  const [thumbCols, setThumbCols] = useState(3)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const measure = () => {
      const width = frame.clientWidth
      const desktop = window.matchMedia(DESKTOP).matches
      setFeaturedCount(Math.min(featuredPool.length, desktop ? fitCount(width, FEATURED_MIN) : 1))
      setThumbCols(desktop ? fitCount(width, THUMB_MIN) : 3)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [featuredPool.length])

  const featured = featuredPool.slice(0, featuredCount)

  return (
    <Frame ref={frameRef}>
      <Row style={{'--row-count': featuredCount} as React.CSSProperties}>
        {featured.map((book, index) => (
          <CoverThumb key={`${book.slug}-featured-${index}`} book={book} size="featured" />
        ))}
      </Row>
      <Grid style={{'--thumb-cols': thumbCols} as React.CSSProperties}>
        {books.map((book, index) => (
          <CoverThumb key={`${book.slug}-${index}`} book={book} size="thumb" />
        ))}
      </Grid>
    </Frame>
  )
}

export const FluidThumbGrid = ({books}: {books: LocalBook[]}) => {
  const frameRef = useRef<HTMLElement>(null)
  const [thumbCols, setThumbCols] = useState(3)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const measure = () => {
      const desktop = window.matchMedia(DESKTOP).matches
      setThumbCols(desktop ? fitCount(frame.clientWidth, THUMB_MIN) : 3)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  return (
    <Grid ref={frameRef} style={{'--thumb-cols': thumbCols} as React.CSSProperties}>
      {books.map((book, index) => (
        <CoverThumb key={`${book.slug}-${index}`} book={book} size="thumb" />
      ))}
    </Grid>
  )
}

const Frame = styled.div`
  min-width: 0;
`

const Row = styled.section`
  display: grid;
  grid-template-columns: repeat(var(--row-count, 1), minmax(0, 1fr));
  gap: 16px;
  align-items: end;
  margin-bottom: 16px;

  @media only screen and (min-width: 744px) {
    gap: 20px;
    margin-bottom: 20px;
  }
`

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(var(--thumb-cols, 3), minmax(0, 1fr));
  gap: 16px;
  align-items: end;

  @media only screen and (min-width: 744px) {
    gap: 20px;
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
