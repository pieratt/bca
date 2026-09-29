'use client'

import {useState, useTransition} from 'react'
import {lookupBook, type BookLookupDraft} from './actions'

const FIELDS = ['title', 'slug', 'cover', 'width', 'height', 'publisher', 'isbn', 'genre', 'year', 'authors', 'notes'] as const

function applyDraft(draft: BookLookupDraft) {
  const form = document.getElementById('book-form')
  if (!(form instanceof HTMLFormElement)) return

  const values: Record<(typeof FIELDS)[number], string | number | undefined> = {
    title: draft.title,
    slug: draft.slug,
    cover: draft.cover,
    width: draft.width,
    height: draft.height,
    publisher: draft.publisher,
    isbn: draft.isbn,
    genre: draft.genre,
    year: draft.year,
    authors: draft.authors,
    notes: draft.notes,
  }

  for (const name of FIELDS) {
    const value = values[name]
    if (value == null || value === '') continue
    const field = form.elements.namedItem(name)
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    ) {
      field.value = String(value)
    }
  }
}

export function LookupBar() {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [preview, setPreview] = useState('')
  const [pending, start] = useTransition()

  return (
    <div className="admin-lookup">
      <form
        className="admin-lookup-form"
        onSubmit={(event) => {
          event.preventDefault()
          setError('')
          setStatus('')
          start(async () => {
            const result = await lookupBook(query)
            if (!result.ok) {
              setPreview('')
              setError(result.error)
              return
            }
            applyDraft(result.draft)
            setPreview(result.draft.cover)
            setStatus(
              result.draft.sources.length
                ? `Filled ${result.draft.title} from ${result.draft.sources.join(', ')}.`
                : `Filled ${result.draft.title}.`
            )
          })
        }}
      >
        <label>
          Auto-fill from a link
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Amazon URL, ISBN, or title"
            autoComplete="off"
          />
        </label>
        <button type="submit" disabled={pending}>
          {pending ? 'Looking up…' : 'Look up'}
        </button>
      </form>
      {preview ? <img className="admin-lookup-preview" src={preview} alt="Looked-up cover" /> : null}
      {status ? <p className="admin-lookup-status">{status}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  )
}
