import {styled} from '@linaria/react'
import {TitleSmall, ModuleWrapper} from '@/ui'
import {PortableText} from '@portabletext/react'
import type {PropsWithChildren} from 'react'
import NextImage from 'next/image'

export const ImageOnSideHero = ({
  module,
  title,
  imageAsset,
  className,
}: {
  module: Sanity.Hero
  title: string
  imageAsset?: Sanity.SanityImageAsset
  className?: string
}) => {
  return !imageAsset ? null : (
    <ModuleWrapper>
      <Wrapper className={className}>
        <NextImage
          src={imageAsset.url!}
          alt={title}
          width={imageAsset.metadata?.dimensions?.width}
          height={imageAsset.metadata?.dimensions?.height}
          placeholder="blur"
          blurDataURL={imageAsset.metadata?.blurHash!}
        />
        <Copy>
          {module.subtitle && (
            <PortableText value={module.subtitle} components={subtitleCopyRenderers} />
          )}
        </Copy>
      </Wrapper>
    </ModuleWrapper>
  )
}

const subtitleCopyRenderers = {
  block: {
    normal: ({children}: PropsWithChildren) => <TitleSmall>{children}</TitleSmall>,
  },
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  &.reversed {
    flex-direction: row-reverse;
    header {
      text-align: right;
    }
  }
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--gapL);
  > * {
    flex: 1;
  }

  img {
    flex: 1;
    max-width: 60%;
    height: auto;
  }
`

const Copy = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--gapM);
`
