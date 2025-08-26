import { getGameBySlug } from '@/lib/queries';
import { notFound } from 'next/navigation';
import GameHero from '@/components/GameHero';
import MainArticle from '@/components/MainArticle';

export const revalidate = 86400;      // 1 Tag
export const dynamicParams = true;    // neue Slugs sofort möglich

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = decodeURIComponent((await params).slug);
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
  const slug = decodeURIComponent((await params).slug);
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
        images={game.images ?? []}
        releaseDate={game.releaseDate ? new Date(game.releaseDate).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
      />
      <MainArticle
        reviewTitle={game.reviewTitle}
        description={game.description}
        introduction={game.introduction}
        gameplayFeatures={game.gameplayFeatures}
        conclusion={game.conclusion}
        score={game.score ? Number(game.score) : null}
        userOpinion={game.userOpinion}
        images={game.images ?? []}
        pros={game.pros ?? []}
        cons={game.cons ?? []}
      />
    </>
  );
}