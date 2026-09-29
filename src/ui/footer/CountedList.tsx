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

type Preview = {
  covers: string[]
  top: number
  left: number
  width: number
}

export const CountedList = ({items}: {items: CountedEntry[]}) => {
  const [preview, setPreview] = useState<Preview | null>(null)
  const [hoverKey, setHoverKey] = useState<string | null>(null)

  const coversFor = (item: CountedEntry) => {
    const next = item.covers?.filter(Boolean) ?? []
    if (!next.length && item.cover) next.push(item.cover)
    return next.slice(0, 1)
  }

  const showPreview = (item: CountedEntry, event: MouseEvent<HTMLElement>) => {
    setHoverKey(item.href ?? item.name)
    const covers = coversFor(item)
    if (!covers.length) return
    const row = event.currentTarget.closest('li')
    if (!row) return
    const rect = row.getBoundingClientRect()
    setPreview({covers, top: rect.bottom, left: rect.left, width: rect.width})
  }

  const leaveRow = () => {
    setPreview(null)
    setHoverKey(null)
  }

  const displayName = (name: string) =>
    name.replace(/(^|\s)(\S)/g, (chunk) => chunk.toUpperCase())

  const row = (item: CountedEntry, inner: ReactNode) =>
    item.href ? (
      <NextLink
        href={item.href}
        onMouseEnter={(event) => {
          setHoverKey(item.href ?? item.name)
          showPreview(item, event)
        }}
        onMouseMove={(event) => showPreview(item, event)}
        onMouseLeave={leaveRow}
      >
        {inner}
      </NextLink>
    ) : (
      <span
        onMouseEnter={(event) => {
          setHoverKey(item.name)
          showPreview(item, event)
        }}
        onMouseMove={(event) => showPreview(item, event)}
        onMouseLeave={leaveRow}
      >
        {inner}
      </span>
    )

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.href ?? item.name} className={hoverKey === (item.href ?? item.name) ? 'is-open' : undefined}>{row(item, <>
            <Mark className="name">
              {[...displayName(item.name)].map((letter, index) => (
                <span key={`${letter}-${index}`}>{letter === ' ' ? '\u00a0' : letter}</span>
              ))}
            </Mark>
            <Count>{item.count}</Count>
          </>)}</li>
        ))}
      </ul>
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

const Mark = styled.span`
  flex: 0 1 auto;
  min-width: 0;
`

const Count = styled.span`
  flex: 0 0 auto;
  margin-left: 0.55em;
  opacity: 0.35;
  font-variant-numeric: tabular-nums;
`

const Thumbs = styled.div`
  position: fixed;
  z-index: 50;
  display: flex;
  justify-content: center;
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
