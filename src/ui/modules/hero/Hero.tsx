import {styled} from '@linaria/react'
import {TextHero, ImageOnSideHero, BannerHero} from './'

export const Hero = ({
  module,
  title,
  imageAsset,
  type, // todo: might ditch this, figure out where to put in publishDate first
  author,
  publishDate,
}: {
  module: Sanity.Hero
  title: string
  imageAsset?: Sanity.SanityImageAsset
  type?: 'post' | 'page'
  author?: string
  publishDate?: string
}) => (
  <RuleWrapper>
    {(() => {
      switch (module.layout) {
        case 'TEXT_ONLY':
          return <TextHero module={module} />
        case 'IMAGE_ON_LEFT':
          return <ImageOnSideHero title={title} module={module} imageAsset={imageAsset} />
        case 'IMAGE_ON_RIGHT':
          return (
            <ImageOnSideHero
              title={title}
              module={module}
              imageAsset={imageAsset}
              className="reversed"
            />
          )
        case 'BANNER_IMAGE':
          return <BannerHero title={title} module={module} imageAsset={imageAsset} />
        default:
          return null
      }
    })()}
  </RuleWrapper>
)

const RuleWrapper = styled.header`
  display: contents;
`
