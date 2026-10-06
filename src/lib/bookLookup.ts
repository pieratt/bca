import {BOOK_GENRES, type BookGenre} from '@/data/genres'
import slugify from 'slugify'

export type LookedUpCover = {
  url: string
  bytes?: Uint8Array
  type: string
  width?: number
  height?: number
}

export type LookedUpBook = {
  title: string
  slug: string
  isbn?: string
  publisher?: string
  year?: number
  genre?: BookGenre
  authors: string[]
  notes: string
  sources: string[]
  cover?: LookedUpCover
}

type ParsedQuery = {
  raw: string
  url?: string
  asin?: string
  isbn10?: string
  isbn13?: string
  title?: string
  coverUrl?: string
}

type AmazonListing = {
  title?: string
  isbn10?: string
  isbn13?: string
  coverUrl?: string
}

type OpenLibraryEdition = {
  title?: string
  subtitle?: string
  publishers?: string[]
  publish_date?: string
  isbn_10?: string[]
  isbn_13?: string[]
  covers?: number[]
  works?: {key: string}[]
  authors?: {key: string}[]
  key?: string
}

type OpenLibraryWork = {
  title?: string
  subtitle?: string
  subjects?: string[]
  authors?: {author?: {key: string}; key?: string}[]
}

type OpenLibrarySearchDoc = {
  title?: string
  subtitle?: string
  author_name?: string[]
  first_publish_year?: number
  publisher?: string[]
  isbn?: string[]
  cover_i?: number
  cover_edition_key?: string
  key?: string
}

const USER_AGENT = 'BookCoverArchive/1.0 (catalog lookup; https://bookcoverarchive.com)'

const SUBJECT_GENRE: [RegExp, BookGenre][] = [
  [/memoir|autobiograph/i, 'memoir'],
  [/graphic novel|\bcomics?\b/i, 'comics'],
  [/science fiction|sci-?fi|\bfantasy\b/i, 'science fiction'],
  [/mystery|detective|crime fiction|\bthriller\b/i, 'mystery'],
  [/humour|\bhumor\b|\bcomedy\b/i, 'humor'],
  [/poetry|\bpoems?\b/i, 'poetry'],
  [/young adult|\bjuvenile\b|\bchildren/i, 'youth fiction'],
  [/graphic design|typography|art and design|\billustration\b/i, 'art and design'],
  [/reference|dictionary|encyclopedia/i, 'reference'],
  [/biography/i, 'memoir'],
  [/\bfiction\b|\bnovels?\b/i, 'fiction'],
  [/non-?fiction|\bhistory\b|\bessays?\b|\bscience\b/i, 'nonfiction'],
]

export function parseBookQuery(input: string): ParsedQuery {
  const raw = input.trim()
  const parsed: ParsedQuery = {raw}
  if (!raw) return parsed

  const urlMatch = raw.match(/https?:\/\/[^\s]+/i)
  if (urlMatch) {
    parsed.url = urlMatch[0].replace(/[),.;]+$/, '')
    const amazon = parsed.url.match(/\/(?:dp|gp\/product|gp\/aw\/d|gp\/offer-listing)\/([A-Z0-9]{10})/i)
    if (amazon) parsed.asin = amazon[1].toUpperCase()
  }

  const isbn13 = raw.replace(/[-–—\s]/g, '').match(/97[89]\d{10}/)
  if (isbn13) parsed.isbn13 = isbn13[0]

  const isbn10 = raw
    .toUpperCase()
    .replace(/[-–—\s]/g, '')
    .match(/(?<![0-9X])(\d{9}[\dX])(?![0-9X])/)
  if (isbn10) parsed.isbn10 = isbn10[1]

  if (parsed.asin && isIsbn10(parsed.asin)) parsed.isbn10 = parsed.asin
  if (parsed.isbn10 && !parsed.isbn13) parsed.isbn13 = isbn10to13(parsed.isbn10)
  if (parsed.isbn13 && !parsed.isbn10) {
    const asIsbn10 = isbn13to10(parsed.isbn13)
    if (asIsbn10) parsed.isbn10 = asIsbn10
  }
  if (parsed.isbn10 && !parsed.asin) parsed.asin = parsed.isbn10

  parsed.title = titleFromAmazonUrl(parsed.url) || undefined
  if (!parsed.title && !parsed.isbn10 && !parsed.isbn13 && !parsed.asin) {
    parsed.title = raw
      .replace(/https?:\/\/[^\s]+/gi, '')
      .replace(/\bISBN[-:\s]*/gi, '')
      .trim() || undefined
  }

  return parsed
}

