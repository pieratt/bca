import {styled} from '@linaria/react'
import {ModuleWrapper} from '@/ui'
import NextImage from 'next/image'

export const BannerHero = ({
  module,
  title,
  imageAsset,
}: {
  module: Sanity.Hero
  title: string
  imageAsset?: Sanity.SanityImageAsset
}) => {
  return !imageAsset ? null : (
    <ModuleWrapper>
      <Wrapper>
        <NextImage
          src={imageAsset.url!}
          alt={title}
          width={imageAsset.metadata?.dimensions?.width}
          height={imageAsset.metadata?.dimensions?.height}
          placeholder="blur"
          blurDataURL={imageAsset.metadata?.blurHash!}
        />
      </Wrapper>
    </ModuleWrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  img {
    max-width: 100%;
    height: auto;
  }
`
