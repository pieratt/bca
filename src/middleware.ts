import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const COOKIE = 'bca_admin'

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  const {pathname} = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  if (!password) {
    if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  if (request.cookies.get(COOKIE)?.value === password) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin/:path*'],
}
