import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Script from 'next/script';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Locale, locales, getDictionary } from "@/lib/dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL('https://bestof.games'),
    title: {
      template: '%s | BestOfGames',
      default: dict.metadata.site_title
    },
    description: dict.metadata.site_description,
    keywords: ['indie games', 'game reviews', 'gaming', 'video games', 'game ratings', 'indie gaming'],
    authors: [{ name: 'BestOfGames Team' }],
    creator: 'BestOfGames',
    publisher: 'BestOfGames',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: 'https://bestof.games',
      siteName: 'BestOfGames',
      title: dict.metadata.site_title,
      description: dict.metadata.site_description,
      images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'BestOfGames' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.site_title,
      description: dict.metadata.site_description,
      images: ['/logo.png'],
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
    alternates: {
      canonical: `https://bestof.games/${lang}`,
      languages: {
        'en': 'https://bestof.games/en',
        'de': 'https://bestof.games/de',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="en" href="https://bestof.games/en" />
        <link rel="alternate" hrefLang="de" href="https://bestof.games/de" />
        <link rel="alternate" hrefLang="x-default" href="https://bestof.games/en" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh flex flex-col`} suppressHydrationWarning>
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        {process.env.VERCEL_ENV === 'production' && (
          <Script
            src="https://umami.mountdoom.space/script.js"
            strategy="afterInteractive"
            data-website-id="a696f6b4-f857-4add-a5fa-52469d4f203a"
          />
        )}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="sw-register"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function () {
                    navigator.serviceWorker.register('/sw.js').catch(function (e) {
                      console.error('SW registration failed', e);
                    });
                  });
                }
              `,
            }}
          />
        )}
        <Header locale={lang} dict={dict} />
        <main id="main" className="flex-1">{children}</main>
        <Footer locale={lang} dict={dict} />
        <SpeedInsights />
      </body>
    </html>
  );
}

