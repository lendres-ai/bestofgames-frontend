export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BestOfGames',
    description: 'Discover the best indie games with in-depth reviews, ratings, and recommendations.',
    url: 'https://bestof.games',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://bestof.games/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BestOfGames',
      url: 'https://bestof.games',
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
  const baseUrl = 'https://bestof.games';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'VideoGame',
      name: game.title,
      description: game.summary || `Review of ${game.title}`,
      image: game.heroUrl || `${baseUrl}/placeholder-game.jpg`,
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
      name: 'BestOfGames',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BestOfGames',
      url: baseUrl,
    },
    url: `${baseUrl}/games/${game.slug}`,
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
  const baseUrl = 'https://bestof.games';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Latest Game Reviews',
    description: 'Latest indie game reviews and ratings',
    url: baseUrl,
    numberOfItems: games.length,
    itemListElement: games.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/games/${game.slug}`,
      name: game.title,
      description: game.summary || `Review of ${game.title}`,
    })),
  };
}