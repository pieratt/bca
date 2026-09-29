interface IImageKitLoader {
  src: string
  width: number
  quality?: number
}

export const cdnUrl = (src: string): URL => new URL(src)

export const imageKitLoader = ({src, width, quality}: IImageKitLoader) => {
  if (src.startsWith('/') || src.startsWith('data:')) return src

  if (src.includes('blob.vercel-storage.com') || src.includes('public.blob.vercel-storage.com')) {
    return src
  }

  const fixedFilename = cdnUrl(src)
  const transforms = [`w=${width}`, 'f=webp']
  if (quality) transforms.push(`q=${quality}`)
  return `${fixedFilename.toString()}?${transforms.join('&')}`
}

export default imageKitLoader