export async function lookupBookMetadata(input: string): Promise<LookedUpBook | null> {
  const parsed = parseBookQuery(input)
  if (!parsed.raw) return null

  if (parsed.url && isShortAmazon(parsed.url)) {
    const resolved = await resolveRedirect(parsed.url)
    if (resolved && resolved !== parsed.url) {
      const next = parseBookQuery(resolved)
      parsed.url = next.url ?? resolved
      parsed.asin = parsed.asin ?? next.asin
      parsed.isbn10 = parsed.isbn10 ?? next.isbn10
      parsed.isbn13 = parsed.isbn13 ?? next.isbn13
      parsed.title = parsed.title ?? next.title
      if (parsed.isbn10 && !parsed.isbn13) parsed.isbn13 = isbn10to13(parsed.isbn10)
      if (parsed.isbn10 && !parsed.asin) parsed.asin = parsed.isbn10
    }
  }

  if (parsed.asin && isAmazonUrl(parsed.url)) {
    const listing = await fetchAmazonListing(parsed.asin)
    if (listing) {
      parsed.title = listing.title || parsed.title
      if (listing.isbn10) {
        parsed.isbn10 = listing.isbn10
        parsed.isbn13 = isbn10to13(listing.isbn10)
      } else if (listing.isbn13) {
        parsed.isbn13 = listing.isbn13
        parsed.isbn10 = isbn13to10(listing.isbn13) ?? parsed.isbn10
      }
      parsed.coverUrl = listing.coverUrl
    }
  }

  const sources: string[] = []
  let edition = await fetchOpenLibraryEdition(parsed.isbn13 ?? parsed.isbn10)
  const search = await fetchOpenLibrarySearch(parsed)
  if (!edition && search?.cover_edition_key) {
    edition = await fetchJson<OpenLibraryEdition>(`https://openlibrary.org/books/${search.cover_edition_key}.json`)
  }
  const workKey = edition?.works?.[0]?.key ?? search?.key
  const work = workKey ? await fetchJson<OpenLibraryWork>(`https://openlibrary.org${workKey}.json`) : null

  if (edition) sources.push('Open Library edition')
  if (work) sources.push('Open Library work')
  if (search && !edition) sources.push('Open Library search')

  const title = buildTitle(
    edition?.title || parsed.title || search?.title || work?.title,
    edition?.subtitle || search?.subtitle || work?.subtitle
  )
  const authors = unique(
    search?.author_name ?? (await resolveAuthorNames(work?.authors, edition?.authors))
  )
  const publisher = edition?.publishers?.[0] || search?.publisher?.[0]
  const year = yearFrom(edition?.publish_date) ?? search?.first_publish_year
  const isbn = edition?.isbn_13?.[0] || parsed.isbn13 || edition?.isbn_10?.[0] || parsed.isbn10
  const genre = guessGenre(work?.subjects ?? [])
  const asin = parsed.asin || (isbn && isIsbn10(isbn) ? isbn : isbn ? isbn13to10(isbn) : undefined)

  if (!title && !isbn && !parsed.asin) {
    const google = await fetchGoogleBooks(parsed)
    if (google) return google
    return null
  }

  if (!title) {
    const google = await fetchGoogleBooks(parsed)
    if (google) return google
    return null
  }

  const cover = await fetchBestCover({
    asin,
    isbn: isbn ?? parsed.isbn13 ?? parsed.isbn10,
    coverId: edition?.covers?.[0] ?? search?.cover_i,
    extra: parsed.coverUrl,
  })
  if (cover?.url.includes('amazon')) sources.push('Amazon catalog image')
  if (cover?.url.includes('openlibrary')) sources.push('Open Library cover')

  const notes = [
    parsed.url ? `Source link: ${parsed.url}` : null,
    isbn ? `ISBN ${isbn}` : parsed.asin ? `ASIN ${parsed.asin}` : null,
    sources.length ? `Filled from ${sources.join(', ')}.` : null,
    'Designer, illustrator, art director, and photographer were not in the catalog — add them if you have them.',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    title,
    slug: slugify(title, {lower: true, strict: true}),
    isbn,
    publisher,
    year,
    genre,
    authors,
    notes,
    sources,
    cover,
  }
}

