'use client'

import {useState, type MouseEvent, type ReactNode} from 'react'
import NextLink from 'next/link'
import {styled} from '@linaria/react'

export type CountedEntry = {
  name: string
  count: number
  href?: string
  cover?: string
  covers?: string[]
}

const MIN_VISIBLE_COUNT = 2

type Preview = {
  covers: string[]
  top: number
  left: number
  width: number
}

export const CountedList = ({items}: {items: CountedEntry[]}) => {
  const [showAll, setShowAll] = useState(false)
  const [preview, setPreview] = useState<Preview | null>(null)
  const featured = items.filter((item) => item.count >= MIN_VISIBLE_COUNT)
  const hidden = items.filter((item) => item.count < MIN_VISIBLE_COUNT)
  const visible = showAll ? items : featured

  const coversFor = (item: CountedEntry) => {
    const next = item.covers?.filter(Boolean) ?? []
    if (!next.length && item.cover) next.push(item.cover)
    return next.slice(0, 5)
  }

  const showPreview = (item: CountedEntry, event: MouseEvent<HTMLElement>) => {
    const covers = coversFor(item)
    if (!covers.length) return
    const row = event.currentTarget.closest('li')
    if (!row) return
    const rect = row.getBoundingClientRect()
    setPreview({covers, top: rect.bottom, left: rect.left, width: rect.width})
  }

  const row = (item: CountedEntry, inner: ReactNode) =>
    item.href ? (
      <NextLink
        href={item.href}
        onMouseEnter={(event) => showPreview(item, event)}
        onMouseMove={(event) => showPreview(item, event)}
        onMouseLeave={() => setPreview(null)}
      >
        {inner}
      </NextLink>
    ) : (
      <span
        onMouseEnter={(event) => showPreview(item, event)}
        onMouseMove={(event) => showPreview(item, event)}
        onMouseLeave={() => setPreview(null)}
      >
        {inner}
      </span>
    )

  return (
    <>
      <ul>
        {visible.map((item) => (
          <li key={item.href ?? item.name}>{row(item, <>
            {item.name}
            <Count>{item.count}</Count>
          </>)}</li>
        ))}
      </ul>
      {hidden.length && !showAll ? (
        <Reveal type="button" onClick={() => setShowAll(true)}>
          show all
        </Reveal>
      ) : null}
      {preview ? (
        <Thumbs
          style={{
            top: preview.top,
            left: preview.left,
            width: preview.width,
          }}
        >
          {preview.covers.map((src) => (
            <img key={src} src={`${src}?w=320&f=webp`} alt="" />
          ))}
        </Thumbs>
      ) : null}
    </>
  )
}

const Count = styled.span`
  margin-left: 0.4em;
  opacity: 0.35;
  font-variant-numeric: tabular-nums;
`

const Reveal = styled.button`
  display: inline-block;
  margin-top: 14px;
  padding: 0;
  border: 0;
  background: none;
  color: #fff;
  font: inherit;
  font-size: 11px;
  line-height: 1.7;
  letter-spacing: 0.02em;
  text-decoration: underline;
  cursor: pointer;
`

const Thumbs = styled.div`
  position: fixed;
  z-index: 50;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 3px;
  padding: 4px 0 0;
  background: #000;
  pointer-events: none;

  img {
    display: block;
    width: 100%;
    height: auto;
    vertical-align: bottom;
  }
`
