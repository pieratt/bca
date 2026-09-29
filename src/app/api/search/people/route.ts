import {NextRequest, NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const keywords = request.nextUrl.searchParams.get('keywords')
  if (!keywords) {
    return NextResponse.json('Missing keywords.', {status: 400})
  }
  const results = await prisma.person.findMany({
    where: {name: {contains: keywords}},
    select: {slug: true, name: true},
    take: 20,
  })
  return NextResponse.json(results)
}
