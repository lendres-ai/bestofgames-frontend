import { getGameBySlug, getSimilarGames } from '@/lib/queries';
import { notFound } from 'next/navigation';
import GameHero from '@/components/GameHero';
import MainArticle from '@/components/MainArticle';
import SimilarGames from '@/components/SimilarGames';

export const revalidate = 86400;      // 1 Tag
export const dynamicParams = true;    // neue Slugs sofort möglich

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const game = await getGameBySlug(decoded);
  if (!game) return {};
  return {
    title: `${game.title} – Review & Score`,
    description: game.summary ?? undefined,
    alternates: { canonical: `/games/${decoded}` },
    openGraph: { images: game.heroUrl ? [game.heroUrl] : [] }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const {slug, locale} = await params;
    const decoded = decodeURIComponent(slug);
    const game = await getGameBySlug(decoded);
    if (!game) return notFound();
    const similarGames = await getSimilarGames(decoded);

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
          releaseDate={game.releaseDate ? new Date(game.releaseDate).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
        />
        <div className={`mx-auto grid gap-8 px-4 ${similarGames.length ? 'lg:grid-cols-[minmax(0,1fr)_300px]' : ''}`}>
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
          {similarGames.length > 0 && <SimilarGames games={similarGames} />}
        </div>
      </>
    );
}