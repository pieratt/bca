import {range} from 'lodash-es'
import {BOOK_INDEX_LIMIT} from '@/lib'
import {styled} from '@linaria/react'
import NextLink from 'next/link'

export const Pagination = ({page, total}: {page: number; total: number}) => (
  <div className="grid_footer">
    <p>
      books {(page - 1) * BOOK_INDEX_LIMIT} through {page * BOOK_INDEX_LIMIT - 1}
    </p>
    <Pages>
      {range(1, Math.ceil(total / BOOK_INDEX_LIMIT)).map((i) => (
        <li key={`page-${i}`} className={page === i ? 'active' : ''}>
          <NextLink href={`/${i === 1 ? '' : i}`}>{i}</NextLink>
        </li>
      ))}
    </Pages>
  </div>
)

const Pages = styled.ul`
  display: flex;
  gap: 0px;

  li {
    display: block;
    padding: 0px 4px;
  }

  li.active a {
    opacity: 0.5;
  }
`
