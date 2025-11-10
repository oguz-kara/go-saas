import type { Metadata } from 'next'
import { manropeFont } from '@/styles/fonts'
import './globals.css'
import Providers from '../providers'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'GoCRM',
  description: 'GoCRM',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manropeFont.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
