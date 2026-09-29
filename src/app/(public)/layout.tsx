import type {Metadata} from 'next'
import {Work_Sans} from 'next/font/google'
import {ArchiveIndex, Footer, Header} from '@/ui'
import '@/theme/legacy.scss'

const sans = Work_Sans({
  variable: '--sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Book Cover Archive',
  description: '', // todo
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
      <body className={sans.variable}>
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
