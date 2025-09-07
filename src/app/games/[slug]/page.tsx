import { getGameBySlug, getSimilarGames } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import GameHero from '@/components/GameHero';
import MainArticle from '@/components/MainArticle';
import SimilarGames from '@/components/SimilarGames';
import { generateGameReviewStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data';

export const revalidate = 86400;      // 1 Tag
export const dynamicParams = true;    // neue Slugs sofort möglich

async function getSteamPriceText(appId: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=DE&l=en`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const entry = json?.[appId];
    if (!entry?.success) return null;
    const data = entry.data;
    if (data?.is_free) return 'Free';
    const po = data?.price_overview;
    if (!po) return null;
    return po.final_formatted ?? (po.final ? `${(po.final / 100).toFixed(2)} ${po.currency}` : null);
  } catch {
    return null;
  }
}

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
    const similarGames = await getSimilarGames(slug);
    const steamPriceText = (game as any).steamAppId ? await getSteamPriceText((game as any).steamAppId as number) : null;

    const reviewStructuredData = generateGameReviewStructuredData({
      title: game.title,
      summary: game.summary,
      heroUrl: game.heroUrl,
      score: game.score ? Number(game.score) : null,
      developer: game.developer,
      releaseDate: game.releaseDate,
      slug: game.slug,
    });

    const breadcrumbStructuredData = generateBreadcrumbStructuredData([
      { name: 'Home', url: 'https://bestof.games' },
      { name: 'Games', url: 'https://bestof.games/games' },
      { name: game.title, url: `https://bestof.games/games/${slug}` },
    ]);

    return (
      <>
        <Script
          id="game-review-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewStructuredData) }}
        />
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
        <GameHero
          title={game.title}
          developer={game.developer}
          tags={game.tags ?? []}
          platforms={game.platforms ?? []}
          score={game.score ? Number(game.score) : null}
          heroUrl={game.heroUrl ?? undefined}
          images={game.images ?? []}
          releaseDate={game.releaseDate ? new Date(game.releaseDate).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
          steamAppId={(game as any).steamAppId as number | undefined}
          steamPriceText={steamPriceText}
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