import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Chiedza CheAfrica Podcast | Amplifying African Stories of Innovation & Impact',
    template: '%s | Chiedza CheAfrica Podcast'
  },
  description: 'Chiedza CheAfrica Podcast lights paths and inspires minds with African stories. Listen to changemakers in aviation, STEM, disability inclusion & mental health across Africa.',
  keywords: 'Chiedza CheAfrica Podcast, Africa podcast, African innovation, women in aviation, STEM in Africa, disability inclusion, youth empowerment, inspirational African stories',
  authors: [{ name: 'Chiedza CheAfrica Podcast' }],
  creator: 'Chiedza CheAfrica Podcast',
  publisher: 'Chiedza CheAfrica Podcast',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Chiedza CheAfrica Podcast - Lighting Africa\'s Path Through Stories',
    description: 'Lighting paths. Inspiring minds. Amplifying African stories of courage, innovation, and purpose.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Chiedza CheAfrica Podcast',
    url: 'https://chiedzacheafrica.com',
    images: [
      {
        url: '/hero.jpg',
        alt: 'Chiedza CheAfrica Podcast - Lighting Africa\'s Path Through Stories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chiedza CheAfrica Podcast - Amplifying African Stories',
    description: 'Lighting paths. Inspiring minds. Amplifying African stories of innovation and impact.',
    creator: '@chiedzacheafrica',
    images: ['/hero.jpg'],
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://chiedzacheafrica.com'),
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PodcastSeries",
              "name": "Chiedza CheAfrica Podcast",
              "description": "A global podcast and movement celebrating Africa's ascent through stories of courage, innovation, and purpose. Spotlighting changemakers across aviation, STEM, disability inclusion, mental health, and community empowerment.",
              "url": "https://chiedzacheafrica.com",
              "image": "https://chiedzacheafrica.com/assets/images/podcast-cover.jpg",
              "author": {
                "@type": "Organization",
                "name": "Chiedza CheAfrica"
              },
              "copyrightHolder": {
                "@type": "Organization", 
                "name": "Chiedza CheAfrica"
              },
              "genre": ["Society & Culture", "Education", "Inspiration", "African Stories"],
              "keywords": "Africa podcast, African innovation, aviation, STEM, disability inclusion, mental health, youth empowerment"
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <header className="fixed top-0 left-0 right-0 z-50 shadow-sm h-16">
            <Navbar />
          </header>
          
          <main className="flex-grow min-h-[calc(100vh-64px)]">
            {children}
          </main>
          
          <Footer />
        </div>
      </body>
    </html>
  )
}