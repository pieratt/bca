import Link from 'next/link'
import {prisma} from '@/lib/prisma'

export default async function AdminHome() {
  const books = await prisma.book.findMany({
    include: {
      images: {orderBy: {position: 'asc'}, take: 1},
      genre: true,
      credits: {include: {person: true}},
    },
    orderBy: [{datePublished: 'desc'}, {createdAt: 'desc'}],
  })

  return (
    <div className="admin-wrap">
      <div className="admin-head">
        <div>
          <h1>Covers</h1>
          <p className="admin-note">{books.length} books in the local Prisma catalog.</p>
        </div>
        <Link className="admin-button" href="/admin/books/new">
          New cover
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Designers</th>
            <th>Genre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                {book.images[0] ? (
                  <img className="admin-cover" src={book.images[0].url} alt="" />
                ) : null}
              </td>
              <td>
                <Link href={`/admin/books/${book.id}`}>{book.title}</Link>
              </td>
              <td>
                {book.credits
                  .filter((credit) => credit.role === 'DESIGNER')
                  .map((credit) => credit.person.name)
                  .join(', ')}
              </td>
              <td>{book.genre?.name}</td>
              <td>
                <Link href={`/book/${book.slug}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
