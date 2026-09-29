export const BOOK_GENRES = [
  'art and design',
  'biographies and memoires',
  'comics',
  'fiction',
  'humor',
  'mystery',
  'nonfiction',
  'poetry',
  'reference',
  'science fiction',
  'uncategorized',
  'youth fiction',
] as const

export type BookGenre = (typeof BOOK_GENRES)[number]
