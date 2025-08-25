import { getGameBySlug } from '@/lib/queries';
import { notFound } from 'next/navigation';
import GameHero from '@/components/GameHero';


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
    <>
      <GameHero
        title={game.title}
        developer={game.developer}
        tags={game.tags ?? []}
        platforms={game.platforms ?? []}
        score={game.score ? Number(game.score) : null}
        heroUrl={game.heroUrl ?? undefined}
        releaseDate={game.releaseDate ? new Date(game.releaseDate).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
      />
      <article className="mx-auto max-w-3xl p-6 prose">
        <p>{game.summary}</p>
        {/* Markdown-Body könntest du später mit e.g. marked/rehype rendern */}
      </article>
    </>
  );
}