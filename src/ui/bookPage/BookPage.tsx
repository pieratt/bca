'use client'

import {styled} from '@linaria/react'
import {People} from './People'
import NextImage from 'next/image'
import {PortableText} from 'next-sanity'

export const BookPage = ({book}: {book: Sanity.BookQueryResult}) => {
  console.log('book', book)
  return !book ? null : (
    <Main role="main">
      <section>
        <article id="post-5270" className="book type-book ">
          <a href={`/book/${book.slug.current}`} className="book_large">
            {book.images[0].asset?.url && (
              <Image
                src={book.images[0].asset.url}
                alt={`cover of ${book.title}`}
                width={book.images?.[0]?.asset?.metadata?.dimensions?.width}
                height={book.images?.[0]?.asset?.metadata?.dimensions?.height}
                sizes="(min-width:744) 50vw, 100vw"
              />
            )}
          </a>

          <div className="book_info">
            <div className="cell">
              <div className="subheader">Book Info:</div>

              <h1>{book.title}</h1>

              <People label="Author" people={book.authors} />

              {book.isbn && <h2>ISBN: {book.isbn}</h2>}

              {!!book.genre && <Genre>Genre: {book.genre}</Genre>}

              {book.publisher && <h2>Publisher: {book.publisher}</h2>}
            </div>

            <div className="cell design_info">
              <div className="subheader">Design Info:</div>

              <People label="Designer" people={book.designers} />

              <People label="Art Director" people={book.artDirectors} />

              <People label="Illustrator" people={book.illustrators} />

              <People label="Photographers" people={book.photographers} />
            </div>

            {book.notes && (
              <div className="cell copy">
                <PortableText value={book.notes} />
              </div>
            )}
          </div>
        </article>
      </section>
    </Main>
  )
}

const Main = styled.main`
  @media only screen and (min-width: 768px) {
    article {
      display: flex;
      margin-bottom: 25px;
    }
  }

  h1 {
    border-bottom: 1px dashed rgb(200, 200, 200);
    margin-bottom: 25px;
    font-size: 4em;
    line-height: 1.05em;
    padding-bottom: 0.25em;
    font-family: 'Helvetica-neue', helvetica, arial, sans-serif;
    font-weight: 700;
    color: #2b2b2b;
  }

  @media only screen and (min-width: 768px) {
    h1 {
      font-size: 6em;
    }
  }
`

const Image = styled(NextImage)`
  height: auto;
`

const Genre = styled.h2`
  text-transform: capitalize;
`
