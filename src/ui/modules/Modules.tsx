import {styled} from '@linaria/react'
import type {ReactNode} from 'react'
import {
  Newsletter,
  Cards,
  LogoList,
  Teaser,
  Slideshow,
  Rule,
  ImageWall,
  Hero,
  RichTextModule,
  ImagesModule,
  VideoModule,
} from '@/ui'
import {resolveReference} from '@/lib'

type IModules = Pick<NonNullable<Sanity.PageQueryResult>, 'modules'> & {
  children?: ReactNode
  metadata: Sanity.Metadata
}

export const Modules = ({modules, metadata, children}: IModules) => (
  <PageWrapper>
    {modules?.map((module) =>
      !module ? null : module._type === 'rule' ? (
        <Rule key={module._key} data={module} />
      ) : module._type === 'slideshow' ? (
        <Slideshow key={module._key} module={module as any as Sanity.Slideshow} />
      ) : module._type === 'hero' ? (
        <Hero
          key={module._key}
          title={metadata.title}
          module={module as any as Sanity.Hero}
          imageAsset={resolveReference(metadata.image?.asset)}
        />
      ) : module._type === 'teaser' ? (
        <Teaser key={module._key} module={module as any as Sanity.Teaser} />
      ) : module._type === 'cards' ? (
        <Cards key={module._key} module={module as any as Sanity.Cards} />
      ) : module._type === 'logoList' ? (
        <LogoList key={module._key} module={module as any as Sanity.LogoList} />
      ) : module._type === 'newsletter' ? (
        <Newsletter key={module._key} module={module} />
      ) : module._type === 'imageWall' ? (
        <ImageWall key={module._key} module={module as any as Sanity.ImageWall} />
      ) : module._type === 'richTextModule' ? (
        <RichTextModule key={module._key} module={module} />
      ) : module._type === 'imagesModule' ? (
        <ImagesModule key={module._key} module={module as any as Sanity.ImagesModule} />
      ) : module._type === 'videoModule' ? (
        <VideoModule key={module._key} module={module} />
      ) : module._type === 'pageContentModule' ? (
        <PageContentWrapper key="page_content">{children}</PageContentWrapper>
      ) : null
    )}
  </PageWrapper>
)

export const PageWrapper = styled.main`
  position: relative;
  z-index: var(--layer-page);
  background: var(--cream);
`

const PageContentWrapper = styled.section`
  display: contents;
`
