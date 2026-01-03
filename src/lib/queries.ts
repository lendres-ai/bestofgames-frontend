import { db } from './db';
import {
    games,
    reviews,
    reviewTags,
    tags,
    gamePlatforms,
    platforms,
    gameImages,
    reviewProsCons,
    heroBanditStats,
} from './schema';
import { and, desc, eq, gte, inArray, ilike, ne, notInArray, or, sql } from 'drizzle-orm';
import { LocalizedField } from './i18n';

/**
 * Helper: correlated subquery to get the first cover image for a game
 * Avoids duplicating rows when joining with game_images
 */
const coverImageSubquery = sql<string>`(
    select gi.url
    from game_images as gi
    where gi.game_id = ${games.id}
    order by gi.sort_order nulls last, gi.id
    limit 1
)`;

// ============================================================================
// Types
// ============================================================================

export type ReviewListItem = {
    id: string | null;
    slug: string | null;
    title: LocalizedField;
    summary?: LocalizedField;
    heroUrl: string | null;
    score: string | null;
    publishedAt: Date | null;
    releaseDate: Date | null;
    images: string | null;
};

export type GameDetail = {
    id: string;
    slug: string;
    title: LocalizedField;
    summary: LocalizedField;
    heroUrl: string | null;
    steamAppId: number | null;
    description: LocalizedField;
    introduction: LocalizedField;
    gameplayFeatures: LocalizedField;
    conclusion: LocalizedField;
    score: string | null;
    developer: string | null;
    releaseDate: Date | null;
    reviewTitle: LocalizedField;
    userOpinion: LocalizedField;
    tags: (string | null)[];
    platforms: (string | null)[];
    images: (string | null)[];
    pros: LocalizedField[];
    cons: LocalizedField[];
};

export type SimilarGame = {
    slug: string;
    title: LocalizedField;
    heroUrl: string | null;
    images: string | null;
};

export type SearchResult = {
    slug: string;
    title: string;
    heroUrl: string | null;
    images: string | null;
    score: string | null;
    developer: string | null;
    matchedTag: string | null;
};

// ============================================================================
// Queries
// ============================================================================

/**
 * Get featured reviews for the homepage.
 * Strategy: Show top-scored games released in the last 90 days first,
 * then fill remaining slots with top-rated games from all time.
 */
export async function getRecentReviews(limit = 8): Promise<ReviewListItem[]> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // First: get top-scored games released in the last 7 days
    const recentTopRated = await db.select({
        id: games.id,
        slug: games.slug,
        title: games.title,
        summary: games.summary,
        heroUrl: games.heroUrl,
        score: reviews.score,
        publishedAt: reviews.publishedAt,
        releaseDate: games.releaseDate,
        images: coverImageSubquery,
    })
        .from(reviews)
        .leftJoin(games, eq(reviews.gameId, games.id))
        .where(and(
            eq(reviews.isPublished, true),
            gte(games.releaseDate, ninetyDaysAgo)
        ))
        .orderBy(desc(reviews.score))
        .limit(limit);

    // If we have enough, return early
    if (recentTopRated.length >= limit) {
        return recentTopRated;
    }

    // Otherwise, fill remaining slots with top-rated from all time
    const remaining = limit - recentTopRated.length;
    const existingSlugs = recentTopRated
        .map(r => r.slug)
        .filter((slug): slug is string => slug !== null);

    const fillQuery = db.select({
        id: games.id,
        slug: games.slug,
        title: games.title,
        summary: games.summary,
        heroUrl: games.heroUrl,
        score: reviews.score,
        publishedAt: reviews.publishedAt,
        releaseDate: games.releaseDate,
        images: coverImageSubquery,
    })
        .from(reviews)
        .leftJoin(games, eq(reviews.gameId, games.id))
        .where(existingSlugs.length > 0
            ? and(
                eq(reviews.isPublished, true),
                notInArray(games.slug, existingSlugs)
            )
            : eq(reviews.isPublished, true)
        )
        .orderBy(desc(reviews.score))
        .limit(remaining);

    const allTimeTopRated = await fillQuery;

    return [...recentTopRated, ...allTimeTopRated];
}

