import {NextResponse} from 'next/server'
import {digitalOceanAppId, digitalOceanToken} from '@/lib'

// This is necessary because CORS cannot ping DO from browser.

export async function POST() {
  try {
    const headers = {
      Authorization: `Bearer ${digitalOceanToken}`,
      'Content-Type': 'application/json',
    }

    const body = JSON.stringify({
      force_build: true,
    })

    const response = await fetch(
      `https://api.digitalocean.com/v2/apps/${digitalOceanAppId}/deployments`,
      {
        method: 'POST',
        body,
        headers,
      }
    )

    return NextResponse.json({...response, status: 200})
  } catch (error) {
    return NextResponse.json({message: error}, {status: 402})
  }
}
