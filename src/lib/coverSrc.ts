export type CoverSize = 'thumb' | 'featured' | 'page' | 'hover'

export const COVER_SIZES: Record<CoverSize, string> = {
  thumb: '(min-width: 744px) 180px, 33vw',
  featured: '(min-width: 744px) 720px, 66vw',
  page: '(min-width: 744px) 640px, 100vw',
  hover: '160px',
}

export const coverSrc = (src: string) => {
  if (!src || src.startsWith('/') || src.startsWith('data:')) return src
  try {
    const url = new URL(src)
    url.search = ''
    return url.toString()
  } catch {
    return src
  }
}
