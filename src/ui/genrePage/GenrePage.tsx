import type {LocalBook} from '@/data/archive'
import {CoverGrid} from '../bookIndex/CoverGrid'

const displayName = (name: string) =>
  name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

export const GenrePage = ({name, books}: {name: string; books: LocalBook[]}) => (
  <CoverGrid books={books} heading={displayName(name)} />
)
