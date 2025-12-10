import SortSelect from '@/components/SortSelect';
import ReviewCard from '@/components/ReviewCard';
import { getReviewsByTag, type SortOrder } from '@/lib/queries';
import { coverOf } from '@/lib/ui-helpers';
import { Locale, getDictionary } from '@/lib/dictionaries';
import { getLocalizedText } from '@/lib/i18n';
// ISR: 1 hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string; tag: string }> }) {
  const { lang: langParam, tag: rawTag } = await params;
  const lang = (langParam as Locale) || 'en';
  const tag = decodeURIComponent(rawTag);
  
  return {
    title: `${tag} – ${lang === 'de' ? 'Indie-Spiele' : 'Indie Games'}`,
    description: lang === 'de' 
      ? `Durchsuche ${tag} Indie-Game Reviews und Bewertungen.`
      : `Browse ${tag} indie game reviews and ratings.`,
    alternates: { canonical: `/${lang}/tags/${encodeURIComponent(tag)}` },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; tag: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const [{ lang: langParam, tag: rawTag }, { sort }] = await Promise.all([params, searchParams]);
  const lang = (langParam as Locale) || 'en';
  const tag = decodeURIComponent(rawTag);
  const dict = await getDictionary(lang);
  
  const validSortOrders: SortOrder[] = ['score', 'publishedAt', 'title', 'releaseDate'];
  const order: SortOrder = validSortOrders.includes(sort as SortOrder)
    ? (sort as SortOrder)
    : 'publishedAt';

  const rows = await getReviewsByTag(tag, order);
  const items = rows
    .filter((r) => r.slug !== null)
    .map((r) => ({
      slug: r.slug as string,
      title: getLocalizedText(r.title, lang),
      image: coverOf(r),
      score: r.score != null ? Number(r.score) : null,
      releaseDate: r.releaseDate,
    }));
  const totalGames = items.length;

  return (
    <main className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <header className="mb-[var(--space-8)] flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {tag} ({totalGames})
        </h1>
        <SortSelect locale={lang} dict={dict} />
      </header>
      <ul className="grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <ReviewCard key={r.slug} {...r} locale={lang} />
        ))}
      </ul>
    </main>
  );
}

