import { db } from './db';
import { heroBanditStats } from './schema';
import { inArray } from 'drizzle-orm';

/**
 * Thompson Sampling Bandit for Carousel Game Selection
 * 
 * Enhanced bandit that selects multiple games for the carousel from a larger pool.
 * 
 * Strategy:
 * - Position 1 (Hero): Full Thompson Sampling with aggressive exploration
 *   This is the most visible position on the landing page
 * - Positions 2-5: Thompson Sampling from remaining candidates, less exploration
 *   These positions are less visible but still contribute to engagement
 * 
 * Uses Beta distribution sampling to balance exploration vs exploitation.
 * Each game has a Beta(alpha + clicks, beta + impressions - clicks) distribution.
 */

/** Minimum impressions before we trust the data for exploitation */
const MIN_IMPRESSIONS_FOR_EXPLOIT = 10;

/** How many games to select for the carousel */
const CAROUSEL_SIZE = 5;

/** Recommended pool size for candidate games */
export const RECOMMENDED_POOL_SIZE = 20;

interface GameCandidate {
    id: string;
    slug: string;
    score?: number | null;
}

interface BanditStats {
    gameId: string;
    impressions10d: number;
    clicks10d: number;
    priorAlpha: string;
    priorBeta: string;
}

interface ScoredCandidate extends GameCandidate {
    sample: number;
    hasData: boolean;
}

/**
 * Convert review score (0-10) to a weak Beta prior.
 * Higher scores get a slightly more optimistic prior.
 * 
 * @param score - Game review score (0-10)
 * @returns { alpha, beta } - Beta distribution parameters
 */
export function convertScoreToPrior(score: number | null): { alpha: number; beta: number } {
    if (score === null || score === undefined) {
        // Uninformative prior for unscored games
        return { alpha: 1.0, beta: 1.0 };
    }

    // Normalize score to 0-1 range, then create weak prior
    // Score 10 → alpha=1.5, beta=0.5 (optimistic)
    // Score 5  → alpha=1.0, beta=1.0 (neutral)
    // Score 0  → alpha=0.5, beta=1.5 (pessimistic)
    const normalized = Math.max(0, Math.min(10, score)) / 10;
    const alpha = 0.5 + normalized; // Range: 0.5 to 1.5
    const beta = 1.5 - normalized;  // Range: 1.5 to 0.5

    return { alpha: Math.round(alpha * 100) / 100, beta: Math.round(beta * 100) / 100 };
}

/**
 * Sample from a Beta distribution using the inverse CDF method.
 * Uses a simple approximation suitable for low-stakes decisions.
 * 
 * @param alpha - Beta distribution alpha parameter
 * @param beta - Beta distribution beta parameter
 * @returns Sample from Beta(alpha, beta)
 */
function sampleBeta(alpha: number, beta: number): number {
    // Use the gamma distribution relationship: Beta(a,b) = Gamma(a) / (Gamma(a) + Gamma(b))
    // For simplicity, use the Jüttner approximation for small alpha/beta

    // Generate gamma samples using Marsaglia and Tsang's method (simplified)
    const gammaA = sampleGamma(alpha);
    const gammaB = sampleGamma(beta);

    return gammaA / (gammaA + gammaB);
}

/**
 * Sample from a Gamma distribution using Marsaglia and Tsang's method.
 */
function sampleGamma(shape: number): number {
    if (shape < 1) {
        // Use Ahrens-Dieter method for shape < 1
        return sampleGamma(1 + shape) * Math.pow(Math.random(), 1 / shape);
    }

    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);

    while (true) {
        let x: number;
        let v: number;

        do {
            x = randomNormal();
            v = 1 + c * x;
        } while (v <= 0);

        v = v * v * v;
        const u = Math.random();

        if (u < 1 - 0.0331 * (x * x) * (x * x)) {
            return d * v;
        }

        if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
            return d * v;
        }
    }
}

/**
 * Generate a random sample from standard normal distribution (Box-Muller transform)
 */