/**
 * Trending game candidate with composite ranking score.
 */
export type TrendingGame = ReviewListItem & {
    /** Composite ranking score (0-10) combining score, recency, and engagement */
    trendingScore: number;
};

/**
 * Get trending games for the bandit candidate pool.
 * 
 * Combines three signals into a composite ranking score:
 * - Base score (50%): Review score (0-10)
 * - Recency boost (20%): Decays from 1.0 to 0 over 90 days since release
 * - Engagement score (30%): CTR from last 10 days, normalized to 0-10 scale
 * 
 * Games without engagement data get a neutral engagement score (5.0) so they
 * can still rank based on review score and recency.
 * 
 * @param limit - Maximum number of games to return
 * @returns Games sorted by composite trending score
 */
export async function getTrendingGames(limit = 20): Promise<TrendingGame[]> {
    const now = new Date();
    const RECENCY_WINDOW_DAYS = 90;
    const MIN_IMPRESSIONS_FOR_CTR = 10;

    // Weight configuration
    const WEIGHT_SCORE = 0.5;
    const WEIGHT_RECENCY = 0.2;
    const WEIGHT_ENGAGEMENT = 0.3;

    // Fetch all published games with their bandit stats
    const results = await db
        .select({
            id: games.id,
            slug: games.slug,
            title: games.title,
            summary: games.summary,
            heroUrl: games.heroUrl,
            score: reviews.score,
            publishedAt: reviews.publishedAt,
            releaseDate: games.releaseDate,
            images: coverImageSubquery,
            // Bandit stats (may be null if game hasn't been shown yet)
            impressions10d: heroBanditStats.impressions10d,
            clicks10d: heroBanditStats.clicks10d,
        })
        .from(reviews)
        .innerJoin(games, eq(reviews.gameId, games.id))
        .leftJoin(heroBanditStats, eq(heroBanditStats.gameId, games.id))
        .where(eq(reviews.isPublished, true));

    // Calculate composite trending score for each game
    const scoredGames: TrendingGame[] = results.map(game => {
        // 1. Base score (0-10)
        const baseScore = game.score ? parseFloat(game.score) : 5.0;

        // 2. Recency boost (0-1, decays over 90 days)
        let recencyBoost = 0.5; // Default for games without release date
        if (game.releaseDate) {
            const daysSinceRelease = (now.getTime() - game.releaseDate.getTime()) / (1000 * 60 * 60 * 24);
            recencyBoost = Math.max(0, 1 - (daysSinceRelease / RECENCY_WINDOW_DAYS));
        }

        // 3. Engagement score (CTR normalized to 0-10)
        let engagementScore = 5.0; // Neutral default for cold-start games
        if (game.impressions10d && game.impressions10d >= MIN_IMPRESSIONS_FOR_CTR) {
            // CTR typically ranges 0-0.1 (0-10%), normalize to 0-10 scale
            // Using a 10% CTR as "excellent" (maps to 10)
            const ctr = game.clicks10d! / game.impressions10d;
            engagementScore = Math.min(10, ctr * 100); // 0.01 CTR = 1.0, 0.10 CTR = 10.0
        }

        // Composite score (weighted average, all normalized to 0-10)
        const trendingScore =
            (baseScore * WEIGHT_SCORE) +
            (recencyBoost * 10 * WEIGHT_RECENCY) + // Scale recency to 0-10
            (engagementScore * WEIGHT_ENGAGEMENT);

        return {
            id: game.id,
            slug: game.slug,
            title: game.title,
            summary: game.summary,
            heroUrl: game.heroUrl,
            score: game.score,
            publishedAt: game.publishedAt,
            releaseDate: game.releaseDate,
            images: game.images,
            trendingScore: Math.round(trendingScore * 100) / 100, // Round to 2 decimals
        };
    });

    // Sort by trending score (descending) and return top N
    return scoredGames
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit);
}

