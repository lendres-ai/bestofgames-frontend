import { getGameBySlug } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import ArticleBody, { ArticleBlock } from '@/components/ArticleBody';
import Section from '@/components/Section';
import ProsCons from '@/components/ProsCons';
import StatPill from '@/components/StatPill';
import CircularScore from '@/components/CircularScore';

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
  const images = [game.heroUrl].filter((u): u is string => typeof u === 'string');
  const paragraphs = [
    game.introduction,
    game.description,
    game.gameplayFeatures,
    game.conclusion,
  ].filter((p): p is string => typeof p === 'string');
  const blocks: ArticleBlock[] = [];
  paragraphs.forEach((p, i) => {
    blocks.push({ type: 'paragraph', content: p });
    if (i % 2 === 1 && game.heroUrl) {
      blocks.push({ type: 'image', content: game.heroUrl, caption: game.title });
    }
  });
  if (blocks.length === 0 && game.summary) {
    blocks.push({ type: 'paragraph', content: game.summary });
  }

  return (
    <>
      <Hero
        title={game.title}
        subtitle={game.developer ?? undefined}
        tags={game.tags ?? []}
        images={images}
        score={game.score ? Number(game.score) : null}
      />
      <main className="mx-auto max-w-3xl p-6">
        <Section title="About">
          <ArticleBody blocks={blocks} />
        </Section>
        <Section title="Pros & Cons">
          <ProsCons pros={[]} cons={[]} />
        </Section>
        <Section title="User Reviews">
          <p className="text-text-muted">Community reviews coming soon.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {typeof game.score === 'number' && (
              <StatPill
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                }
                label={`${Number(game.score).toFixed(1)} avg`}
              />
            )}
          </div>
        </Section>
        {typeof game.score === 'number' && (
          <Section title="Score">
            <div className="flex justify-center">
              <CircularScore value={Number(game.score)} />
            </div>
          </Section>
        )}
      </main>
    </>
  );
}