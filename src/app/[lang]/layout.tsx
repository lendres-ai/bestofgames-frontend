import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Script from 'next/script';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Locale, locales, getDictionary } from "@/lib/dictionaries";
import { SITE_URL, SITE_NAME, METADATA } from "@/lib/constants";

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
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: dict.metadata.site_title
    },
    description: dict.metadata.site_description,
    keywords: METADATA.KEYWORDS,
    authors: [{ name: `${SITE_NAME} Team` }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: dict.metadata.site_title,
      description: dict.metadata.site_description,
      images: [{ url: '/logo.png', width: 1200, height: 630, alt: SITE_NAME }],
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
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        'en': `${SITE_URL}/en`,
        'de': `${SITE_URL}/de`,
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
        <meta name="theme-color" content={METADATA.THEME_COLOR} />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en`} />
        <link rel="alternate" hrefLang="de" href={`${SITE_URL}/de`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/en`} />
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