function randomNormal(): number {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Score all candidates using Thompson Sampling.
 * Returns candidates sorted by their sampled scores (best first).
 * 
 * @param candidates - Array of game candidates
 * @param statsMap - Map of game ID to bandit stats
 * @param forceExploration - If true, give maximum exploration bonus to cold-start games
 * @returns Array of scored candidates, sorted by sample (descending)
 */
function scoreAndSortCandidates(
    candidates: GameCandidate[],
    statsMap: Map<string, BanditStats>,
    forceExploration: boolean = true
): ScoredCandidate[] {
    const scored: ScoredCandidate[] = candidates.map(candidate => {
        const stat = statsMap.get(candidate.id);
        let sample: number;
        let hasData = false;

        if (!stat || stat.impressions10d < MIN_IMPRESSIONS_FOR_EXPLOIT) {
            // Cold start: force exploration
            if (forceExploration) {
                // High random sample to ensure new games get tested
                sample = 0.9 + Math.random() * 0.1; // Random between 0.9 and 1.0
            } else {
                // Moderate exploration for secondary positions
                sample = 0.5 + Math.random() * 0.4; // Random between 0.5 and 0.9
            }
        } else {
            // Exploit: sample from Beta distribution
            hasData = true;
            const alpha = Number(stat.priorAlpha) + stat.clicks10d;
            const beta = Number(stat.priorBeta) + stat.impressions10d - stat.clicks10d;
            sample = sampleBeta(alpha, beta);
        }

        return { ...candidate, sample, hasData };
    });

    // Sort by sample descending
    return scored.sort((a, b) => b.sample - a.sample);
}

/**
 * Select the hero game using Thompson Sampling.
 * 
 * @param candidates - Array of game candidates (must have id, slug, and optionally score)
 * @returns The slug of the selected hero game
 * @deprecated Use selectCarouselGames for enhanced multi-position selection
 */
export async function selectHeroGame(candidates: GameCandidate[]): Promise<string> {
    if (candidates.length === 0) {
        throw new Error('No candidates provided for hero selection');
    }

    if (candidates.length === 1) {
        return candidates[0].slug;
    }

    const candidateIds = candidates.map(c => c.id);

    // Fetch bandit stats for all candidates
    const stats = await db
        .select({
            gameId: heroBanditStats.gameId,
            impressions10d: heroBanditStats.impressions10d,
            clicks10d: heroBanditStats.clicks10d,
            priorAlpha: heroBanditStats.priorAlpha,
            priorBeta: heroBanditStats.priorBeta,
        })
        .from(heroBanditStats)
        .where(inArray(heroBanditStats.gameId, candidateIds));

    // Create a map for quick lookup
    const statsMap = new Map<string, BanditStats>();
    for (const s of stats) {
        statsMap.set(s.gameId, s);
    }

    const sorted = scoreAndSortCandidates(candidates, statsMap, true);
    return sorted[0].slug;
}

/**
 * Select multiple games for the carousel using Thompson Sampling.
 * 
 * This enhanced function selects games for all carousel positions:
 * - Position 1 (Hero): Most aggressive exploration/exploitation
 * - Positions 2-5: Selected from remaining candidates with moderate exploration
 * 
 * @param candidates - Array of game candidates (should be ~20 for best results)
 * @param count - Number of games to select (default: 5)
 * @returns Array of slugs in carousel order (hero first)
 */
export async function selectCarouselGames(
    candidates: GameCandidate[],
    count: number = CAROUSEL_SIZE
): Promise<string[]> {
    if (candidates.length === 0) {
        throw new Error('No candidates provided for carousel selection');
    }

    // If we have fewer candidates than requested, return all of them
    if (candidates.length <= count) {
        return candidates.map(c => c.slug);
    }

    const candidateIds = candidates.map(c => c.id);

    // Fetch bandit stats for all candidates
    const stats = await db
        .select({
            gameId: heroBanditStats.gameId,
            impressions10d: heroBanditStats.impressions10d,
            clicks10d: heroBanditStats.clicks10d,
            priorAlpha: heroBanditStats.priorAlpha,
            priorBeta: heroBanditStats.priorBeta,
        })
        .from(heroBanditStats)
        .where(inArray(heroBanditStats.gameId, candidateIds));

    // Create a map for quick lookup
    const statsMap = new Map<string, BanditStats>();
    for (const s of stats) {
        statsMap.set(s.gameId, s);
    }

    const selected: string[] = [];
    let remainingCandidates = [...candidates];

    // Position 1 (Hero): Full Thompson Sampling with aggressive exploration
    // This is the most important position - what users see first
    const heroSorted = scoreAndSortCandidates(remainingCandidates, statsMap, true);
    const hero = heroSorted[0];
    selected.push(hero.slug);
    remainingCandidates = remainingCandidates.filter(c => c.id !== hero.id);

    // Positions 2-5: Thompson Sampling from remaining candidates
    // Less aggressive exploration since these positions are less visible
    for (let i = 1; i < count && remainingCandidates.length > 0; i++) {
        // Re-sample for each position to add variety
        // Use moderate exploration (forceExploration = false) for secondary positions
        const sorted = scoreAndSortCandidates(remainingCandidates, statsMap, false);
        const pick = sorted[0];
        selected.push(pick.slug);
        remainingCandidates = remainingCandidates.filter(c => c.id !== pick.id);
    }

    return selected;
}

/**
 * Reorder games array to put the selected hero first.
 * 
 * @param games - Array of games
 * @param heroSlug - Slug of the game to put first
 * @returns Reordered array with hero game first
 * @deprecated Use selectCarouselGames which returns games in order
 */
export function reorderWithHero<T extends { slug: string }>(games: T[], heroSlug: string): T[] {
    const heroIndex = games.findIndex(g => g.slug === heroSlug);
    if (heroIndex <= 0) {
        return games; // Already first or not found
    }

    const reordered = [...games];
    const [hero] = reordered.splice(heroIndex, 1);
    reordered.unshift(hero);
    return reordered;
}

/**
 * Reorder games array to match the order of selected slugs.
 * 
 * @param games - Array of games (the full candidate pool)
 * @param selectedSlugs - Array of slugs in desired order
 * @returns Array of games matching the selected slugs, in order
 */
export function reorderBySelection<T extends { slug: string }>(
    games: T[],
    selectedSlugs: string[]
): T[] {
    const gameMap = new Map(games.map(g => [g.slug, g]));
    const result: T[] = [];

    for (const slug of selectedSlugs) {
        const game = gameMap.get(slug);
        if (game) {
            result.push(game);
        }
    }

    return result;
}

/**
 * Initialize bandit stats for a game if not exists.
 * Called when new games are added or during sync.
 * 
 * @param gameId - UUID of the game
 * @param score - Review score for prior calculation
 */
export async function initializeBanditStats(gameId: string, score: number | null): Promise<void> {
    const prior = convertScoreToPrior(score);

    await db
        .insert(heroBanditStats)
        .values({
            gameId,
            impressions10d: 0,
            clicks10d: 0,
            priorAlpha: prior.alpha.toFixed(2),
            priorBeta: prior.beta.toFixed(2),
        })
        .onConflictDoNothing();
}
