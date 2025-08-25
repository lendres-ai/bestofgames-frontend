import { getGameBySlug } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import ArticleBody, { ArticleBlock } from '@/components/ArticleBody';
import ProsCons from '@/components/ProsCons';
import Section from '@/components/Section';
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

  const text = [
    game.introduction,
    game.description,
    game.gameplayFeatures,
    game.conclusion,
  ]
    .filter(Boolean)
    .join('\n\n');

  const blocks: ArticleBlock[] = text
    .split(/\n+/)
    .filter(Boolean)
    .flatMap((p, i) => {
      const arr: ArticleBlock[] = [{ type: 'paragraph', content: p }];
      if ((i + 1) % 2 === 0 && game.heroUrl) {
        arr.push({ type: 'image', src: game.heroUrl, alt: game.title });
      }
      return arr;
    });

  return (
    <>
      <Hero
        title={game.title}
        subtitle={game.developer}
        tags={game.tags ?? []}
        images={game.heroUrl ? [{ src: game.heroUrl, alt: game.title }] : []}
        score={game.score ? Number(game.score) : null}
      />
      <Section title="About the game">
        <ArticleBody blocks={blocks.length ? blocks : [{ type: 'paragraph', content: game.summary ?? '' }]} />
      </Section>
      <Section title="Pros & Cons">
        <ProsCons pros={[]} cons={[]} />
      </Section>
      <Section title="User Reviews">
        <p className="text-text-muted">Community sentiment not yet available.</p>
      </Section>
      <Section title="Score">
        {typeof game.score === 'number' ? (
          <CircularScore value={Number(game.score)} size={120} />
        ) : (
          <p className="text-text-muted">No score yet.</p>
        )}
      </Section>
    </>
  );
}