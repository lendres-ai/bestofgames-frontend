import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Query module tests
 * 
 * Note: These tests verify the query function behavior when database is unavailable.
 * For integration tests with an actual database, set DATABASE_URL and use a test database.
 */

describe('queries (without database)', () => {
  it('getRecentReviews returns empty array when database unavailable', async () => {
    // Import fresh without DATABASE_URL set
    delete process.env.DATABASE_URL;
    
    // Clear module cache to get fresh imports
    const queriesPath = require.resolve('./queries');
    const dbPath = require.resolve('./db');
    delete require.cache[queriesPath];
    delete require.cache[dbPath];
    
    const { getRecentReviews } = await import('./queries');
    const result = await getRecentReviews();
    assert.deepStrictEqual(result, []);
  });

  it('getAllReviews returns empty array when database unavailable', async () => {
    delete process.env.DATABASE_URL;
    
    const queriesPath = require.resolve('./queries');
    const dbPath = require.resolve('./db');
    delete require.cache[queriesPath];
    delete require.cache[dbPath];
    
    const { getAllReviews } = await import('./queries');
    const result = await getAllReviews();
    assert.deepStrictEqual(result, []);
  });

  it('getGameBySlug returns null when database unavailable', async () => {
    delete process.env.DATABASE_URL;
    
    const queriesPath = require.resolve('./queries');
    const dbPath = require.resolve('./db');
    delete require.cache[queriesPath];
    delete require.cache[dbPath];
    
    const { getGameBySlug } = await import('./queries');
    const result = await getGameBySlug('some-game');
    assert.strictEqual(result, null);
  });

  it('getSimilarGames returns empty array when database unavailable', async () => {
    delete process.env.DATABASE_URL;
    
    const queriesPath = require.resolve('./queries');
    const dbPath = require.resolve('./db');
    delete require.cache[queriesPath];
    delete require.cache[dbPath];
    
    const { getSimilarGames } = await import('./queries');
    const result = await getSimilarGames('some-game');
    assert.deepStrictEqual(result, []);
  });

  it('getReviewCount returns 0 when database unavailable', async () => {
    delete process.env.DATABASE_URL;
    
    const queriesPath = require.resolve('./queries');
    const dbPath = require.resolve('./db');
    delete require.cache[queriesPath];
    delete require.cache[dbPath];
    
    const { getReviewCount } = await import('./queries');
    const result = await getReviewCount();
    assert.strictEqual(result, 0);
  });

  it('searchGames returns empty array when database unavailable', async () => {
    delete process.env.DATABASE_URL;
    
    const queriesPath = require.resolve('./queries');
    const dbPath = require.resolve('./db');
    delete require.cache[queriesPath];
    delete require.cache[dbPath];
    
    const { searchGames } = await import('./queries');
    const result = await searchGames('test query');
    assert.deepStrictEqual(result, []);
  });
});

