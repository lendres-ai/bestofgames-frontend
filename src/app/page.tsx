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
  if (typeof score !== "number")
    return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  if (score >= 9)
    return "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-400/40 dark:text-emerald-300";
  if (score >= 8)
    return "bg-amber-500/15 text-amber-700 ring-1 ring-amber-400/40 dark:text-amber-300";
  return "bg-rose-500/15 text-rose-700 ring-1 ring-rose-400/40 dark:text-rose-300";
}

function coverOf(x: ReviewItem) {
  return x.images?.[0] || x.heroUrl || "https://placehold.co/1200x675.png";
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

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8 2xl:px-0">
      {/* FEATURED HERO */}
      {featured && (
        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide">FEATURED</h2>
          <Link href={`/games/${featured.slug}`} className="block">
            <div className="overflow-hidden rounded-xl">
              <Image
                src={coverOf(featured)}
                alt={featured.title}
                width={1600}
                height={900}
                className="h-64 w-full object-cover"
                priority
              />
            </div>
          </Link>
        </section>
      )}

      {/* SEARCH + CATEGORIES */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search games..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {["All", "New Releases", "Indie", "RPG", "Co-op"].map((c) => (
            <button
              key={c}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        {/* LEFT LIST */}
        <ul className="space-y-6">
          {rest.slice(0, 4).map((r) => (
            <li key={r.slug} className="flex gap-4">
              <Link href={`/games/${r.slug}`} className="flex-shrink-0">
                <Image
                  src={coverOf(r)}
                  alt={r.title}
                  width={160}
                  height={90}
                  className="h-24 w-32 rounded-md object-cover"
                />
              </Link>
              <div className="flex flex-col">
                <Link
                  href={`/games/${r.slug}`}
                  className="font-semibold text-gray-900 hover:underline dark:text-white"
                >
                  {r.title}
                </Link>
                {r.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {r.summary}
                  </p>
                )}
              </div>
              <span
                className={`ml-auto h-fit rounded-md px-2 py-1 text-xs font-semibold ${scoreClasses(r.score)}`}
              >
                {typeof r.score === "number" ? r.score.toFixed(1) : "–"}
              </span>
            </li>
          ))}
        </ul>

        {/* SIDEBAR */}
        <aside className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold tracking-wide">EDITOR&apos;S PICKS</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {rest.slice(4, 7).map((x) => (
                <li key={x.slug}>
                  <Link href={`/games/${x.slug}`} className="hover:underline">
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide">TRENDING</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {rest.slice(7, 10).map((x) => (
                <li key={x.slug}>
                  <Link href={`/games/${x.slug}`} className="hover:underline">
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

