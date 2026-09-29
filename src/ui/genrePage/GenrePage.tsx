import type {LocalBook} from '@/data/archive'
import {CoverGrid} from '../bookIndex/CoverGrid'

const GENRE_TITLES: Record<string, string> = {
  'science fiction': 'Sci-Fi',
  'science-fiction': 'Sci-Fi',
}

const displayName = (name: string) => {
  const key = name.trim().toLowerCase()
  if (GENRE_TITLES[key]) return GENRE_TITLES[key]
  return name.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export const GenrePage = ({name, books}: {name: string; books: LocalBook[]}) => (
  <CoverGrid books={books} heading={displayName(name)} />
)
