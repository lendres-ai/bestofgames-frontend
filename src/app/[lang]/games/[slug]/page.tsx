import { getGameBySlug, getSimilarGames } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import GameHero from '@/components/GameHero';
import MainArticle from '@/components/MainArticle';
import SimilarGames from '@/components/SimilarGames';
import NewsletterSignup from '@/components/NewsletterSignup';
import { generateGameReviewStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data';
import { Locale, getDictionary } from '@/lib/dictionaries';
import { getLocalizedText, formatLocalizedDate } from '@/lib/i18n';
import { SITE_URL } from '@/lib/constants';

// ISR: 1 day
export const revalidate = 86400;
export const dynamicParams = true;

async function getSteamPriceText(appId: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=DE&l=en`,
      { next: { revalidate: 3600 } } // 1 hour
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

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: langParam, slug: rawSlug } = await params;
  const lang = (langParam as Locale) || 'en';
  const slug = decodeURIComponent(rawSlug);
  const game = await getGameBySlug(slug);
  if (!game) return {};

  const title = getLocalizedText(game.title, lang);
  const summary = getLocalizedText(game.summary, lang);
  const ogImage = (game.images && game.images.length > 0 && game.images[0]) || game.heroUrl || '/logo.png';

  return {
    title: `${title} – Review & Score`,
    description: summary || undefined,
    alternates: { canonical: `/${lang}/games/${slug}` },
    openGraph: { images: ogImage ? [ogImage] : [] }
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: langParam, slug: rawSlug } = await params;
  const lang = (langParam as Locale) || 'en';
  const slug = decodeURIComponent(rawSlug);
  const dict = await getDictionary(lang);

  const game = await getGameBySlug(slug);
  if (!game) return notFound();

  const similarGames = await getSimilarGames(slug);
  const steamPriceText = game.steamAppId
    ? await getSteamPriceText(game.steamAppId)
    : null;

  // Get localized content
  const title = getLocalizedText(game.title, lang);
  const summary = getLocalizedText(game.summary, lang);
  const description = getLocalizedText(game.description, lang);
  const introduction = getLocalizedText(game.introduction, lang);
  const gameplayFeatures = getLocalizedText(game.gameplayFeatures, lang);
  const conclusion = getLocalizedText(game.conclusion, lang);
  const reviewTitle = getLocalizedText(game.reviewTitle, lang);
  const userOpinion = getLocalizedText(game.userOpinion, lang);

  // Localize pros and cons (they're stored as JSONB {de, en} objects)
  const localizedPros = (game.pros ?? []).map(p => getLocalizedText(p, lang));
  const localizedCons = (game.cons ?? []).map(c => getLocalizedText(c, lang));

  const reviewStructuredData = generateGameReviewStructuredData({
    title,
    summary,
    heroUrl: game.heroUrl,
    score: game.score ? Number(game.score) : null,
    developer: game.developer,
    releaseDate: game.releaseDate,
    slug: game.slug,
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: `${SITE_URL}/${lang}` },
    { name: dict.nav.games, url: `${SITE_URL}/${lang}/games` },
    { name: title, url: `${SITE_URL}/${lang}/games/${slug}` },
  ]);

  const formattedReleaseDate = game.releaseDate
    ? formatLocalizedDate(game.releaseDate, lang)
    : undefined;

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
        title={title}
        developer={game.developer}
        tags={(game.tags ?? []).filter((t): t is string => t !== null)}
        platforms={(game.platforms ?? []).filter((p): p is string => p !== null)}
        score={game.score ? Number(game.score) : null}
        heroUrl={game.heroUrl ?? undefined}
        images={(game.images ?? []).filter((i): i is string => i !== null)}
        slug={game.slug}
        releaseDate={formattedReleaseDate}
        steamAppId={game.steamAppId ?? undefined}
        steamPriceText={steamPriceText}
        locale={lang}
        dict={dict}
      />
      <div className={`mx-auto grid gap-8 px-4 ${similarGames.length ? 'lg:grid-cols-[minmax(0,1fr)_300px]' : ''}`}>
        <div className="space-y-8">
          <MainArticle
            reviewTitle={reviewTitle}
            description={description}
            introduction={introduction}
            gameplayFeatures={gameplayFeatures}
            conclusion={conclusion}
            score={game.score ? Number(game.score) : null}
            userOpinion={userOpinion}
            images={(game.images ?? []).filter((i): i is string => i !== null)}
            pros={localizedPros}
            cons={localizedCons}
            dict={dict}
          />
          {/* Newsletter - shown after reading the review */}
          <NewsletterSignup locale={lang} dict={dict} variant="compact" />
        </div>
        {similarGames.length > 0 && (
          <SimilarGames
            games={similarGames.map(g => ({
              slug: g.slug,
              title: getLocalizedText(g.title, lang),
              heroUrl: g.heroUrl,
              images: g.images,
            }))}
            locale={lang}
            dict={dict}
          />
        )}
      </div>
    </>
  );
}

