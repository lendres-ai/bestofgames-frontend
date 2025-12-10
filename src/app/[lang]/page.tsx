import Link from "next/link";
import Script from "next/script";
import ReviewCard from "@/components/ReviewCard";
import FeaturedGameCard from "@/components/FeaturedGameCard";
import RandomGameButton from "@/components/RandomGameButton";
import { getRecentReviews } from "@/lib/queries";
import { coverOf } from "@/lib/ui-helpers";
import { generateWebsiteStructuredData, generateGameListStructuredData } from "@/lib/structured-data";
import { Locale, getDictionary } from "@/lib/dictionaries";
import { getLocalizedText } from "@/lib/i18n";
// ISR: 1 hour
export const revalidate = 3600;

type ReviewItem = {
  slug: string;
  title: string;
  summary?: string | null;
  heroUrl?: string | null;
  score?: number | null;
  releaseDate?: Date | null;
  images?: string | null;
  image: string;
  tags?: string[] | null;
  platforms?: string[] | null;
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);
  const rows = await getRecentReviews();
  
  const items: ReviewItem[] = rows
    .filter((r) => r.slug && r.title)
    .map((r) => ({
      slug: r.slug as string,
      title: getLocalizedText(r.title, lang),
      summary: getLocalizedText(r.summary, lang),
      heroUrl: r.heroUrl,
      score: r.score != null ? Number(r.score) : null,
      releaseDate: r.releaseDate,
      images: r.images ? r.images : null,
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

  const categories = [
    { key: "metroidvania", label: dict.home.categories.metroidvania },
    { key: "roguelike", label: dict.home.categories.roguelike },
    { key: "puzzle", label: dict.home.categories.puzzle },
    { key: "narrative", label: dict.home.categories.narrative },
  ];

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
            {dict.home.hero_title}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {dict.home.hero_subtitle}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/${lang}/games`} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 dark:bg-sky-500 dark:hover:bg-sky-400">{dict.home.browse_all}</Link>
            <Link href={`/${lang}/games?sort=score`} className="rounded-full border bg-white/60 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-black/5 hover:bg-white dark:bg-gray-900/60 dark:text-gray-200">{dict.home.top_rated}</Link>
            <RandomGameButton locale={lang} label={dict.home.surprise_me} />
          </div>

          {/* category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.key}
                href={`/${lang}/tags/${encodeURIComponent(c.key)}`}
                className="rounded-full border bg-white/60 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm ring-1 ring-black/5 transition hover:bg-white dark:bg-gray-900/60 dark:text-gray-200"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </header>

        {/* top grid: 2 columns on lg - featured left, two-up right */}
        <div className="grid gap-[var(--block-gap)] lg:grid-cols-2">
          {featured && (
            <FeaturedGameCard
              slug={featured.slug}
              title={featured.title}
              summary={featured.summary}
              image={featured.image}
              score={featured.score}
              tags={featured.tags ?? []}
              locale={lang}
              dict={dict}
            />
          )}

          {/* RIGHT: two-up grid of smaller cards */}
          <ul className="grid grid-cols-2 gap-[var(--block-gap)]">
            {rightItems.map((x) => (
              <ReviewCard key={x.slug} slug={x.slug} title={x.title} image={x.image} score={x.score} releaseDate={x.releaseDate} locale={lang} />
            ))}
          </ul>
        </div>

        {/* remaining items */}
        {remaining.length > 0 && (
          <ul className="mt-[var(--space-12)] grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
            {remaining.map((x) => (
              <ReviewCard key={x.slug} slug={x.slug} title={x.title} image={x.image} score={x.score} releaseDate={x.releaseDate} locale={lang} />
            ))}
          </ul>
        )}
      </section>
      </main>
    </>
  );
}

