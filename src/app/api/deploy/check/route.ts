import {NextRequest, NextResponse} from 'next/server'
import {digitalOceanAppId, digitalOceanToken} from '@/lib'

// This is necessary because CORS cannot ping DO from browser.

export async function GET(request: NextRequest) {
  try {
    const headers = {
      Authorization: `Bearer ${digitalOceanToken}`,
      'Content-Type': 'application/json',
    }

    const parameters = request.nextUrl.searchParams
    const deploymentId = parameters.get('id')
    if (!deploymentId) {
      const response = await fetch(
        `https://api.digitalocean.com/v2/apps/${digitalOceanAppId}/deployments?page=1&per_page=1`,
        {
          method: 'GET',
          headers,
        }
      )
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const response = await fetch(
        `https://api.digitalocean.com/v2/apps/${digitalOceanAppId}/deployments/${deploymentId}`,
        {
          method: 'GET',
          headers,
        }
      )
      const data = await response.json()
      return NextResponse.json(data)
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: error}, {status: 400})
  }
}
