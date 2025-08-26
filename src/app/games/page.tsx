import Image from 'next/image';
import Link from 'next/link';
import SortSelect from './SortSelect';
import { getAllReviews } from '@/lib/queries';

// No explicit revalidate, rely on default ISR settings

type ReviewItem = {
  slug: string;
  title: string;
  heroUrl?: string | null;
  coverUrl?: string | null;
  score?: number | null;
  releaseDate?: Date | string | null;
};

function scoreClasses(score?: number | null) {
  if (typeof score !== 'number')
    return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  if (score >= 9)
    return 'bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-400/40 dark:text-emerald-300';
  if (score >= 8)
    return 'bg-amber-500/15  text-amber-700  ring-1 ring-amber-400/40  dark:text-amber-300';
  return 'bg-rose-500/15    text-rose-700    ring-1 ring-rose-400/40    dark:text-rose-300';
}

function coverOf(x: ReviewItem) {
  return x.coverUrl || x.heroUrl || 'https://placehold.co/1200x675.png';
}

export default async function Page({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const order = ['score', 'publishedAt', 'title'].includes(
    searchParams.sort ?? ''
  )
    ? (searchParams.sort as 'score' | 'publishedAt' | 'title')
    : 'publishedAt';

  const rows = await getAllReviews(order);
  const items: ReviewItem[] = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    heroUrl: r.heroUrl,
    coverUrl: r.coverUrl,
    score: r.score != null ? Number(r.score) : null,
    releaseDate: r.releaseDate,
  }));

  return (
    <main className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <header className="mb-[var(--space-8)] flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">All Games</h1>
        <SortSelect />
      </header>
      <ul className="grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <li key={r.slug} className="group">
            <Link
              href={`/games/${r.slug}`}
              className="block overflow-hidden rounded-3xl border bg-white/60 shadow-sm ring-1 ring-black/5 transition hover:shadow-lg dark:bg-gray-900/60"
            >
              <div className="relative">
                <Image
                  src={coverOf(r)}
                  alt={r.title ?? 'cover image'}
                  width={1200}
                  height={675}
                  className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span
                  className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${scoreClasses(
                    r.score,
                  )}`}
                >
                  {typeof r.score === 'number' ? r.score.toFixed(1) : '–'}
                </span>
              </div>
              <div className="p-[var(--space-4)]">
                <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                  {r.title}
                </h3>
                {r.releaseDate && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(r.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
