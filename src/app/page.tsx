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
  const editorPicks = rest.slice(0, 3);
  const trending = rest.slice(3, 6);

  return (
    <main className="relative isolate">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-600/10 via-sky-400/10 to-transparent" />
      <section className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
        {/* Featured hero */}
        {featured && (
          <div className="mb-[var(--space-10)]">
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Featured</p>
            <Link href={`/games/${featured.slug}`} className="group block overflow-hidden rounded-3xl border bg-white/60 shadow-md ring-1 ring-black/5 transition hover:shadow-xl dark:bg-gray-900/60">
              <div className="relative">
                <Image
                  src={coverOf(featured)}
                  alt={featured.title}
                  width={1600}
                  height={900}
                  sizes="100vw"
                  className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 sm:p-8">
                  <h2 className="line-clamp-1 text-2xl font-bold text-white sm:text-3xl">{featured.title}</h2>
                  {featured.summary && (
                    <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-white/85">{featured.summary}</p>
                  )}
                </div>
                <span
                  className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${scoreClasses(featured.score)}`}
                >
                  {typeof featured.score === "number" ? featured.score.toFixed(1) : "–"}
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Search and categories */}
        <div className="mb-[var(--space-8)] flex flex-col gap-4">
          <input
            type="search"
            placeholder="Search games..."
            className="w-full rounded-full border border-gray-300 bg-white/70 px-4 py-2 text-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900/60 dark:placeholder-gray-400"
          />
          <div className="flex flex-wrap gap-2 text-sm font-medium">
            {['All', 'New Releases', 'Indie', 'RPG', 'Co-op'].map((c) => (
              <span
                key={c}
                className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-gray-800 ring-1 ring-black/5 dark:bg-gray-800 dark:text-gray-200"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid gap-[var(--block-gap)] lg:grid-cols-3">
          {/* Main list */}
          <div className="lg:col-span-2 space-y-6">
            {rest.map((x) => (
              <article key={x.slug} className="flex gap-4">
                <Link href={`/games/${x.slug}`} className="flex gap-4">
                  <Image
                    src={coverOf(x)}
                    alt={x.title}
                    width={120}
                    height={120}
                    className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="line-clamp-1 font-semibold text-gray-900 dark:text-white">{x.title}</h3>
                      {x.summary && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{x.summary}</p>
                      )}
                    </div>
                  </div>
                </Link>
                <span
                  className={`ml-auto self-start rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${scoreClasses(x.score)}`}
                >
                  {typeof x.score === "number" ? x.score.toFixed(1) : "–"}
                </span>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-[var(--space-8)]">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Editor&apos;s Picks</h3>
              <ul className="space-y-2 text-sm">
                {editorPicks.map((x) => (
                  <li key={x.slug}>
                    <Link href={`/games/${x.slug}`} className="text-gray-800 hover:underline dark:text-gray-300">
                      {x.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Trending</h3>
              <ul className="space-y-2 text-sm">
                {trending.map((x) => (
                  <li key={x.slug}>
                    <Link href={`/games/${x.slug}`} className="text-gray-800 hover:underline dark:text-gray-300">
                      {x.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

