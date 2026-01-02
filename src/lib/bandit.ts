import { db } from './db';
import { heroBanditStats, reviews, games } from './schema';
import { eq, inArray } from 'drizzle-orm';

/**
 * Thompson Sampling Bandit for Hero Game Selection
 * 
 * Uses Beta distribution sampling to balance exploration vs exploitation.
 * Each game has a Beta(alpha + clicks, beta + impressions - clicks) distribution.
 * The game with the highest sample is selected as hero.
 */

const MIN_IMPRESSIONS_FOR_EXPLOIT = 10;

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
 * Select the hero game using Thompson Sampling.
 * 
 * @param candidates - Array of game candidates (must have id, slug, and optionally score)
 * @returns The slug of the selected hero game
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

    // Sample from each candidate's distribution
    let bestSlug = candidates[0].slug;
    let bestSample = -1;

    for (const candidate of candidates) {
        const stat = statsMap.get(candidate.id);
        let sample: number;

        if (!stat || stat.impressions10d < MIN_IMPRESSIONS_FOR_EXPLOIT) {
            // Cold start: force exploration with high sample
            // This ensures new games get shown at least MIN_IMPRESSIONS times
            sample = 0.9 + Math.random() * 0.1; // Random between 0.9 and 1.0
        } else {
            // Exploit: sample from Beta distribution
            const alpha = Number(stat.priorAlpha) + stat.clicks10d;
            const beta = Number(stat.priorBeta) + stat.impressions10d - stat.clicks10d;
            sample = sampleBeta(alpha, beta);
        }

        if (sample > bestSample) {
            bestSample = sample;
            bestSlug = candidate.slug;
        }
    }

    return bestSlug;
}

/**
 * Reorder games array to put the selected hero first.
 * 
 * @param games - Array of games
 * @param heroSlug - Slug of the game to put first
 * @returns Reordered array with hero game first
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
