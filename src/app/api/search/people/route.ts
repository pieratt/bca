import people from '@/generated/people.json'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
  const parameters = request.nextUrl.searchParams
  const keywords = parameters.get('keywords')
  if (!keywords) {
    return NextResponse.json('Missing keywords.', {status: 402})
  }
  const results = people.filter((person) => person.name.includes(keywords))
  return NextResponse.json(results, {status: 200})
}