async function fetchOpenLibraryEdition(isbn?: string) {
  if (!isbn) return null
  const edition = await fetchJson<OpenLibraryEdition>(`https://openlibrary.org/isbn/${isbn}.json`)
  return edition?.title ? edition : null
}

async function fetchOpenLibrarySearch(parsed: ParsedQuery) {
  const isbn = parsed.isbn13 ?? parsed.isbn10
  if (isbn) {
    const data = await fetchJson<{docs?: OpenLibrarySearchDoc[]}>(
      `https://openlibrary.org/search.json?isbn=${encodeURIComponent(isbn)}`
    )
    if (data?.docs?.[0]) return data.docs[0]
  }
  const title = parsed.title
  if (!title) return null
  const data = await fetchJson<{docs?: OpenLibrarySearchDoc[]}>(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(title)}&limit=5`
  )
  return data?.docs?.[0] ?? null
}

async function resolveAuthorNames(
  workAuthors?: OpenLibraryWork['authors'],
  editionAuthors?: OpenLibraryEdition['authors']
) {
  const keys = unique(
    [
      ...(workAuthors ?? []).map((entry) => entry.author?.key || entry.key),
      ...(editionAuthors ?? []).map((entry) => entry.key),
    ].filter((key): key is string => Boolean(key))
  )
  const names: string[] = []
  for (const key of keys.slice(0, 8)) {
    const author = await fetchJson<{name?: string}>(`https://openlibrary.org${key}.json`)
    if (author?.name) names.push(author.name)
  }
  return names
}

async function fetchGoogleBooks(parsed: ParsedQuery): Promise<LookedUpBook | null> {
  const isbn = parsed.isbn13 ?? parsed.isbn10
  const q = isbn ? `isbn:${isbn}` : parsed.title ? parsed.title : ''
  if (!q) return null
  const data = await fetchJson<{
    items?: {
      volumeInfo?: {
        title?: string
        subtitle?: string
        authors?: string[]
        publisher?: string
        publishedDate?: string
        industryIdentifiers?: {type: string; identifier: string}[]
        categories?: string[]
        imageLinks?: {thumbnail?: string; smallThumbnail?: string}
      }
    }[]
  }>(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`)
  const info = data?.items?.[0]?.volumeInfo
  if (!info?.title) return null

  const title = buildTitle(info.title, info.subtitle)
  const foundIsbn =
    info.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier ||
    info.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier ||
    isbn
  const cover = await fetchBestCover({
    asin: parsed.asin || (foundIsbn && isIsbn10(foundIsbn) ? foundIsbn : foundIsbn ? isbn13to10(foundIsbn) : undefined),
    isbn: foundIsbn,
    extra: parsed.coverUrl,
  })

  return {
    title,
    slug: slugify(title, {lower: true, strict: true}),
    isbn: foundIsbn,
    publisher: info.publisher,
    year: yearFrom(info.publishedDate),
    genre: guessGenre(info.categories ?? []),
    authors: info.authors ?? [],
    notes: [
      parsed.url ? `Source link: ${parsed.url}` : null,
      foundIsbn ? `ISBN ${foundIsbn}` : null,
      'Filled from Google Books.',
      'Designer, illustrator, art director, and photographer were not in the catalog — add them if you have them.',
    ]
      .filter(Boolean)
      .join('\n'),
    sources: ['Google Books'],
    cover,
  }
}

async function fetchBestCover(opts: {asin?: string; isbn?: string; coverId?: number; extra?: string}) {
  const urls: string[] = []
  if (opts.extra && !isCompositeAmazonImage(opts.extra)) {
    urls.push(upgradeAmazonImage(opts.extra), opts.extra)
  }
  const printAsin = opts.isbn && isIsbn10(opts.isbn) ? opts.isbn : opts.isbn ? isbn13to10(opts.isbn) : undefined
  for (const id of unique([printAsin, opts.asin])) {
    if (!id || !/^[A-Z0-9]{10}$/i.test(id)) continue
    urls.push(`https://images-na.ssl-images-amazon.com/images/P/${id}.01.MAIN._SCRMZZZZZZ_.jpg`)
    urls.push(`https://images-na.ssl-images-amazon.com/images/P/${id}.01.LZZZZZZZ.jpg`)
    urls.push(`https://m.media-amazon.com/images/P/${id}.01.MAIN._SCRMZZZZZZ_.jpg`)
  }
  if (opts.coverId) urls.push(`https://covers.openlibrary.org/b/id/${opts.coverId}-L.jpg`)
  if (opts.isbn) urls.push(`https://covers.openlibrary.org/b/isbn/${opts.isbn}-L.jpg`)

  for (const url of urls) {
    const cover = await downloadCover(url)
    if (cover) return cover
  }
  return undefined
}

