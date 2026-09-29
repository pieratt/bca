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
          <Spread>Genre</Spread>
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
          <Spread>Designer</Spread>
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
          <Spread>Illustrator</Spread>
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
    justify-content: space-between;
    margin: 0 0 16px;
    color: #fff;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.2;
    text-transform: uppercase;
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
    display: block;
    box-sizing: border-box;
    padding: 10px 0;
    color: #fff;
    font-size: 11px;
    font-weight: 400;
    line-height: 1.35;
    text-decoration: none;
    text-transform: capitalize;
    border-bottom: 1px solid rgb(255 255 255 / 0.14);
  }

  li a:hover,
  li > span:hover {
    border-bottom-color: transparent;
  }
`

const Index = styled.div`
  column-count: 1;
  column-gap: 24px;

  @media only screen and (min-width: 648px) {
    column-count: 2;
    column-gap: 28px;
  }

  @media only screen and (min-width: 945px) {
    column-count: 3;
    column-gap: 32px;
  }

  @media only screen and (min-width: 1400px) {
    column-count: 4;
    column-gap: 36px;
  }
`

const Group = styled.div`
  min-width: 0;

  & + & {
    margin-top: 144px;
  }
`
