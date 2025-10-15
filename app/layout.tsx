import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MINNESOTA.CEO - Interviewing Minnesota Leaders',
  description: 'Video interviews with Minnesota\'s most influential leaders from business, education, government, and community organizations.',
  keywords: 'Minnesota, leaders, interviews, business, education, government, community, video',
  authors: [{ name: 'Weldon', url: 'https://minnesota.ceo' }],
  creator: 'EVERJUST COMPANY',
  publisher: 'EVERJUST COMPANY',
  openGraph: {
    title: 'MINNESOTA.CEO - Interviewing Minnesota Leaders',
    description: 'Video interviews with Minnesota\'s most influential leaders',
    url: 'https://minnesota.ceo',
    siteName: 'MINNESOTA.CEO',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MINNESOTA.CEO',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MINNESOTA.CEO - Interviewing Minnesota Leaders',
    description: 'Video interviews with Minnesota\'s most influential leaders',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-primary-black">
        {children}
      </body>
    </html>
  )
}
