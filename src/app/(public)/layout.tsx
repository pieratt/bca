import type {Metadata} from 'next'
import {Work_Sans} from 'next/font/google'
import {SanityLive, sanityFetch} from '@/sanity/lib/live'
import {navigationQuery} from '@/sanity/queries'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity'
import {Header, Footer, Modals, DisableDraftMode} from '@/ui'
import '@/theme/index.scss'

const sans = Work_Sans({
  variable: '--sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Resident Company Club',
  description: '', // todo
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const drafts = await draftMode()

  const {data: header} = await sanityFetch({
    query: navigationQuery,
    params: {slug: 'header'},
  })

  const {data: footer} = await sanityFetch({
    query: navigationQuery,
    params: {slug: 'footer'},
  })

  if (!header || !footer) {
    throw new Error('unable to retrieve navigation data')
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link
          rel="icon"
          href="/icon-light.png"
          type="image/png"
          sizes="32x32"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/icon-dark.png"
          type="image/png"
          sizes="32x32"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className={sans.variable}>
        <Header navigation={header} />
        {children}
        <Footer navigation={footer} />
        <Modals />
        <SanityLive />
        {drafts.isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  )
}
