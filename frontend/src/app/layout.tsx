import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Student Life OS',
  description: 'Your academic productivity hub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
