import {resolveReference} from './'

export const extractLink = (item: Sanity.LinkWithLabel) => {
  switch (true) {
    // todo: this will have to switch on internalLink.[internalTypeReferenceTo]: "blog"
    case !!item.link?.internalLink:
      const internalLink = resolveReference(item.link.internalLink)
      const slug = internalLink!.metadata!.slug!.current!
      return `/${slug}`
    case !!item.link?.anchor:
      return `#${item.link.anchor}`
    case !!item.link?.url:
      return item.link.url
    default:
      return 'donk'
  }
}
