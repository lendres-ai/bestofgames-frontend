export type HeroVariant = 'A' | 'B' | 'bandit';

/**
 * Feature flag for bandit-based hero selection.
 * Set USE_BANDIT=true in environment to enable.
 * When enabled, the bandit system selects the hero game dynamically.
 */
export const USE_BANDIT = process.env.USE_BANDIT === 'true';

/**
 * Get the current hero variant.
 * Returns 'bandit' when USE_BANDIT is enabled, otherwise 'A' (control).
 */
export async function getHeroVariant(): Promise<HeroVariant> {
    if (USE_BANDIT) {
        return 'bandit';
    }
    // Default to control variant (no A/B testing)
    return 'A';
}

/**
 * Reorder games array based on variant (Legacy A/B only)
 * 
 * @param games - Array of games (first 5 for carousel)
 * @param variant - A/B test variant
 * @returns Reordered array with hero game first
 */
export function applyHeroVariant<T>(games: T[], variant: HeroVariant): T[] {
    if (games.length < 2 || variant === 'A' || variant === 'bandit') {
        return games;
    }

    // Variant B: Swap first and second game
    const reordered = [...games];
    [reordered[0], reordered[1]] = [reordered[1], reordered[0]];
    return reordered;
}