async function downloadCover(url: string): Promise<LookedUpCover | undefined> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {Accept: 'image/*', 'User-Agent': USER_AGENT},
      signal: AbortSignal.timeout(12000),
      cache: 'no-store',
    })
    if (!res.ok) return undefined
    const type = res.headers.get('content-type') || 'image/jpeg'
    if (!type.startsWith('image/') || type.includes('gif')) return undefined
    const bytes = new Uint8Array(await res.arrayBuffer())
    if (bytes.byteLength < 8000) return undefined
    const size = imageSize(bytes)
    return {url, bytes, type, width: size?.width, height: size?.height}
  } catch {
    return undefined
  }
}

async function resolveRedirect(url: string) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {'User-Agent': USER_AGENT},
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })
    return res.url || url
  } catch {
    return url
  }
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {Accept: 'application/json', 'User-Agent': USER_AGENT},
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

function buildTitle(title?: string, subtitle?: string) {
  const head = (title ?? '').trim()
  const tail = cleanSubtitle(subtitle)
  if (!head) return tail
  if (!tail) return head
  if (head.toLowerCase().includes(tail.toLowerCase().slice(0, 16))) return head
  return `${head}: ${tail}`
}

function cleanSubtitle(value?: string) {
  return (value ?? '').replace(/\s*;\s*/g, ', ').trim()
}

function yearFrom(value?: string) {
  if (!value) return undefined
  const match = value.match(/\b(1[6-9]\d{2}|20\d{2}|21\d{2})\b/)
  return match ? Number(match[1]) : undefined
}

function guessGenre(subjects: string[]): BookGenre | undefined {
  const haystack = subjects.join(' | ')
  for (const [pattern, genre] of SUBJECT_GENRE) {
    if (pattern.test(haystack) && BOOK_GENRES.includes(genre)) return genre
  }
  return undefined
}

function isShortAmazon(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'amzn.to' || host === 'a.co' || host === 'amzn.com'
  } catch {
    return false
  }
}

function isAmazonUrl(url?: string) {
  if (!url) return false
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'amazon.com' || host.endsWith('.amazon.com') || isShortAmazon(url)
  } catch {
    return false
  }
}

