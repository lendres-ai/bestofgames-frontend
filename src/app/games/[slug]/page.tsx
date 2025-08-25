import { getGameBySlug } from '@/lib/queries';
import { notFound } from 'next/navigation';

export const revalidate = 86400;      // 1 Tag
export const dynamicParams = true;    // neue Slugs sofort möglich

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return {};
  return {
    title: `${game.title} – Review & Score`,
    description: game.summary ?? undefined,
    alternates: { canonical: `/games/${slug}` },
    openGraph: { images: game.heroUrl ? [game.heroUrl] : [] }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return notFound();

  return (
    <article className="mx-auto max-w-3xl p-6 prose">
      <h1>{game.title}</h1>
      <p>{game.summary}</p>
      <p><strong>Score:</strong> {game.score ?? '—'}</p>
      {game.userOpinion ? (
        <aside>
          <h2>User opinion</h2>
          <p>{game.userOpinion}</p>
        </aside>
      ) : null}
      {/* Markdown-Body könntest du später mit e.g. marked/rehype rendern */}
    </article>
  );
}