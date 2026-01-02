import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Pure function tests for bandit logic.
 * We test the pure functions directly here without importing the full bandit module
 * which has database dependencies.
 */

// Copied from bandit.ts for testing purposes (pure function, no db dependency)
function convertScoreToPrior(score: number | null): { alpha: number; beta: number } {
    if (score === null || score === undefined) {
        return { alpha: 1.0, beta: 1.0 };
    }

    const normalized = Math.max(0, Math.min(10, score)) / 10;
    const alpha = 0.5 + normalized;
    const beta = 1.5 - normalized;

    return { alpha: Math.round(alpha * 100) / 100, beta: Math.round(beta * 100) / 100 };
}

// Copied from bandit.ts for testing purposes
function reorderWithHero<T extends { slug: string }>(games: T[], heroSlug: string): T[] {
    const heroIndex = games.findIndex(g => g.slug === heroSlug);
    if (heroIndex <= 0) {
        return games;
    }

    const reordered = [...games];
    const [hero] = reordered.splice(heroIndex, 1);
    reordered.unshift(hero);
    return reordered;
}

describe('bandit pure functions', () => {
    describe('convertScoreToPrior', () => {
        it('returns neutral prior for null score', () => {
            const result = convertScoreToPrior(null);
            assert.deepStrictEqual(result, { alpha: 1.0, beta: 1.0 });
        });

        it('returns optimistic prior for high score (10)', () => {
            const result = convertScoreToPrior(10);
            assert.strictEqual(result.alpha, 1.5);
            assert.strictEqual(result.beta, 0.5);
        });

        it('returns neutral prior for mid score (5)', () => {
            const result = convertScoreToPrior(5);
            assert.strictEqual(result.alpha, 1.0);
            assert.strictEqual(result.beta, 1.0);
        });

        it('returns pessimistic prior for low score (0)', () => {
            const result = convertScoreToPrior(0);
            assert.strictEqual(result.alpha, 0.5);
            assert.strictEqual(result.beta, 1.5);
        });

        it('clamps scores outside 0-10 range', () => {
            const tooHigh = convertScoreToPrior(15);
            assert.strictEqual(tooHigh.alpha, 1.5);
            assert.strictEqual(tooHigh.beta, 0.5);

            const tooLow = convertScoreToPrior(-5);
            assert.strictEqual(tooLow.alpha, 0.5);
            assert.strictEqual(tooLow.beta, 1.5);
        });

        it('handles decimal scores correctly', () => {
            const result = convertScoreToPrior(8.5);
            assert.strictEqual(result.alpha, 1.35);
            assert.strictEqual(result.beta, 0.65);
        });
    });

    describe('reorderWithHero', () => {
        const games = [
            { slug: 'game-a' },
            { slug: 'game-b' },
            { slug: 'game-c' },
            { slug: 'game-d' },
        ];

        it('returns original array if hero is already first', () => {
            const result = reorderWithHero(games, 'game-a');
            assert.deepStrictEqual(result.map(g => g.slug), ['game-a', 'game-b', 'game-c', 'game-d']);
        });

        it('moves hero to first position', () => {
            const result = reorderWithHero(games, 'game-c');
            assert.deepStrictEqual(result.map(g => g.slug), ['game-c', 'game-a', 'game-b', 'game-d']);
        });

        it('returns original array if hero not found', () => {
            const result = reorderWithHero(games, 'game-x');
            assert.deepStrictEqual(result.map(g => g.slug), ['game-a', 'game-b', 'game-c', 'game-d']);
        });

        it('does not mutate original array', () => {
            const original = [...games];
            reorderWithHero(games, 'game-c');
            assert.deepStrictEqual(games.map(g => g.slug), original.map(g => g.slug));
        });
    });
});
