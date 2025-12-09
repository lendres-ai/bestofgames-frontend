import { searchGames } from "@/lib/queries";
import ReviewCard from "@/components/ReviewCard";
import { Suspense } from "react";

export const metadata = {
  title: "Search Results",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const query = searchParams.query;

  if (!query) {
    return (
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Search for a game
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Enter a search term in the box above to find a game.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Search results for &quot;{query}&quot;
      </h1>
      <Suspense fallback={<p>Loading...</p>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const games = await searchGames(query);

  if (games.length === 0) {
    return (
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        No results found for &quot;{query}&quot;.
      </p>
    );
  }

  return (
    <ul data-testid="search-results-list" className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <ReviewCard
          key={game.slug}
          slug={game.slug}
          title={game.title}
          image={game.images ?? game.heroUrl ?? ""}
          score={game.score}
          releaseDate={game.releaseDate}
        />
      ))}
    </ul>
  );
}
