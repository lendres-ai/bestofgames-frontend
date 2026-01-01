import { cookies } from 'next/headers';

export type HeroVariant = 'A' | 'B';

const COOKIE_NAME = 'ab_hero_variant';

/**
 * A/B Test for Hero Game Selection
 * 
 * Variant A (control): Default order - first game is hero
 * Variant B (test): Swap game #2 to hero position
 * 
 * Cookie is set by middleware; this function only reads it.
 * Falls back to 'A' if cookie is missing (shouldn't happen with middleware).
 */
export async function getHeroVariant(): Promise<HeroVariant> {
    const cookieStore = await cookies();
    const variant = cookieStore.get(COOKIE_NAME)?.value;

    if (variant === 'A' || variant === 'B') {
        return variant;
    }

    // Fallback to control if cookie missing
    return 'A';
}

/**
 * Reorder games array based on variant
 * 
 * @param games - Array of games (first 5 for carousel)
 * @param variant - A/B test variant
 * @returns Reordered array with hero game first
 */
export function applyHeroVariant<T>(games: T[], variant: HeroVariant): T[] {
    if (games.length < 2 || variant === 'A') {
        return games;
    }

    // Variant B: Swap first and second game
    const reordered = [...games];
    [reordered[0], reordered[1]] = [reordered[1], reordered[0]];
    return reordered;
}
