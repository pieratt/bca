import {BOOK_GENRES} from '@/data/genres'
import {hideBook, saveBook} from './actions'

type BookFormValues = {
  id?: string
  title?: string
  slug?: string
  cover?: string
  width?: number | null
  height?: number | null
  publisher?: string | null
  isbn?: string | null
  genre?: string | null
  year?: number | null
  notes?: string | null
  authors?: string
  designers?: string
  illustrators?: string
  artDirectors?: string
  photographers?: string
}

export const BookForm = ({book}: {book?: BookFormValues}) => (
  <form className="admin-form" action={saveBook}>
    {book?.id ? <input type="hidden" name="id" value={book.id} /> : null}

    <label>
      Title
      <input name="title" defaultValue={book?.title} required />
    </label>

    <label>
      Slug
      <input name="slug" defaultValue={book?.slug} placeholder="generated from title if empty" />
    </label>

    <label>
      Cover file
      <input name="file" type="file" accept="image/*" />
    </label>

    <label>
      Cover URL
      <input name="cover" defaultValue={book?.cover} placeholder="upload a file or paste https://..." />
    </label>

    <div className="row">
      <label>
        Width
        <input name="width" type="number" defaultValue={book?.width ?? 1000} />
      </label>
      <label>
        Height
        <input name="height" type="number" defaultValue={book?.height ?? 1500} />
      </label>
    </div>

    <div className="row">
      <label>
        Publisher
        <input name="publisher" defaultValue={book?.publisher ?? ''} />
      </label>
      <label>
        ISBN
        <input name="isbn" defaultValue={book?.isbn ?? ''} />
      </label>
    </div>

    <div className="row">
      <label>
        Genre
        <select name="genre" defaultValue={book?.genre ?? ''}>
          <option value="">Select a genre</option>
          {BOOK_GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Year
        <input name="year" type="number" defaultValue={book?.year ?? ''} />
      </label>
    </div>

    <label>
      Authors <small>one name per line</small>
      <textarea name="authors" defaultValue={book?.authors} />
    </label>
    <label>
      Designers <small>one name per line</small>
      <textarea name="designers" defaultValue={book?.designers} />
    </label>
    <label>
      Illustrators <small>one name per line</small>
      <textarea name="illustrators" defaultValue={book?.illustrators} />
    </label>
    <label>
      Art directors <small>one name per line</small>
      <textarea name="artDirectors" defaultValue={book?.artDirectors} />
    </label>
    <label>
      Photographers <small>one name per line</small>
      <textarea name="photographers" defaultValue={book?.photographers} />
    </label>
    <label>
      Notes
      <textarea name="notes" defaultValue={book?.notes ?? ''} />
    </label>

    <div className="admin-actions">
      <button type="submit">{book?.id ? 'Save cover' : 'Create cover'}</button>
      {book?.id ? (
        <button className="ghost" formAction={hideBook} type="submit">
          Hide cover
        </button>
      ) : null}
    </div>
  </form>
)
