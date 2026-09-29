import {NextResponse} from 'next/server'

export async function GET() {
  return NextResponse.json({error: 'Draft mode is not enabled'}, {status: 404})
}
