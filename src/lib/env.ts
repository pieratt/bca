export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-04'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ps8jihhe'

export const token = process.env.SANITY_SECRET_TOKEN

export const imagekit = process.env.NEXT_PUBLIC_IMAGEKIT_ID || ''

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3333'

export const digitalOceanAppId = process.env.DIGITALOCEAN_APP_ID
export const digitalOceanToken = process.env.DIGITALOCEAN_TOKEN

export const adminPassword = process.env.ADMIN_PASSWORD || ''

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}