export async function getGameBySlug(slug: string): Promise<GameDetail | null> {
    // First, get the main game and review data
    const gameData = await db
        .select({
            id: games.id,
            slug: games.slug,
            title: games.title,
            summary: games.summary,
            heroUrl: games.heroUrl,
            steamAppId: games.steamAppId,
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
        steamAppId: game.steamAppId,
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

export async function getSimilarGames(slug: string, limit = 4): Promise<SimilarGame[]> {
    const tagRows = await db
        .select({ tagId: reviewTags.tagId })
        .from(reviews)
        .innerJoin(games, eq(reviews.gameId, games.id))
        .innerJoin(reviewTags, eq(reviewTags.reviewId, reviews.id))
        .where(eq(games.slug, slug));

    const tagIds = tagRows.map((r) => r.tagId);
    if (tagIds.length === 0) return [];

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

export type SortOrder = 'score' | 'publishedAt' | 'title' | 'releaseDate';

export async function getAllReviews(orderBy: SortOrder = 'publishedAt'): Promise<ReviewListItem[]> {
    const orderColumn =
        orderBy === 'score'
            ? reviews.score
            : orderBy === 'title'
                ? games.title
                : orderBy === 'releaseDate'
                    ? games.releaseDate
                    : reviews.publishedAt;

    return db
        .select({
            id: games.id,
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
    orderBy: SortOrder = 'publishedAt'
): Promise<ReviewListItem[]> {
    const orderColumn =
        orderBy === 'score'
            ? reviews.score
            : orderBy === 'title'
                ? games.title
                : orderBy === 'releaseDate'
                    ? games.releaseDate
                    : reviews.publishedAt;

    // Perform case-insensitive tag matching by lowercasing both sides
    const loweredTag = tag.toLowerCase();

    return db
        .select({
            id: games.id,
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

/**
 * Search games by title, developer, or tags (case-insensitive)
 * Returns distinct games with a matched tag if applicable
 */
/**
 * Get a random published game for the "Surprise me!" feature
 */
export async function getRandomGame(): Promise<{ slug: string } | null> {
    const result = await db
        .select({ slug: games.slug })
        .from(reviews)
        .innerJoin(games, eq(reviews.gameId, games.id))
        .where(eq(reviews.isPublished, true))
        .orderBy(sql`random()`)
        .limit(1);

    return result[0] ?? null;
}

/**
 * Get the total count of published reviews for social proof
 */
export async function getReviewCount(): Promise<number> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(eq(reviews.isPublished, true));

    return result[0]?.count ?? 0;
}

export async function searchGames(
    query: string,
    limit = 20
): Promise<SearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const searchTerm = `%${trimmed}%`;

    const results = await db
        .select({
            slug: games.slug,
            title: games.title,
            heroUrl: games.heroUrl,
            images: coverImageSubquery,
            score: reviews.score,
            developer: games.developer,
            tagName: tags.name,
        })
        .from(games)
        .innerJoin(reviews, eq(reviews.gameId, games.id))
        .leftJoin(reviewTags, eq(reviewTags.reviewId, reviews.id))
        .leftJoin(tags, eq(reviewTags.tagId, tags.id))
        .where(
            and(
                eq(reviews.isPublished, true),
                or(
                    ilike(games.title, searchTerm),
                    ilike(games.developer, searchTerm),
                    ilike(tags.name, searchTerm)
                )
            )
        )
        .limit(limit * 3); // Fetch extra rows since we dedupe by slug

    // Dedupe by slug and capture matched tags
    const seen = new Map<string, SearchResult>();
    const lowerQuery = trimmed.toLowerCase();

    for (const row of results) {
        if (!row.slug) continue;

        const existing = seen.get(row.slug);
        if (!existing) {
            seen.set(row.slug, {
                slug: row.slug,
                title: row.title,
                heroUrl: row.heroUrl,
                images: row.images,
                score: row.score,
                developer: row.developer,
                matchedTag: row.tagName?.toLowerCase().includes(lowerQuery) ? row.tagName : null,
            });
        } else if (!existing.matchedTag && row.tagName?.toLowerCase().includes(lowerQuery)) {
            existing.matchedTag = row.tagName;
        }
    }

    return Array.from(seen.values()).slice(0, limit);
}
