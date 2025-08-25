import {db} from './db';
import {
    games,
    reviews,
    reviewTags,
    tags,
    gamePlatforms,
    platforms,
    gameImages,
    reviewProsCons,
} from './schema';
import {desc, eq, sql} from 'drizzle-orm';

export async function getRecentReviews(limit = 8) {
    // Select a single cover image per game via correlated subquery to avoid duplicating rows
    const coverImageSubquery = sql<string>`(
        select gi.url
        from game_images as gi
        where gi.game_id = ${games.id}
        order by gi.sort_order nulls last, gi.id
        limit 1
    )`;

    return db.select({
        slug: games.slug,
        title: games.title,
        summary: games.summary,
        heroUrl: games.heroUrl,
        score: reviews.score,
        publishedAt: reviews.publishedAt,
        images: coverImageSubquery,
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
            releaseDate: games.releaseDate,
            reviewTitle: reviews.title,
            description: reviews.description,
            introduction: reviews.introduction,
            gameplayFeatures: reviews.gameplayFeatures,
            conclusion: reviews.conclusion,
            score: reviews.score,
            developer: games.developer,
            tagName: tags.name,
            platformName: platforms.name,
            userOpinion: reviews.userOpinion,
            images: gameImages.url,
            proConText: reviewProsCons.text,
            proConType: reviewProsCons.type,
        })
        .from(games)
        .leftJoin(reviews, eq(reviews.gameId, games.id))
        .leftJoin(reviewTags, eq(reviewTags.reviewId, reviews.id))
        .leftJoin(tags, eq(reviewTags.tagId, tags.id))
        .leftJoin(gamePlatforms, eq(gamePlatforms.gameId, games.id))
        .leftJoin(platforms, eq(gamePlatforms.platformId, platforms.id))
        .leftJoin(gameImages, eq(gameImages.gameId, games.id))
        .leftJoin(reviewProsCons, eq(reviewProsCons.reviewId, reviews.id))
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
        releaseDate: base.releaseDate,
        tags: Array.from(
            new Set(
                rows
                    .map((r) => r.tagName)
                    .filter((name): name is string => typeof name === 'string')
            )
        ),
        platforms: Array.from(
            new Set(
                rows
                    .map((r) => r.platformName)
                    .filter((name): name is string => typeof name === 'string')
            )
        ),
        images: Array.from(
            new Set(
                rows
                    .map((r) => r.images)
                    .filter((name): name is string => typeof name === 'string')
            )
        ),
        userOpinion: base.userOpinion,
        reviewTitle: base.reviewTitle,
        pros: Array.from(
            new Set(
                rows
                    .filter((r) => r.proConType === 'pro')
                    .map((r) => r.proConText)
                    .filter((t): t is string => typeof t === 'string')
            )
        ),
        cons: Array.from(
            new Set(
                rows
                    .filter((r) => r.proConType === 'con')
                    .map((r) => r.proConText)
                    .filter((t): t is string => typeof t === 'string')
            )
        ),
    };
}