import NextLink from 'next/link'
import {styled} from '@linaria/react'
import {getArchiveIndex} from '@/data/catalog'

const PersonList = ({people}: {people: {slug: string; name: string}[]}) => (
  <ul>
    {people.map((person) => (
      <li key={person.slug}>
        <NextLink href={`/person/${person.slug}`}>{person.name}</NextLink>
      </li>
    ))}
  </ul>
)

export const ArchiveIndex = async () => {
  const {designers, illustrators, photographers, genres, years, splitColumns} = await getArchiveIndex()
  const designerCols = splitColumns(designers, 3)
  const yearCols = splitColumns(years, 2)

  return (
    <Bar>
      <Index>
        <Group>
          <h2>Designer</h2>
          <Cols className="three">
            {designerCols.map((col, i) => (
              <PersonList key={`designer-${i}`} people={col} />
            ))}
          </Cols>
        </Group>

        <Group>
          <h2>Year</h2>
          <Cols className="two">
            {yearCols.map((col, i) => (
              <ul key={`year-${i}`}>
                {col.map((year) => (
                  <li key={year}>{year}</li>
                ))}
              </ul>
            ))}
          </Cols>
        </Group>

        <Group>
          <h2>Illustrator</h2>
          <PersonList people={illustrators} />
        </Group>

        <Group>
          <h2>Photographers</h2>
          <PersonList people={photographers} />
        </Group>

        <Group>
          <h2>Genre</h2>
          <ul>
            {genres.map((genre) => (
              <li key={genre}>{genre}</li>
            ))}
          </ul>
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
    grid-template-columns: minmax(0, 2.6fr) minmax(0, 0.9fr) minmax(0, 0.8fr) minmax(0, 0.95fr) minmax(
        0,
        0.9fr
      );
    gap: 32px 36px;
    align-items: start;
  }
`

const Group = styled.div`
  min-width: 0;
`

const Cols = styled.div`
  display: grid;
  gap: 0 20px;

  &.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &.three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`