function titleFromAmazonUrl(url?: string) {
  if (!url) return undefined
  try {
    const slug = decodeURIComponent(new URL(url).pathname).match(/\/([^/]+)\/dp\//i)?.[1]
    if (!slug || /^(gp|dp|product)$/i.test(slug)) return undefined
    return slug.replace(/-ebook$/i, '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
  } catch {
    return undefined
  }
}

function cleanAmazonTitle(value?: string) {
  return decodeHtml(value)
    .replace(/\s*[:\-–—]\s*(Kindle Edition|Shortlisted for.*)$/i, '')
    .replace(/\s+Amazon\.com.*$/i, '')
    .trim()
}

function decodeHtml(value?: string) {
  return (value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function upgradeAmazonImage(url: string) {
  return url
    .replace(/\._(?:AC_)?[A-Z]{2}\d+(?:,\d+)?_/g, '')
    .replace(/\._S[XY]\d+_/g, '')
    .replace(/\._SL\d+_/g, '')
}

function isCompositeAmazonImage(url: string) {
  return /_CLa/i.test(url) || url.includes('%7C') || url.includes('|')
}

async function fetchAmazonListing(asin: string): Promise<AmazonListing | null> {
  const html = await fetchText(`https://www.amazon.com/dp/${asin}`, {
    Accept: 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  })
  if (!html || html.length < 400) return null

  const title = cleanAmazonTitle(
    html.match(/id="productTitle"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ||
      html.match(/property="og:title"\s+content="([^"]+)"/i)?.[1] ||
      html.match(/<title>([^<]+)<\/title>/i)?.[1]
  )

  const isbn10 = unique(
    [...html.matchAll(/\/dp\/(\d{9}[\dX])\b/gi)].map((match) => match[1].toUpperCase())
  ).find((value) => isIsbn10(value))

  const isbn13raw =
    html.match(/ISBN-13[\s\S]{0,160}?(97[89][\d-]{10,17})/i)?.[1] ||
    html.match(/\b(97[89]-\d{10})\b/)?.[1]
  const isbn13 = isbn13raw?.replace(/-/g, '')

  let coverUrl: string | undefined
  const dynamic = html.match(/data-a-dynamic-image="([^"]+)"/i)?.[1]
  if (dynamic) {
    try {
      const parsed = JSON.parse(dynamic.replace(/&quot;/g, '"')) as Record<string, number[]>
      coverUrl = Object.keys(parsed).find((url) => !isCompositeAmazonImage(url))
    } catch {
      coverUrl = undefined
    }
  }
  coverUrl =
    coverUrl ||
    html.match(/data-old-hires="([^"]+)"/i)?.[1] ||
    html.match(/property="og:image"\s+content="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/i)?.[1]
  if (coverUrl && isCompositeAmazonImage(coverUrl)) coverUrl = undefined

  if (!title && !isbn10 && !isbn13 && !coverUrl) return null
  return {
    title: title || undefined,
    isbn10,
    isbn13: isbn13 && /^97[89]\d{10}$/.test(isbn13) ? isbn13 : undefined,
    coverUrl: coverUrl ? decodeHtml(coverUrl) : undefined,
  }
}

async function fetchText(url: string, headers?: Record<string, string>) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {Accept: 'text/html', 'User-Agent': USER_AGENT, ...headers},
      signal: AbortSignal.timeout(12000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

function isIsbn10(value: string) {
  return /^\d{9}[\dX]$/i.test(value)
}

function isbn10to13(isbn10: string) {
  const core = `978${isbn10.slice(0, 9)}`
  let sum = 0
  for (let i = 0; i < 12; i += 1) sum += Number(core[i]) * (i % 2 === 0 ? 1 : 3)
  return `${core}${(10 - (sum % 10)) % 10}`
}

function isbn13to10(isbn13: string) {
  if (!isbn13.startsWith('978')) return undefined
  const core = isbn13.slice(3, 12)
  let sum = 0
  for (let i = 0; i < 9; i += 1) sum += Number(core[i]) * (10 - i)
  const rem = (11 - (sum % 11)) % 11
  return `${core}${rem === 10 ? 'X' : rem}`
}

function unique(values: Array<string | undefined>) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const next = value?.trim()
    if (!next) continue
    const key = next.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(next)
  }
  return out
}

function imageSize(bytes: Uint8Array) {
  if (bytes.length >= 24 && bytes[0] === 0x89 && bytes[1] === 0x50) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    return {width: view.getUint32(16), height: view.getUint32(20)}
  }
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return undefined
  let i = 2
  while (i < bytes.length - 8) {
    if (bytes[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = bytes[i + 1]
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return {height: (bytes[i + 5] << 8) | bytes[i + 6], width: (bytes[i + 7] << 8) | bytes[i + 8]}
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    const length = (bytes[i + 2] << 8) | bytes[i + 3]
    if (length < 2) break
    i += 2 + length
  }
  return undefined
}
