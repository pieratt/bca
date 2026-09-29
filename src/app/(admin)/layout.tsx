import type {Metadata} from 'next'
import '@/theme/admin.scss'

export const metadata: Metadata = {
  title: 'BCA Admin',
}

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <header className="admin-bar">
          <a href="/admin">Book Cover Archive / Admin</a>
          <nav>
            <a href="/admin">Covers</a>
            <a href="/admin/people">People</a>
            <a href="/admin/books/new">New cover</a>
            <a href="/">View site</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
