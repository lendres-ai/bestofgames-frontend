import SortSelect from '@/components/SortSelect';
import ReviewCard from '@/components/ReviewCard';
import ListViewTracker from '@/components/ListViewTracker';
import { getAllReviews, type SortOrder } from '@/lib/queries';
import { coverOf } from '@/lib/ui-helpers';
import { Locale, getDictionary } from '@/lib/dictionaries';
import { getLocalizedText } from '@/lib/i18n';
// ISR: 1 hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);
  
  return {
    title: dict.metadata.games_title,
    description: dict.metadata.games_description,
    alternates: { canonical: `/${lang}/games` },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const [{ lang: langParam }, { sort }] = await Promise.all([params, searchParams]);
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);
  
  const validSortOrders: SortOrder[] = ['score', 'publishedAt', 'title', 'releaseDate'];
  const order: SortOrder = validSortOrders.includes(sort as SortOrder)
    ? (sort as SortOrder)
    : 'publishedAt';

  const rows = await getAllReviews(order);
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
      <ListViewTracker listType="games" itemCount={totalGames} sortOrder={order} />
      <header className="mb-[var(--space-8)] flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {dict.games.all_games} ({totalGames})
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

