import {sanityFetch} from '@/sanity/lib/live'
import {pageQuery} from '@/sanity/queries'
import {processMetadata} from '@/lib'

export default async function Home() {
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug: 'home'},
  })
  if (!data) {
    throw new Error('unable to retrieve page data')
  }
  return <p>home</p>
}

export async function generateMetadata() {
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug: 'home'},
  })
  if (!data?.metadata) throw new Error('page metadata not found')
  const metadata = processMetadata(data.metadata, 'page')
  return {
    ...metadata,
    // title: DEFAULT_SITE_TITLE,
    openGraph: {
      ...metadata.openGraph,
      // title: DEFAULT_SITE_TITLE,
    },
    alternates: {
      // canonical: BASE_URL,
    },
  }
}
