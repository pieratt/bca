import {prisma} from '@/lib/prisma'
import {savePerson} from '../actions'

export default async function PeopleAdmin() {
  const people = await prisma.person.findMany({
    orderBy: {name: 'asc'},
    include: {_count: {select: {credits: true}}},
  })

  return (
    <div className="admin-wrap">
      <div className="admin-head">
        <div>
          <h1>People</h1>
          <p className="admin-note">Authors, designers, illustrators, art directors, photographers.</p>
        </div>
      </div>

      <form className="admin-form" action={savePerson}>
        <div className="row">
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Homepage
            <input name="homepage" type="url" />
          </label>
        </div>
        <div className="admin-actions">
          <button type="submit">Add person</button>
        </div>
      </form>

      <table className="admin-table" style={{marginTop: 32}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.slug}</td>
              <td>{person._count.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
