import {styled} from '@linaria/react'
import {getArchiveIndex} from '@/data/catalog'
import {CountedList} from './CountedList'

const toItems = (
  rows: {name: string; slug: string; count: number; cover?: string; covers?: string[]}[],
  kind: 'genre' | 'person'
) =>
  rows.map((row) => ({
    name: row.name,
    count: row.count,
    href: kind === 'genre' ? `/genre/${row.slug}` : `/person/${row.slug}`,
    cover: row.cover,
    covers: row.covers,
  }))

export const ArchiveIndex = async () => {
  const {designers, illustrators, photographers, genres} = await getArchiveIndex()

  return (
    <Bar>
      <Index>
        <Group>
          <h2>Genres</h2>
          <CountedList items={toItems(genres, 'genre')} />
        </Group>

        <Group data-wide>
          <h2>Designers</h2>
          <CountedList items={toItems(designers, 'person')} collapseBelow={2} />
        </Group>

        <Group>
          <h2>Illustrators</h2>
          <CountedList items={toItems(illustrators, 'person')} collapseBelow={2} />
        </Group>

        <Group>
          <h2>Photographers</h2>
          <CountedList items={toItems(photographers, 'person')} collapseBelow={2} />
        </Group>
      </Index>
    </Bar>
  )
}

const Bar = styled.div`
  --row: 24px;
  background: #000;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  padding: 48px 20px 72px;

  @media only screen and (min-width: 900px) {
    padding: 56px 25px 80px;
  }

  h2 {
    box-sizing: border-box;
    height: var(--row);
    margin: 0 0 4px;
    padding: 0;
    color: #fff;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.45em;
    line-height: var(--row);
    text-transform: uppercase;
    white-space: nowrap;
    column-span: all;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin: 0;
    break-inside: avoid;
  }

  li a,
  li > span {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    height: var(--row);
    padding: 0;
    color: #fff;
    font-size: 11px;
    font-weight: 400;
    line-height: var(--row);
    text-decoration: none;
    text-transform: none;
  }

  li.is-open a,
  li.is-open > span,
  li a:hover,
  li > span:hover {
    text-transform: uppercase;
  }

  li.is-open .name,
  li a:hover .name,
  li > span:hover .name {
    letter-spacing: 0.45em;
  }

  .show-all {
    appearance: none;
    display: block;
    width: 100%;
    margin: 4px 0 0;
    padding: 0;
    border: 0;
    background: none;
    color: #fff;
    font: inherit;
    font-size: 11px;
    line-height: var(--row);
    text-align: left;
    text-decoration: underline;
    cursor: pointer;
    opacity: 0.55;
    column-span: all;
    break-inside: avoid;
  }

  .show-all:hover {
    opacity: 1;
  }
`

const Index = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 32px 24px;

  @media only screen and (min-width: 900px) {
    flex-wrap: nowrap;
  }
`

const Group = styled.div`
  min-width: 160px;
  flex: 0 1 160px;
  column-width: 160px;
  column-gap: 24px;

  &[data-wide] {
    flex: 1 1 320px;
  }
`
