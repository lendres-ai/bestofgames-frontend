import SortSelect from '@/components/SortSelect';
import ReviewCard, { ReviewCardProps } from '@/components/ReviewCard';
import { getReviewsByTag } from '@/lib/queries';
import { coverOf } from '@/lib/ui-helpers';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `${tag} – Indie Games`,
    description: `Browse ${tag} indie game reviews and ratings.`,
    alternates: { canonical: `/tags/${encodeURIComponent(tag)}` },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { tag: string };
  searchParams: { sort?: string };
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

  const rows = await getReviewsByTag(decodeURIComponent(params.tag), order);
  const items: ReviewCardProps[] = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    image: coverOf(r),
    score: r.score != null ? Number(r.score) : null,
    releaseDate: r.releaseDate,
  }));
  const totalGames = items.length;

  return (
    <main className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <header className="mb-[var(--space-8)] flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {decodeURIComponent(params.tag)} ({totalGames})
        </h1>
        <SortSelect />
      </header>
      <ul className="grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <ReviewCard key={r.slug} {...r} />
        ))}
      </ul>
    </main>
  );
}
