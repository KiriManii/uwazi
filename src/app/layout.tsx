import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Uwazi - African Governance Polling Platform',
  description: 'Transform African governance with data-driven insights. Create polls, gather opinions, and make informed decisions with real-time results.',
  keywords: ['polling', 'governance', 'Africa', 'surveys', 'voting', 'public opinion', 'democracy'],
  authors: [{ name: 'KiriManii', url: 'https://github.com/KiriManii' }],
  metadataBase: new URL('https://uwazi-polling.vercel.app'),
  openGraph: {
    title: 'Uwazi - African Governance Polling',
    description: 'Real-time polling platform for African governance transformation',
    url: 'https://uwazi-polling.vercel.app',
    siteName: 'Uwazi',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uwazi - African Governance Polling',
    description: 'Transform governance with data-driven insights',
    images: ['/icon-512.png'],
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
