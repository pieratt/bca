declare global {
  declare type Member<A> = A extends readonly (infer T)[] ? T : never

  interface PageProps {
    params: Promise<{
      slug: string
    }>
  }
}

export * from './sanity'
