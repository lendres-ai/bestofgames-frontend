import Image from 'next/image';
import Link from 'next/link';

interface SimilarGame {
  slug: string;
  title: string;
  heroUrl?: string | null;
  images?: string | null;
}

interface SimilarGamesProps {
  games: SimilarGame[];
}

export default function SimilarGames({ games }: SimilarGamesProps) {
  if (!games.length) return null;

  return (
    <aside className="w-full lg:col-start-2 lg:w-[300px] lg:sticky lg:top-4">
      <h3 className="mb-4 text-lg font-semibold">Ähnliche Spiele</h3>
      <ul className="grid gap-4">
        {games.map((game) => {
          const imageUrl = game.images ?? game.heroUrl;
          return (
            <li
              key={game.slug}
              className="overflow-hidden rounded-xl border bg-white/60 shadow-sm ring-1 ring-black/5 dark:bg-gray-900/60"
            >
              <Link href={`/games/${game.slug}`} className="flex gap-3 p-3">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={game.title}
                    width={80}
                    height={45}
                    sizes="96px"
                    className="h-16 w-24 flex-none rounded-md object-cover"
                  />
                )}
                <span className="self-center text-sm font-medium leading-tight">
                  {game.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
