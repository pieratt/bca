import Image from 'next/image'
import {COVER_SIZES, coverSrc, type CoverSize} from '@/lib/coverSrc'

export const CoverImage = ({
  src,
  alt,
  width,
  height,
  size,
  priority,
  className,
}: {
  src: string
  alt: string
  width?: number | null
  height?: number | null
  size: CoverSize
  priority?: boolean
  className?: string
}) => {
  if (!src) return null
  return (
    <Image
      src={coverSrc(src)}
      alt={alt}
      width={width && width > 0 ? width : 1000}
      height={height && height > 0 ? height : 1500}
      sizes={COVER_SIZES[size]}
      quality={size === 'page' || size === 'featured' ? 88 : 70}
      priority={priority}
      className={className}
    />
  )
}
