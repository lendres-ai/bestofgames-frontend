import { getGameBySlug } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import ArticleBody, { ArticleBlock } from '@/components/ArticleBody';
import ProsCons from '@/components/ProsCons';
import FadeIn from '@/components/FadeIn';
import CircularScore from '@/components/CircularScore';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return {};
  return {
    title: `${game.title} – Review & Score`,
    description: game.summary ?? undefined,
    alternates: { canonical: `/games/${slug}` },
    openGraph: { images: game.heroUrl ? [game.heroUrl] : [] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return notFound();

  const blocks: ArticleBlock[] = [];
  if (game.introduction) blocks.push({ type: 'paragraph', content: game.introduction });
  if (game.description) blocks.push({ type: 'paragraph', content: game.description });
  if (game.gameplayFeatures) blocks.push({ type: 'paragraph', content: game.gameplayFeatures });
  if (game.heroUrl && blocks.length > 2) {
    blocks.splice(2, 0, {
      type: 'image',
      src: game.heroUrl,
      alt: `${game.title} screenshot`,
      caption: game.title,
    });
  }
  if (game.conclusion) blocks.push({ type: 'paragraph', content: game.conclusion });

  return (
    <>
      <Hero
        title={game.title}
        subtitle={game.developer}
        tags={game.tags ?? []}
        images={game.heroUrl ? [{ src: game.heroUrl, alt: game.title }] : []}
        rating={game.score ? Number(game.score) : null}
      />
      <Section>
        <ArticleBody blocks={blocks} />
      </Section>
      <Section title="Pros & Cons">
        <ProsCons pros={[]} cons={[]} />
      </Section>
      <Section title="User Reviews Summary">
        <FadeIn>
          <p className="text-text-muted">No reviews yet.</p>
        </FadeIn>
      </Section>
      <Section title="Score">
        {game.score != null ? (
          <FadeIn className="flex justify-center">
            <CircularScore value={Number(game.score)} />
          </FadeIn>
        ) : (
          <p className="text-text-muted">No score yet.</p>
        )}
      </Section>
    </>
  );
}
