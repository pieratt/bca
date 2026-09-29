import {BookForm} from '../../BookForm'

export default function NewBookPage() {
  return (
    <div className="admin-wrap">
      <h1>New cover</h1>
      <p className="admin-note">
        Paste an Amazon link, ISBN, or title to fill the form. Check credits, then create. You can still upload a
        better scan afterward.
      </p>
      <BookForm />
    </div>
  )
}
