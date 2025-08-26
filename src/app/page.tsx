import Link from "next/link";
import Image from "next/image";
import { getRecentReviews } from "@/lib/queries";

// ISR: 1h
export const revalidate = 3600;

export const metadata = {
  title: "BestOfGames – Indie Gems",
  description: "Fresh, stylish indie reviews with beautiful covers and quick reads.",
};

type ReviewItem = {
  slug: string;
  title: string;
  summary?: string | null;
  images?: string[] | null;
  heroUrl?: string | null;
  tags?: string[] | null;
  platforms?: string[] | null;
  score?: number | null;
};

function scoreClasses(score?: number | null) {
  if (typeof score !== "number") return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  if (score >= 9)  return "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-400/40 dark:text-emerald-300";
  if (score >= 8)  return "bg-amber-500/15  text-amber-700  ring-1 ring-amber-400/40  dark:text-amber-300";
  return "bg-rose-500/15    text-rose-700    ring-1 ring-rose-400/40    dark:text-rose-300";
}

function coverOf(x: ReviewItem) {
  return (x.images?.[0]) || x.heroUrl || "https://placehold.co/1200x675.png";
}

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
      images: r.images ? [r.images] : null,
    }));
  const [featured, ...rest] = items;

  const rightItems = (featured ? rest : items).slice(0, 4);
  const remaining = (featured ? rest : items).slice(4);

  return (
    <main className="relative isolate">
      {/* soft page backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-600/10 via-sky-400/10 to-transparent" />

      <section className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
        {/* hero header */}
        <header className="mb-[var(--space-8)] sm:mb-[var(--space-10)]">
          <h1 className="bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Latest Trends
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Discover the latest trends in the gaming world.
          </p>

          {/* optional category chips (static links; no client JS) */}
          {/* <div className="mt-4 flex flex-wrap gap-2">
            {["Metroidvania", "Roguelike", "Puzzle", "Narrative"].map((c) => (
              <Link
                key={c}
                href={`/tags/${encodeURIComponent(c.toLowerCase())}`}
                className="rounded-full border bg-white/60 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm ring-1 ring-black/5 transition hover:bg-white dark:bg-gray-900/60 dark:text-gray-200"
              >
                {c}
              </Link>
            ))}
          </div> */}
        </header>

        {/* top grid: 2 columns on lg - featured left, two-up right */}
        <div className="grid gap-[var(--block-gap)] lg:grid-cols-2">
          {/* FEATURED card */}
          {featured && (
            <article className="group">
              <Link href={`/games/${featured.slug}`} className="block">
                <div className="relative overflow-hidden rounded-3xl border bg-white/60 shadow-md ring-1 ring-black/5 transition hover:shadow-xl dark:bg-gray-900/60">
                  <div className="relative">
                    <Image
                      src={coverOf(featured)}
                      alt={featured.title}
                      width={1600}
                      height={900}
                      sizes="(max-width: 1024px) 100vw, 50vw"
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
                        href={`/tags/${encodeURIComponent(t)}`}
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
          <div className="grid grid-cols-2 gap-[var(--block-gap)]">
            {rightItems.map((x) => (
              <article key={x.slug} className="group">
                <Link href={`/games/${x.slug}`} className="block">
                  <div className="overflow-hidden rounded-3xl border bg-white/60 shadow-sm ring-1 ring-black/5 transition hover:shadow-lg dark:bg-gray-900/60">
                    <div className="relative">
                      <Image
                        src={coverOf(x)}
                        alt={x.title}
                        width={1200}
                        height={675}
                        sizes="(max-width: 1024px) 100vw, 25vw"
                        className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span
                        className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${scoreClasses(
                          x.score
                        )}`}
                      >
                        {typeof x.score === "number" ? x.score.toFixed(1) : "–"}
                      </span>
                    </div>
                    <div className="p-[var(--space-4)]">
                      <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                        {x.title}
                      </h3>
                      {x.summary && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{x.summary}</p>
                      )}
                      {!!(x.tags?.length) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {x.tags!.slice(0, 3).map((t) => (
                            <Link
                              key={t}
                              href={`/tags/${encodeURIComponent(t)}`}
                              className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                            >
                              {t}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* remaining items */}
        {remaining.length > 0 && (
          <ul className="mt-[var(--space-12)] grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
            {remaining.map((x) => (
              <li key={x.slug} className="group">
                <Link href={`/games/${x.slug}`} className="block">
                  <article className="overflow-hidden rounded-3xl border bg-white/60 shadow-sm ring-1 ring-black/5 transition hover:shadow-lg dark:bg-gray-900/60">
                    <div className="relative">
                      <Image
                        src={coverOf(x)}
                        alt={x.title}
                        width={1200}
                        height={675}
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span
                        className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${scoreClasses(
                          x.score
                        )}`}
                      >
                        {typeof x.score === "number" ? x.score.toFixed(1) : "–"}
                      </span>
                    </div>
                    <div className="p-[var(--space-4)]">
                      <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                        {x.title}
                      </h3>
                      {x.summary && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{x.summary}</p>
                      )}
                      {!!(x.tags?.length) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {x.tags!.slice(0, 3).map((t) => (
                            <Link
                              key={t}
                              href={`/tags/${encodeURIComponent(t)}`}
                              className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                            >
                              {t}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}