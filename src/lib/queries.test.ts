import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db';
import {
  getRecentReviews,
  getGameBySlug,
  getSimilarGames,
} from './queries';

const originalSelect = db.select;

type QueryChain = {
  from: () => QueryChain;
  leftJoin: () => QueryChain;
  innerJoin: () => QueryChain;
  where: () => QueryChain;
  orderBy: () => QueryChain;
  groupBy: () => QueryChain;
  limit: () => QueryChain;
  then: (resolve: (value: unknown) => unknown) => Promise<unknown>;
};

function mockSelect(responses: unknown[]): () => QueryChain {
  return () => {
    const data = responses.shift();
    const chain: QueryChain = {
      from: () => chain,
      leftJoin: () => chain,
      innerJoin: () => chain,
      where: () => chain,
      orderBy: () => chain,
      groupBy: () => chain,
      limit: () => chain,
      then: (resolve) => Promise.resolve(data).then(resolve),
    };
    return chain;
  };
}

beforeEach(() => {
  db.select = originalSelect;
});

describe('queries', () => {
  it('getRecentReviews returns recent reviews', async () => {
    const recent = [
      {
        slug: 'game-1',
        title: 'Game 1',
        summary: 'Summary',
        heroUrl: 'hero1',
        score: 90,
        publishedAt: new Date('2024-01-01'),
        images: 'img1',
      },
    ];
    db.select = mockSelect([recent]);
    assert.deepStrictEqual(await getRecentReviews(), recent);
  });

  it('getGameBySlug formats game data', async () => {
    const rows = [
      {
        id: 1,
        slug: 'game',
        title: 'Game',
        summary: 'Summary',
        heroUrl: 'hero',
        releaseDate: '2024-01-01',
        reviewTitle: 'Review',
        description: 'Desc',
        introduction: 'Intro',
        gameplayFeatures: 'Features',
        conclusion: 'Conclusion',
        score: 85,
        developer: 'Dev',
        tagName: 'Action',
        platformName: 'PC',
        userOpinion: 'Great',
        images: 'img1',
        proConText: 'Good',
        proConType: 'pro',
      },
      {
        id: 1,
        slug: 'game',
        title: 'Game',
        summary: 'Summary',
        heroUrl: 'hero',
        releaseDate: '2024-01-01',
        reviewTitle: 'Review',
        description: 'Desc',
        introduction: 'Intro',
        gameplayFeatures: 'Features',
        conclusion: 'Conclusion',
        score: 85,
        developer: 'Dev',
        tagName: 'RPG',
        platformName: 'Xbox',
        userOpinion: 'Great',
        images: 'img2',
        proConText: 'Bad',
        proConType: 'con',
      },
    ];
    db.select = mockSelect([rows]);
    assert.deepStrictEqual(await getGameBySlug('game'), {
      id: 1,
      slug: 'game',
      title: 'Game',
      summary: 'Summary',
      heroUrl: 'hero',
      description: 'Desc',
      introduction: 'Intro',
      gameplayFeatures: 'Features',
      conclusion: 'Conclusion',
      score: 85,
      developer: 'Dev',
      releaseDate: '2024-01-01',
      tags: ['Action', 'RPG'],
      platforms: ['PC', 'Xbox'],
      images: ['img1', 'img2'],
      userOpinion: 'Great',
      reviewTitle: 'Review',
      pros: ['Good'],
      cons: ['Bad'],
    });
  });

  it('getSimilarGames returns games sharing tags', async () => {
    const tagRows = [{ tagId: 1 }];
    const similar = [
      { slug: 'other', title: 'Other', heroUrl: 'hero2', images: 'img2' },
    ];
    db.select = mockSelect([tagRows, similar]);
    assert.deepStrictEqual(await getSimilarGames('game'), similar);
  });
});

