import {imagekit, dataset, projectId} from '@/lib'

interface IImageKitLoader {
  src: string
  width: number
  quality?: number
}

export const cdnUrl = (src: string, withTransforms: boolean = false): URL => {
  return new URL(src)
  //   const isImage = src.includes('images')
  //   const sourceURL = isImage
  //     ? `https://cdn.sanity.io/images/${projectId}/${dataset}`
  //     : `https://cdn.sanity.io/files/${projectId}/${dataset}`
  //   const newUrl =
  //     isImage && withTransforms
  //       ? `https://ik.imagekit.io/${imagekit}/__TRANSFORMS__`
  //       : isImage
  //       ? `https://ik.imagekit.io/${imagekit}`
  //       : `https://ik.imagekit.io/${imagekit}/files`
  //   return new URL(src.replace(sourceURL, newUrl))
}

export const imageKitLoader = ({src, width, quality}: IImageKitLoader) => {
  let fixedFilename = cdnUrl(src, true) || src

  // const seoFilename = fixedFilename.searchParams.get('dl')
  //   if (!!seoFilename) {
  //     fixedFilename.searchParams.delete('dl')
  //     const [filename, _] = seoFilename.split('.')
  //     fixedFilename = new URL(`${fixedFilename}/${filename}.webp`)
  //   }

  const transforms = [`w=${width}`, 'f=webp']
  if (quality) {
    transforms.push(`q=${quality}`)
  }

  return fixedFilename.toString() + `?${transforms.join('&')}`
}

export default imageKitLoader
