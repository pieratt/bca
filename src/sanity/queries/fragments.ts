export const imageFragment = `
{
  ...,
  asset-> {
    metadata {
      lqip,
      blurHash,
      dimensions
    },
    originalFilename,
    url
  }
}
`

export const fileFragment = `
{
  ...,
  asset-> {
    url
  }
}
`

export const linkFragment = `
{
  ...,
  internalLink -> {
    _type,
    _id,
    publishDate,
    metadata {
      title,
      slug {
        current
      }
    }
  }
}
`
