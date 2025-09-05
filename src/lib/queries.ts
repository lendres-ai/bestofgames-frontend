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
import {and, desc, eq, inArray, ne, sql} from 'drizzle-orm';

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
    // First, get the main game and review data
    const gameData = await db
        .select({
            id: games.id,
            slug: games.slug,
            title: games.title,
            summary: games.summary,
            heroUrl: games.heroUrl,
            releaseDate: games.releaseDate,
            developer: games.developer,
            reviewId: reviews.id,
            reviewTitle: reviews.title,
            description: reviews.description,
            introduction: reviews.introduction,
            gameplayFeatures: reviews.gameplayFeatures,
            conclusion: reviews.conclusion,
            score: reviews.score,
            userOpinion: reviews.userOpinion,
        })
        .from(games)
        .leftJoin(reviews, eq(reviews.gameId, games.id))
        .where(eq(games.slug, slug))
        .limit(1);

    if (gameData.length === 0) return null;

    const game = gameData[0];
    if (!game.reviewId) return null;

    // Fetch related data in parallel
    const [tagsData, platformsData, imagesData, prosConsData] = await Promise.all([
        // Get tags
        db.select({ name: tags.name })
            .from(reviewTags)
            .innerJoin(tags, eq(reviewTags.tagId, tags.id))
            .where(eq(reviewTags.reviewId, game.reviewId)),
        
        // Get platforms
        db.select({ name: platforms.name })
            .from(gamePlatforms)
            .innerJoin(platforms, eq(gamePlatforms.platformId, platforms.id))
            .where(eq(gamePlatforms.gameId, game.id)),
        
        // Get images
        db.select({ url: gameImages.url })
            .from(gameImages)
            .where(eq(gameImages.gameId, game.id))
            .orderBy(gameImages.sortOrder),
        
        // Get pros and cons
        db.select({ text: reviewProsCons.text, type: reviewProsCons.type })
            .from(reviewProsCons)
            .where(eq(reviewProsCons.reviewId, game.reviewId))
    ]);

    return {
        id: game.id,
        slug: game.slug,
        title: game.title,
        summary: game.summary,
        heroUrl: game.heroUrl,
        description: game.description,
        introduction: game.introduction,
        gameplayFeatures: game.gameplayFeatures,
        conclusion: game.conclusion,
        score: game.score,
        developer: game.developer,
        releaseDate: game.releaseDate,
        reviewTitle: game.reviewTitle,
        userOpinion: game.userOpinion,
        tags: tagsData.map(t => t.name),
        platforms: platformsData.map(p => p.name),
        images: imagesData.map(i => i.url),
        pros: prosConsData.filter(pc => pc.type === 'pro').map(pc => pc.text),
        cons: prosConsData.filter(pc => pc.type === 'con').map(pc => pc.text),
    };
}

export async function getSimilarGames(slug: string, limit = 4) {
    const tagRows = await db
        .select({tagId: reviewTags.tagId})
        .from(reviews)
        .innerJoin(games, eq(reviews.gameId, games.id))
        .innerJoin(reviewTags, eq(reviewTags.reviewId, reviews.id))
        .where(eq(games.slug, slug));

    const tagIds = tagRows.map((r) => r.tagId);
    if (tagIds.length === 0) return [];

    const coverImageSubquery = sql<string>`(
        select gi.url
        from game_images as gi
        where gi.game_id = ${games.id}
        order by gi.sort_order nulls last, gi.id
        limit 1
    )`;

    const matchCount = sql<number>`count(distinct ${reviewTags.tagId})`;

    return db
        .select({
            slug: games.slug,
            title: games.title,
            heroUrl: games.heroUrl,
            images: coverImageSubquery,
        })
        .from(games)
        .innerJoin(reviews, eq(reviews.gameId, games.id))
        .innerJoin(reviewTags, eq(reviewTags.reviewId, reviews.id))
        .where(
            and(
                inArray(reviewTags.tagId, tagIds),
                ne(games.slug, slug),
                eq(reviews.isPublished, true)
            )
        )
        .groupBy(games.id, games.slug, games.title, games.heroUrl)
        .orderBy(desc(matchCount))
        .limit(limit);
}

export async function getAllReviews(
    orderBy: 'score' | 'publishedAt' | 'title' | 'releaseDate' = 'publishedAt'
) {
    const orderColumn =
        orderBy === 'score'
            ? reviews.score
            : orderBy === 'title'
            ? games.title
            : orderBy === 'releaseDate'
            ? games.releaseDate
            : reviews.publishedAt;

    const coverImageSubquery = sql<string>`(
        select gi.url
        from game_images as gi
        where gi.game_id = ${games.id}
        order by gi.sort_order nulls last, gi.id
        limit 1
    )`;

    return db
        .select({
            slug: games.slug,
            title: games.title,
            heroUrl: games.heroUrl,
            images: coverImageSubquery,
            score: reviews.score,
            publishedAt: reviews.publishedAt,
            releaseDate: games.releaseDate,
        })
        .from(reviews)
        .innerJoin(games, eq(reviews.gameId, games.id))
        .where(eq(reviews.isPublished, true))
        .orderBy(orderBy === 'title' ? orderColumn : desc(orderColumn));
}

export async function getReviewsByTag(
    tag: string,
    orderBy: 'score' | 'publishedAt' | 'title' | 'releaseDate' = 'publishedAt'
) {
    const orderColumn =
        orderBy === 'score'
            ? reviews.score
            : orderBy === 'title'
            ? games.title
            : orderBy === 'releaseDate'
            ? games.releaseDate
            : reviews.publishedAt;

    const coverImageSubquery = sql<string>`(
        select gi.url
        from game_images as gi
        where gi.game_id = ${games.id}
        order by gi.sort_order nulls last, gi.id
        limit 1
    )`;

    // Perform case-insensitive tag matching by lowercasing both sides
    const loweredTag = tag.toLowerCase();

    return db
        .select({
            slug: games.slug,
            title: games.title,
            heroUrl: games.heroUrl,
            images: coverImageSubquery,
            score: reviews.score,
            publishedAt: reviews.publishedAt,
            releaseDate: games.releaseDate,
        })
        .from(reviews)
        .innerJoin(reviewTags, eq(reviewTags.reviewId, reviews.id))
        .innerJoin(tags, eq(reviewTags.tagId, tags.id))
        .innerJoin(games, eq(reviews.gameId, games.id))
        .where(sql`lower(${tags.name}) = ${loweredTag}`)
        .orderBy(orderBy === 'title' ? orderColumn : desc(orderColumn));
}
