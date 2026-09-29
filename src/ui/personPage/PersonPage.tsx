import type {LocalBook} from '@/data/archive'
import {CoverGrid} from '../bookIndex/CoverGrid'

export const PersonPage = ({name, books}: {name: string; books: LocalBook[]}) => (
  <CoverGrid books={books} heading={`Books that ${name} had something or other to do with`} />
)
