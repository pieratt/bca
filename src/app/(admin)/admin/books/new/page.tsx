import {BookForm} from '../../BookForm'

export default function NewBookPage() {
  return (
    <div className="admin-wrap">
      <h1>New cover</h1>
      <p className="admin-note">Upload a cover file, or paste a URL. Files stay local here and go to Vercel Blob in production.</p>
      <BookForm />
    </div>
  )
}
