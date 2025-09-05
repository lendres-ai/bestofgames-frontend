import { FeaturedGameSkeleton, ReviewCardSkeleton } from '@/components/SkeletonLoader';

export default function Loading() {
  return (
    <main className="relative isolate">
      {/* soft page backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-600/10 via-sky-400/10 to-transparent" />

      <section className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
        {/* hero header */}
        <header className="mb-[var(--space-8)] sm:mb-[var(--space-10)]">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </header>

        {/* top grid: 2 columns on lg - featured left, two-up right */}
        <div className="grid gap-[var(--block-gap)] lg:grid-cols-2">
          {/* FEATURED card skeleton */}
          <FeaturedGameSkeleton />

          {/* RIGHT: two-up grid of smaller cards */}
          <ul className="grid grid-cols-2 gap-[var(--block-gap)]">
            {Array.from({ length: 4 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </ul>
        </div>

        {/* remaining items */}
        <ul className="mt-[var(--space-12)] grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </ul>
      </section>
    </main>
  );
}