import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db, client } from "./db";
import { games, reviews } from "./schema";
import { searchGames } from "./queries";

describe("searchGames", () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(reviews);
    await db.delete(games);

    // Seed the database with test data
    const game1 = await db
      .insert(games)
      .values({
        title: "Test Game 1",
        slug: "test-game-1",
        summary: "This is a test game about searching.",
      })
      .returning();

    const game2 = await db
      .insert(games)
      .values({
        title: "Another Game",
        slug: "another-game",
        summary: "This is a test of the search.",
      })
      .returning();

    await db.insert(reviews).values([
      {
        gameId: game1[0].id,
        isPublished: true,
        score: 8,
        title: "Review for Test Game 1",
        description: "A review.",
        introduction: "Intro.",
        gameplayFeatures: "Features.",
        conclusion: "Conclusion.",
      },
      {
        gameId: game2[0].id,
        isPublished: true,
        score: 9,
        title: "Review for Another Game",
        description: "A review.",
        introduction: "Intro.",
        gameplayFeatures: "Features.",
        conclusion: "Conclusion.",
      },
    ]);
  });

  afterAll(async () => {
    // Clean up the test data
    await db.delete(reviews);
    await db.delete(games);
    // Close the database connection
    await client.end();
  });

  it("should return games that match the query in the title", async () => {
    const results = await searchGames("Test Game");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Test Game 1");
  });

  it("should return games that match the query in the summary", async () => {
    const results = await searchGames("searching");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Test Game 1");
  });

  it("should return multiple games that match the query", async () => {
    const results = await searchGames("test");
    expect(results).toHaveLength(2);
  });

  it("should be case-insensitive", async () => {
    const results = await searchGames("another game");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Another Game");
  });

  it("should return an empty array if no games match", async () => {
    const results = await searchGames("non-existent");
    expect(results).toHaveLength(0);
  });
});
