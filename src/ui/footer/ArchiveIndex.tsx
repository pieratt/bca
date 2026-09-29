import {styled} from '@linaria/react'
import {getArchiveIndex} from '@/data/catalog'
import {CountedList} from './CountedList'

const Spread = ({children}: {children: string}) => (
  <h2>
    {[...children].map((letter, index) => (
      <span key={`${letter}-${index}`}>{letter === ' ' ? '\u00a0' : letter}</span>
    ))}
  </h2>
)

export const ArchiveIndex = async () => {
  const {designers, illustrators, photographers, genres} = await getArchiveIndex()

  return (
    <Bar>
      <Index>
        <Group>
          <Spread>Genres</Spread>
          <CountedList
            items={genres.map((genre) => ({
              name: genre.name,
              count: genre.count,
              href: `/genre/${genre.slug}`,
              cover: genre.cover,
              covers: genre.covers,
            }))}
          />
        </Group>

        <Group>
          <Spread>Designers</Spread>
          <CountedList
            items={designers.map((person) => ({
              name: person.name,
              count: person.count,
              href: `/person/${person.slug}`,
              cover: person.cover,
              covers: person.covers,
            }))}
          />
        </Group>

        <Group>
          <Spread>Illustrators</Spread>
          <CountedList
            items={illustrators.map((person) => ({
              name: person.name,
              count: person.count,
              href: `/person/${person.slug}`,
              cover: person.cover,
              covers: person.covers,
            }))}
          />
        </Group>

        <Group>
          <Spread>Photographers</Spread>
          <CountedList
            items={photographers.map((person) => ({
              name: person.name,
              count: person.count,
              href: `/person/${person.slug}`,
              cover: person.cover,
              covers: person.covers,
            }))}
          />
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    height: var(--row);
    margin: 0;
    padding: 0;
    color: #fff;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: var(--row);
    text-transform: uppercase;
    break-inside: avoid;
    break-after: avoid;
  }

  h2 span {
    flex: 0 0 auto;
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
    justify-content: center;
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
    justify-content: space-between;
    text-transform: uppercase;
  }

  li.is-open .name,
  li a:hover .name,
  li > span:hover .name {
    display: flex;
    flex: 1 1 auto;
    justify-content: space-between;
  }
`

const Index = styled.div`
  column-width: 160px;
  column-gap: 24px;
`

const Group = styled.div`
  min-width: 0;

  & + & {
    margin-top: calc(var(--row) * 2);
  }
`
