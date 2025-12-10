import { db } from '@/lib/db';
import { games, reviews } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { locales } from '@/lib/dictionaries';

export const revalidate = 86400;

export default async function sitemap() {
  const base = 'https://bestof.games';
  
  // Get games with their last update times
  const gameRows = await db
    .select({ 
      slug: games.slug, 
      updatedAt: games.updatedAt,
      reviewUpdatedAt: reviews.updatedAt
    })
    .from(games)
    .leftJoin(reviews, eq(reviews.gameId, games.id));

  const sitemapEntries = [];

  // Generate entries for each locale
  for (const locale of locales) {
    // Home page
    sitemapEntries.push({
      url: `${base}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${base}/${l}`])
        ),
      },
    });

    // Games listing page
    sitemapEntries.push({
      url: `${base}/${locale}/games`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${base}/${l}/games`])
        ),
      },
    });

    // About page
    sitemapEntries.push({
      url: `${base}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${base}/${l}/about`])
        ),
      },
    });

    // Wishlist page
    sitemapEntries.push({
      url: `${base}/${locale}/wishlist`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${base}/${l}/wishlist`])
        ),
      },
    });

    // Individual game pages
    for (const game of gameRows) {
      sitemapEntries.push({
        url: `${base}/${locale}/games/${game.slug}`,
        lastModified: game.reviewUpdatedAt || game.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${base}/${l}/games/${game.slug}`])
          ),
        },
      });
    }
  }

  return sitemapEntries;
}
