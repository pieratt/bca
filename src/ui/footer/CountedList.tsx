'use client'

import {useState, type MouseEvent} from 'react'
import NextLink from 'next/link'
import {styled} from '@linaria/react'
import {splitColumns} from '@/data/archive'

export type CountedEntry = {
  name: string
  count: number
  href?: string
  cover?: string
}

const MIN_VISIBLE_COUNT = 2

export const CountedList = ({items, columns = 1}: {items: CountedEntry[]; columns?: number}) => {
  const [showAll, setShowAll] = useState(false)
  const [preview, setPreview] = useState<{src: string; x: number; y: number} | null>(null)
  const featured = items.filter((item) => item.count >= MIN_VISIBLE_COUNT)
  const hidden = items.filter((item) => item.count < MIN_VISIBLE_COUNT)
  const visible = showAll ? items : featured
  const cols = splitColumns(visible, columns)

  const showPreview = (cover: string | undefined, event: MouseEvent) => {
    if (!cover) return
    setPreview({src: cover, x: event.clientX, y: event.clientY})
  }

  return (
    <>
      <Cols data-cols={columns}>
        {cols.map((col, index) => (
          <ul key={index}>
            {col.map((item) => (
              <li key={item.href ?? item.name}>
                {item.href ? (
                  <NextLink
                    href={item.href}
                    onMouseEnter={(event) => showPreview(item.cover, event)}
                    onMouseMove={(event) => showPreview(item.cover, event)}
                    onMouseLeave={() => setPreview(null)}
                  >
                    {item.name}
                    <Count>{item.count}</Count>
                  </NextLink>
                ) : (
                  <span
                    onMouseEnter={(event) => showPreview(item.cover, event)}
                    onMouseMove={(event) => showPreview(item.cover, event)}
                    onMouseLeave={() => setPreview(null)}
                  >
                    {item.name}
                    <Count>{item.count}</Count>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </Cols>
      {hidden.length && !showAll ? (
        <Reveal type="button" onClick={() => setShowAll(true)}>
          show all
        </Reveal>
      ) : null}
      {preview ? (
        <Thumb
          src={`${preview.src}?w=480&f=webp`}
          alt=""
          style={{left: preview.x + 16, top: preview.y + 16}}
        />
      ) : null}
    </>
  )
}

const Cols = styled.div`
  display: grid;
  gap: 0 20px;

  &[data-cols='2'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &[data-cols='3'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

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
  font-size: 13px;
  line-height: 1.7;
  letter-spacing: 0.02em;
  text-decoration: underline;
  cursor: pointer;
`

const Thumb = styled.img`
  position: fixed;
  z-index: 50;
  width: 144px;
  height: auto;
  pointer-events: none;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.45);
`
