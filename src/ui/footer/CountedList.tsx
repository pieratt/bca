'use client'

import {useState} from 'react'
import NextLink from 'next/link'
import {styled} from '@linaria/react'
import {splitColumns} from '@/data/archive'

export type CountedEntry = {
  name: string
  count: number
  href?: string
}

const MIN_VISIBLE_COUNT = 2

export const CountedList = ({items, columns = 1}: {items: CountedEntry[]; columns?: number}) => {
  const [showAll, setShowAll] = useState(false)
  const featured = items.filter((item) => item.count >= MIN_VISIBLE_COUNT)
  const hidden = items.filter((item) => item.count < MIN_VISIBLE_COUNT)
  const visible = showAll ? items : featured
  const cols = splitColumns(visible, columns)

  return (
    <>
      <Cols data-cols={columns}>
        {cols.map((col, index) => (
          <ul key={index}>
            {col.map((item) => (
              <li key={item.href ?? item.name}>
                {item.href ? (
                  <NextLink href={item.href}>
                    {item.name}
                    <Count>{item.count}</Count>
                  </NextLink>
                ) : (
                  <>
                    {item.name}
                    <Count>{item.count}</Count>
                  </>
                )}
              </li>
            ))}
          </ul>
        ))}
      </Cols>
      {hidden.length && !showAll ? (
        <Reveal type="button" onClick={() => setShowAll(true)}>
          Show All
        </Reveal>
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
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: underline;
  cursor: pointer;
`
