import {notFound} from 'next/navigation'
import {CreditRole} from '@prisma/client'
import {prisma} from '@/lib/prisma'
import {BookForm} from '../../BookForm'

const namesFor = (
  credits: {role: CreditRole; person: {name: string}; position: number}[],
  role: CreditRole
) =>
  credits
    .filter((credit) => credit.role === role)
    .sort((a, b) => a.position - b.position)
    .map((credit) => credit.person.name)
    .join('\n')

export default async function EditBookPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const book = await prisma.book.findUnique({
    where: {id},
    include: {
      genre: true,
      images: {orderBy: {position: 'asc'}},
      credits: {include: {person: true}},
    },
  })
  if (!book) notFound()

  return (
    <div className="admin-wrap">
      <h1>Edit cover</h1>
      <p className="admin-note">
        Local Prisma record. A Sanity import can fill these fields later without changing this form.
      </p>
      <BookForm
        book={{
          id: book.id,
          title: book.title,
          slug: book.slug,
          cover: book.images[0]?.url,
          width: book.images[0]?.width,
          height: book.images[0]?.height,
          publisher: book.publisher,
          isbn: book.isbn,
          genre: book.genre?.name,
          year: book.year,
          notes: book.notes,
          authors: namesFor(book.credits, CreditRole.AUTHOR),
          designers: namesFor(book.credits, CreditRole.DESIGNER),
          illustrators: namesFor(book.credits, CreditRole.ILLUSTRATOR),
          artDirectors: namesFor(book.credits, CreditRole.ART_DIRECTOR),
          photographers: namesFor(book.credits, CreditRole.PHOTOGRAPHER),
        }}
      />
    </div>
  )
}
