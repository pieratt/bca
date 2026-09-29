import {writeFileSync} from 'node:fs'

const BASE = 'https://bookcoverarchive.com'

const decode = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/<!--\s*-->/g, '')
    .trim()

const peopleFrom = (html, label) => {
  const block = html.match(new RegExp(`>${label}[\\s\\S]*?</h2>`))
  if (!block) return []
  return [...block[0].matchAll(/href="\/person\/([^"]+)"[^>]*>([^<]+)</g)].map((match) => ({
    slug: match[1],
    name: decode(match[2]),
  }))
}

const extractBook = (html, slug) => {
  const title = decode(html.match(/<div class="cell">[\s\S]*?<h1>([^<]+)<\/h1>/)?.[1] || '')
  const cover = html.match(/cdn\.sanity\.io\/images\/[^"?]+/)?.[0]
  const size = html.match(/width="(\d+)" height="(\d+)"/)
  const genre = decode(html.match(/Genre:\s*(?:<!-- -->)?([^<]+)/)?.[1] || '').replace(/^undefined$/i, '')
  const year = Number(html.match(/datePublished\\?":\\?"(\d{4})/)?.[1])
  if (!title || !cover) return null
  return {
    slug,
    title,
    cover: `https://${cover}`,
    width: Number(size?.[1] || 0),
    height: Number(size?.[2] || 0),
    authors: peopleFrom(html, 'Author'),
    designers: peopleFrom(html, 'Designer'),
    illustrators: peopleFrom(html, 'Illustrator'),
    photographers: peopleFrom(html, 'Photographers?'),
    publisher: decode(html.match(/Publisher:\s*(?:<!-- -->)?([^<]+)/)?.[1] || ''),
    isbn: decode(html.match(/ISBN:\s*(?:<!-- -->)?([^<]+)/)?.[1] || ''),
    genre,
    year: Number.isFinite(year) ? year : null,
  }
}

const slugsFrom = (html) => [...new Set([...html.matchAll(/href="\/book\/([a-z0-9-]+)"/g)].map((m) => m[1]))]

const fetchText = async (url) => {
  const res = await fetch(url, {headers: {accept: 'text/html'}})
  if (!res.ok) throw new Error(`${url} ${res.status}`)
  return res.text()
}

const home = await fetchText(BASE)
const slugs = slugsFrom(home).slice(0, 72)
const books = []

for (const slug of slugs) {
  try {
    const book = extractBook(await fetchText(`${BASE}/book/${slug}`), slug)
    if (book) books.push(book)
    process.stdout.write(`${books.length}/${slugs.length} ${slug}\n`)
  } catch (error) {
    console.error(slug, error.message)
  }
}

const peopleMap = new Map()
for (const book of books) {
  for (const person of [...book.authors, ...book.designers, ...book.illustrators, ...book.photographers]) {
    if (!peopleMap.has(person.slug)) {
      peopleMap.set(person.slug, {slug: person.slug, name: person.name, bookSlugs: []})
    }
    const entry = peopleMap.get(person.slug)
    if (!entry.bookSlugs.includes(book.slug)) entry.bookSlugs.push(book.slug)
  }
}

writeFileSync(new URL('../src/data/archive.json', import.meta.url), `${JSON.stringify({books, people: [...peopleMap.values()]}, null, 2)}\n`)
console.log(
  JSON.stringify(
    {
      books: books.length,
      people: peopleMap.size,
      designers: new Set(books.flatMap((b) => b.designers.map((p) => p.slug))).size,
      illustrators: new Set(books.flatMap((b) => b.illustrators.map((p) => p.slug))).size,
      photographers: new Set(books.flatMap((b) => b.photographers.map((p) => p.slug))).size,
      genres: [...new Set(books.map((b) => b.genre).filter(Boolean))],
      years: [...new Set(books.map((b) => b.year).filter(Boolean))].sort(),
    },
    null,
    2
  )
)
