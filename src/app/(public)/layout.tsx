import type {Metadata} from 'next'
import {DM_Sans, Work_Sans} from 'next/font/google'
import {BASE_URL} from '@/lib'
import {ArchiveIndex, Footer, Header} from '@/ui'
import '@/theme/legacy.scss'

const sans = Work_Sans({
  variable: '--sans',
  subsets: ['latin'],
})

const titles = DM_Sans({
  variable: '--title',
  subsets: ['latin'],
  weight: ['700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Book Cover Archive',
  description: '', // todo
  openGraph: {
    title: 'Book Cover Archive',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Cover Archive',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
      <body className={`${sans.variable} ${titles.variable}`}>
        <Header />
        <div className="wrapper">
          {children}
          <Footer />
        </div>
        <ArchiveIndex />
      </body>
    </html>
  )
}
