import {styled} from '@linaria/react'
import {EyebrowSmall, Normal} from '../primitives/copyRenderers'
import {ModuleWrapper} from '../primitives'
import NextImage from 'next/image'
import {resolveReference} from '@/lib'

export const ImagesModule = ({module: {images}}: {module: Sanity.ImagesModule}) =>
  !images ? null : (
    // todo: let's figure out portrait orientation images
    <StyledModuleWrapper>
      <Wrapper className={`count-${images.length}`}>
        {images.map((column) => {
          const asset = resolveReference(column.image.asset)
          return !asset ? null : (
            <Column key={column._key}>
              <NextImage
                src={asset.url!}
                alt="an image"
                width={asset.metadata?.dimensions?.width}
                height={asset.metadata?.dimensions?.height}
                placeholder="blur"
                blurDataURL={asset.metadata?.blurHash}
              />
              <Copy>
                {column.caption && <Normal style={{fontStyle: 'italic'}}>{column.caption}</Normal>}
                {column.credit && (
                  <EyebrowSmall>
                    {column.creditLink && (
                      <a href={column.creditLink} target="_blank" rel="noreferrer noopener">
                        {column.credit}
                      </a>
                    )}
                    {!column.creditLink && column.credit}
                  </EyebrowSmall>
                )}
              </Copy>
            </Column>
          )
        })}
      </Wrapper>
    </StyledModuleWrapper>
  )

const StyledModuleWrapper = styled(ModuleWrapper)`
  padding-top: var(--gapS);
  padding-bottom: var(--gapS);
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--gapM);

  @media only screen and (min-width: 744px) {
    flex-direction: row;
    &.count-1 {
      width: max(445px, min(860px, calc((860 / 1728) * 100vw)));
      margin: auto;
    }
    &.count-2 {
      width: max(445px, min(1400px, calc((1400 / 1728) * 100vw)));
      margin: auto;
    }
  }
`

const Column = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--gapS);

  img {
    max-width: 100%;
    height: auto;
  }
`

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--gapXS);
`

const SimpleRule = styled.hr`
  border: 0;
  outline: 0;
  width: 100%;
  height: 1px;
  background: black;
`
