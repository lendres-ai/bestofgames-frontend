import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import ReviewCard, { ReviewCardProps } from "@/components/ReviewCard";
import { getRecentReviews } from "@/lib/queries";
import { scoreClasses, coverOf } from "@/lib/ui-helpers";
import { generateWebsiteStructuredData, generateGameListStructuredData } from "@/lib/structured-data";

// ISR: 1h
export const revalidate = 3600;

export const metadata = {
  title: "BestOfGames – Indie Gems",
  description: "Fresh, stylish indie reviews with beautiful covers and quick reads.",
};

type ReviewItem = ReviewCardProps & {
  summary?: string | null;
  images?: string[] | null;
  heroUrl?: string | null;
  tags?: string[] | null;
  platforms?: string[] | null;
};

export default async function Page() {
  const rows = await getRecentReviews();
  const items: ReviewItem[] = rows
    .filter((r) => r.slug && r.title)
    .map((r) => ({
      slug: r.slug as string,
      title: r.title as string,
      summary: r.summary,
      heroUrl: r.heroUrl,
      score: r.score != null ? Number(r.score) : null,
      releaseDate: r.releaseDate,
      images: r.images ? [r.images] : null,
      image: coverOf(r),
    }));
  const [featured, ...rest] = items;

  const rightItems = (featured ? rest : items).slice(0, 4);
  const remaining = (featured ? rest : items).slice(4);

  const websiteStructuredData = generateWebsiteStructuredData();
  const gameListStructuredData = generateGameListStructuredData(
    items.map(item => ({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      score: item.score,
    }))
  );

  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <Script
        id="game-list-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameListStructuredData) }}
      />
      <main className="relative isolate">
      {/* soft page backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-600/10 via-sky-400/10 to-transparent" />

      <section className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
        {/* hero header */}
        <header className="mb-[var(--space-8)] sm:mb-[var(--space-10)]">
          <h1 className="bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Fresh indie game reviews. Gorgeous cover art. No fluff.
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Handpicked indie gems with concise reads and honest scores.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/games" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 dark:bg-sky-500 dark:hover:bg-sky-400">Browse all reviews</Link>
            <Link href="/games?sort=score" className="rounded-full border bg-white/60 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-black/5 hover:bg-white dark:bg-gray-900/60 dark:text-gray-200">Top‑rated</Link>
          </div>

          {/* category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["Metroidvania", "Roguelike", "Puzzle", "Narrative"].map((c) => (
              <Link
                key={c}
                href={`/tags/${encodeURIComponent(c.toLowerCase())}`}
                className="rounded-full border bg-white/60 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm ring-1 ring-black/5 transition hover:bg-white dark:bg-gray-900/60 dark:text-gray-200"
              >
                {c}
              </Link>
            ))}
          </div>
        </header>

        {/* top grid: 2 columns on lg - featured left, two-up right */}
        <div className="grid gap-[var(--block-gap)] lg:grid-cols-2">
          {/* FEATURED card */}
          {featured && (
            <article className="group">
              <Link href={`/games/${featured.slug}`} className="block" aria-label={`Read review: ${featured.title}`}>
                <div className="relative overflow-hidden rounded-3xl border bg-white/60 shadow-md ring-1 ring-black/5 transition hover:shadow-xl dark:bg-gray-900/60">
                  <div className="relative">
                    <Image
                      src={featured.image}
                      alt={`${featured.title} cover art`}
                      width={1600}
                      height={900}
                      sizes="(max-width: 1024px) 100vw, 640px"
                      className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      priority
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 sm:p-8">
                      <h2 className="line-clamp-1 text-2xl font-bold text-white sm:text-3xl">
                        {featured.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-white/85">
                        {featured.summary}
                      </p>
                    </div>

                    <span
                      aria-label={typeof featured.score === 'number' ? `Score ${featured.score.toFixed(1)} out of 10` : 'Unscored'}
                      className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${scoreClasses(
                        featured.score
                      )}`}
                    >
                      {typeof featured.score === "number" ? featured.score.toFixed(1) : "–"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 p-[var(--space-4)] sm:p-[var(--space-5)]">
                    {(featured.tags ?? []).slice(0, 4).map((t) => (
                      <Link
                        key={t}
                        href={`/tags/${encodeURIComponent(t.toLowerCase())}`}
                        className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      >
                        {t}
                      </Link>
                    ))}
                    <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition group-hover:translate-x-0.5 dark:text-sky-400">
                      Read review
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* RIGHT: two-up grid of smaller cards */}
          <ul className="grid grid-cols-2 gap-[var(--block-gap)]">
            {rightItems.map((x) => (
              <ReviewCard key={x.slug} {...x} />
            ))}
          </ul>
        </div>

        {/* remaining items */}
        {remaining.length > 0 && (
          <ul className="mt-[var(--space-12)] grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
            {remaining.map((x) => (
              <ReviewCard key={x.slug} {...x} />
            ))}
          </ul>
        )}
      </section>
      </main>
    </>
  );
}