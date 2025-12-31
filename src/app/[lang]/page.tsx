import Link from "next/link";
import Script from "next/script";
import ReviewCard from "@/components/ReviewCard";
import FeaturedGameCard from "@/components/FeaturedGameCard";
import HeroCoverGrid from "@/components/HeroCoverGrid";
import RandomGameButton from "@/components/RandomGameButton";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getRecentReviews, getReviewCount } from "@/lib/queries";
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
  const [rows, reviewCount] = await Promise.all([
    getRecentReviews(),
    getReviewCount()
  ]);

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

  // Prepare covers for the animated hero background (top 12 scored)
  const heroCovers = items.slice(0, 12).map(item => ({
    slug: item.slug,
    title: item.title,
    image: item.image,
  }));

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
        {/* Animated cover grid background */}
        <HeroCoverGrid covers={heroCovers} />

        <section className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
          {/* hero header */}
          <header className="mb-[var(--space-4)] sm:mb-[var(--space-6)]">
            <h1 className="bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              {dict.home.hero_title}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300 sm:mt-2">
              {dict.home.hero_subtitle}
            </p>
            {/* Social proof */}
            <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
              ✨ {Math.floor(reviewCount / 10) * 10}+ {lang === 'de' ? 'kuratierte Indie-Game Reviews' : 'curated indie game reviews'}
            </p>
            {/* Primary CTA first */}
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
              <a
                href="#newsletter"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {dict.home.newsletter_cta}
              </a>
              <RandomGameButton locale={lang} label={dict.home.surprise_me} />
              <Link href={`/${lang}/games`} className="rounded-full border bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-black/5 hover:bg-white dark:bg-gray-900/60 dark:text-gray-300 sm:px-4 sm:py-2 sm:text-sm">{dict.home.browse_all}</Link>
              <Link href={`/${lang}/games?sort=score`} className="rounded-full border bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-black/5 hover:bg-white dark:bg-gray-900/60 dark:text-gray-300 sm:px-4 sm:py-2 sm:text-sm">{dict.home.top_rated}</Link>
            </div>

            {/* category chips */}
            <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
              {categories.map((c) => (
                <Link
                  key={c.key}
                  href={`/${lang}/tags/${encodeURIComponent(c.key)}`}
                  className="rounded-full border bg-white/60 px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm ring-1 ring-black/5 transition hover:bg-white dark:bg-gray-900/60 dark:text-gray-300 sm:px-3 sm:py-1 sm:text-xs"
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

          {/* Newsletter signup - strategically placed after featured content */}
          <div id="newsletter" className="mt-[var(--space-12)] scroll-mt-24">
            <NewsletterSignup locale={lang} dict={dict} />
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

