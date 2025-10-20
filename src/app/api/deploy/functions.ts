import {NextRequest, NextResponse} from 'next/server'

export const initializer = (token?: string, appId?: string) => async () => {
  if (!token || !appId) {
    throw new Error('missing required token and appId')
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    const body = JSON.stringify({
      force_build: true,
    })

    const response = await fetch(`https://api.digitalocean.com/v2/apps/${appId}/deployments`, {
      method: 'POST',
      body,
      headers,
    })

    return NextResponse.json({...response, status: 200})
  } catch (error) {
    return NextResponse.json({message: error}, {status: 402})
  }
}

export const checker = (token?: string, appId?: string) => async (request: NextRequest) => {
  if (!token || !appId) {
    throw new Error('missing required token and appId')
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    const parameters = request.nextUrl.searchParams
    const deploymentId = parameters.get('id')
    if (!deploymentId) {
      const response = await fetch(
        `https://api.digitalocean.com/v2/apps/${appId}/deployments?page=1&per_page=1`,
        {
          method: 'GET',
          headers,
        }
      )
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const response = await fetch(
        `https://api.digitalocean.com/v2/apps/${appId}/deployments/${deploymentId}`,
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
