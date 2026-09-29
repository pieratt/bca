import {NextRequest, NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const keywords = request.nextUrl.searchParams.get('keywords')
  if (!keywords) {
    return NextResponse.json('Missing keywords.', {status: 400})
  }
  const results = await prisma.book.findMany({
    where: {title: {contains: keywords}},
    select: {slug: true, title: true},
    take: 20,
  })
  return NextResponse.json(results)
}
