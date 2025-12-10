import { SITE_URL, SITE_NAME } from './constants';

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: 'Discover the best indie games with in-depth reviews, ratings, and recommendations.',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function generateGameReviewStructuredData(game: {
  title: string;
  summary?: string | null;
  heroUrl?: string | null;
  score?: number | null;
  developer?: string | null;
  releaseDate?: Date | null;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'VideoGame',
      name: game.title,
      description: game.summary || `Review of ${game.title}`,
      image: game.heroUrl || `${SITE_URL}/placeholder-game.jpg`,
      applicationCategory: 'Game',
      operatingSystem: 'Windows, macOS, Linux',
      ...(game.developer && {
        author: {
          '@type': 'Organization',
          name: game.developer,
        },
      }),
      ...(game.releaseDate && {
        datePublished: game.releaseDate.toISOString(),
      }),
    },
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/games/${game.slug}`,
    ...(game.score && {
      reviewRating: {
        '@type': 'Rating',
        ratingValue: game.score,
        bestRating: 10,
        worstRating: 0,
      },
    }),
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateGameListStructuredData(games: Array<{
  title: string;
  slug: string;
  summary?: string | null;
  score?: number | null;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Latest Game Reviews',
    description: 'Latest indie game reviews and ratings',
    url: SITE_URL,
    numberOfItems: games.length,
    itemListElement: games.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/games/${game.slug}`,
      name: game.title,
      description: game.summary || `Review of ${game.title}`,
    })),
  };
}