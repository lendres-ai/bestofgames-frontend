import { db } from '@/lib/db';
import { games, reviews } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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
  
  return [
    { 
      url: `${base}/`, 
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    { 
      url: `${base}/games`, 
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    { 
      url: `${base}/about`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...gameRows.map(r => ({ 
      url: `${base}/games/${r.slug}`, 
      lastModified: r.reviewUpdatedAt || r.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}