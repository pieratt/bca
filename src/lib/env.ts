export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-05-19'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = process.env.SANITY_SECRET_TOKEN

export const imagekit = assertValue(
  process.env.NEXT_PUBLIC_IMAGEKIT_ID,
  'Missing environment variable: NEXT_PUBLIC_IMAGEKIT_ID'
)

export const BASE_URL = assertValue(
  process.env.NEXT_PUBLIC_SITE_URL,
  'Missing environment variable: NEXT_PUBLIC_SITE_URL'
)

export const deploymentHook = process.env.NEXT_PUBLIC_SANITY_DEPLOYMENT_HOOK

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
