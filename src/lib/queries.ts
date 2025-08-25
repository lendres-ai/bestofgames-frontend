import { db } from './db';
import { games, reviews } from './schema';
import { desc, eq } from 'drizzle-orm';

export async function getRecentReviews(limit = 8) {
  return db.select({
    slug: games.slug, title: games.title, summary: games.summary,
    heroUrl: games.heroUrl, score: reviews.score, publishedAt: reviews.publishedAt
  })
  .from(reviews)
  .leftJoin(games, eq(reviews.gameId, games.id))
  .where(eq(reviews.isPublished, true))
  .orderBy(desc(reviews.publishedAt))
  .limit(limit);
}

export async function getGameBySlug(slug: string) {
  const rows = await db.select({
    id: games.id, slug: games.slug, title: games.title,
    summary: games.summary, heroUrl: games.heroUrl,
    description: reviews.description,
    introduction: reviews.introduction,
    gameplayFeatures: reviews.gameplayFeatures,
    conclusion: reviews.conclusion,
    userOpinion: reviews.userOpinion,
    score: reviews.score
  })
  .from(games)
  .leftJoin(reviews, eq(reviews.gameId, games.id))
  .where(eq(games.slug, slug))
  .limit(1);

  return rows[0] ?? null;
}