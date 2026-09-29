import {styled} from '@linaria/react'
import {getArchiveIndex} from '@/data/catalog'
import {CountedList} from './CountedList'

export const ArchiveIndex = async () => {
  const {designers, illustrators, photographers, genres} = await getArchiveIndex()

  return (
    <Bar>
      <Index>
        <Group>
          <h2>Designer</h2>
          <CountedList
            columns={3}
            items={designers.map((person) => ({
              name: person.name,
              count: person.count,
              href: `/person/${person.slug}`,
              cover: person.cover,
            }))}
          />
        </Group>

        <Group>
          <h2>Illustrator</h2>
          <CountedList
            items={illustrators.map((person) => ({
              name: person.name,
              count: person.count,
              href: `/person/${person.slug}`,
              cover: person.cover,
            }))}
          />
        </Group>

        <Group>
          <h2>Photographers</h2>
          <CountedList
            items={photographers.map((person) => ({
              name: person.name,
              count: person.count,
              href: `/person/${person.slug}`,
              cover: person.cover,
            }))}
          />
        </Group>

        <Group>
          <h2>Genre</h2>
          <CountedList
            items={genres.map((genre) => ({
              name: genre.name,
              count: genre.count,
              href: `/genre/${genre.slug}`,
              cover: genre.cover,
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
  padding: 48px 24px 72px;

  h2 {
    margin: 0 0 18px;
    color: #fff;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.12em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li,
  a {
    color: #fff;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.7;
    text-decoration: none;
    text-transform: capitalize;
  }

  a:hover {
    text-decoration: underline;
  }
`

const Index = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;

  @media only screen and (min-width: 900px) {
    grid-template-columns: minmax(0, 2.6fr) minmax(0, 0.8fr) minmax(0, 0.95fr) minmax(0, 0.9fr);
    gap: 32px 36px;
    align-items: start;
  }
`

const Group = styled.div`
  min-width: 0;
`
