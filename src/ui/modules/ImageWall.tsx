'use client'

import {styled} from '@linaria/react'
import {ModuleWrapper, Rule} from '@/ui'
import {TitleSmall, Normal} from '../primitives'
import {resolveReference} from '@/lib'
import NextImage from 'next/image'

export const ImageWall = ({
  module: {rule, title, description, images},
}: {
  module: NonNullable<Sanity.ImageWall>
}) => {
  return (
    <>
      {rule && <Rule label={rule} />}
      <ModuleWrapper>
        <Wrapper>
          {title && (
            <Header>
              <Title>{title}</Title>
              {description && <Description>{description}</Description>}
            </Header>
          )}
          <Images>
            {images?.map((item) => {
              const asset = resolveReference(item.asset)
              return !asset ? null : (
                <Image
                  key={item._key}
                  src={asset.url!}
                  alt="an image"
                  width={asset.metadata?.dimensions?.width}
                  height={asset.metadata?.dimensions?.height}
                  placeholder="blur"
                  blurDataURL={asset.metadata?.blurHash}
                />
              )
            })}
          </Images>
        </Wrapper>
      </ModuleWrapper>
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-direction: column;
  gap: var(--gapS);
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: var(--gapS);
  text-align: center;
`

const Title = styled(TitleSmall)`
  max-width: 70%;
`

const Description = styled(Normal)`
  max-width: 85%;
`

const Images = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  grid-template-rows: 2fr 1fr;
  gap: var(--gapS) var(--gapM);

  img:nth-child(1) {
    grid-row-end: span 2;
  }

  img:nth-child(2) {
    grid-column-end: span 2;
  }
`

const Image = styled(NextImage)`
  object-fit: cover;
  padding: var(--gapXS);
  border: 1px solid var(--black);
  width: 100%;
  height: 100%;
`
