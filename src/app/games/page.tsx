import SortSelect from '@/components/SortSelect';
import ReviewCard, { ReviewCardProps } from '@/components/ReviewCard';
import SearchBar from '@/components/SearchBar';
import TagSelect from '@/components/TagSelect';
import { getAllReviews, getReviewsByTag, getAllTags } from '@/lib/queries';
import { coverOf } from '@/lib/ui-helpers';

export const revalidate = 3600;

export default async function Page({
  searchParams,
}: {
  searchParams: { sort?: string; search?: string; tag?: string };
}) {
  const order = ['score', 'publishedAt', 'title', 'releaseDate'].includes(
    searchParams.sort ?? ''
  )
    ? (searchParams.sort as
        | 'score'
        | 'publishedAt'
        | 'title'
        | 'releaseDate')
    : 'publishedAt';

  const tag = searchParams.tag;
  const term = searchParams.search?.toLowerCase() ?? '';

  const [rows, allTags] = await Promise.all([
    tag ? getReviewsByTag(tag, order) : getAllReviews(order),
    getAllTags(),
  ]);

  const filtered = term
    ? rows.filter((r) => r.title.toLowerCase().includes(term))
    : rows;

  const items: ReviewCardProps[] = filtered.map((r) => ({
    slug: r.slug,
    title: r.title,
    image: coverOf(r),
    score: r.score != null ? Number(r.score) : null,
    releaseDate: r.releaseDate,
  }));
  const totalGames = items.length;

  return (
    <main className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <header className="mb-[var(--space-8)] flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          All Games ({totalGames})
        </h1>
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <SearchBar />
          <TagSelect tags={allTags} />
          <SortSelect />
        </div>
      </header>
      <ul className="grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <ReviewCard key={r.slug} {...r} />
        ))}
      </ul>
    </main>
  );
}
