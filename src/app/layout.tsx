import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | BestOfGames',
    default: 'BestOfGames – Indie Game Reviews & Ratings'
  },
  description: 'Discover the best indie games with in-depth reviews, ratings, and recommendations. Fresh, stylish reviews with beautiful covers.',
  keywords: ['indie games', 'game reviews', 'gaming', 'video games', 'game ratings', 'indie gaming'],
  authors: [{ name: 'BestOfGames Team' }],
  creator: 'BestOfGames',
  publisher: 'BestOfGames',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://bestof.games',
    siteName: 'BestOfGames',
    title: 'BestOfGames – Indie Game Reviews & Ratings',
    description: 'Discover the best indie games with in-depth reviews, ratings, and recommendations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BestOfGames – Indie Game Reviews & Ratings',
    description: 'Discover the best indie games with in-depth reviews, ratings, and recommendations.',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh flex flex-col`}>
        {process.env.VERCEL_ENV === 'production' && (
          <Script
            src="https://umami.mountdoom.space/script.js"
            strategy="afterInteractive"
            data-website-id="a696f6b4-f857-4add-a5fa-52469d4f203a"
          />
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

