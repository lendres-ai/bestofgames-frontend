import { db } from './db';
import {
  games,
  reviews,
  reviewTags,
  tags,
  gamePlatforms,
  platforms,
} from './schema';
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
  const rows = await db
    .select({
      id: games.id,
      slug: games.slug,
      title: games.title,
      summary: games.summary,
      heroUrl: games.heroUrl,
      description: reviews.description,
      introduction: reviews.introduction,
      gameplayFeatures: reviews.gameplayFeatures,
      conclusion: reviews.conclusion,
      score: reviews.score,
      developer: games.developer,
      tagName: tags.name,
      platformName: platforms.name,
    })
    .from(games)
    .leftJoin(reviews, eq(reviews.gameId, games.id))
    .leftJoin(reviewTags, eq(reviewTags.reviewId, reviews.id))
    .leftJoin(tags, eq(reviewTags.tagId, tags.id))
    .leftJoin(gamePlatforms, eq(gamePlatforms.gameId, games.id))
    .leftJoin(platforms, eq(gamePlatforms.platformId, platforms.id))
    .where(eq(games.slug, slug));

  if (rows.length === 0) return null;

  const base = rows[0];
  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    summary: base.summary,
    heroUrl: base.heroUrl,
    description: base.description,
    introduction: base.introduction,
    gameplayFeatures: base.gameplayFeatures,
    conclusion: base.conclusion,
    score: base.score,
    developer: base.developer,
    tags: Array.from(new Set(rows.map((r) => r.tagName).filter(Boolean))),
    platforms: Array.from(new Set(rows.map((r) => r.platformName).filter(Boolean))),
  };
}