import { notFound } from 'next/navigation';
import { getGameBySlug } from '@/lib/queries';
import Hero from '@/components/Hero';
import ArticleBody, { ArticleBlock } from '@/components/ArticleBody';
import ProsCons from '@/components/ProsCons';
import CircularScore from '@/components/CircularScore';
import Section from '@/components/Section';
import FadeIn from '@/components/FadeIn';
import StatPill from '@/components/StatPill';

export const revalidate = 3600;

function splitParagraphs(text?: string): ArticleBlock[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((content) => ({ type: 'paragraph', content }));
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGameBySlug(params.slug);
  if (!game) {
    notFound();
  }

  const blocks: ArticleBlock[] = [
    ...splitParagraphs(game.introduction),
    ...splitParagraphs(game.description),
    ...splitParagraphs(game.gameplayFeatures),
    ...splitParagraphs(game.conclusion),
  ];

  return (
    <main>
      <Hero
        title={game.title}
        subtitle={game.summary ?? undefined}
        images={game.heroUrl ? [{ src: game.heroUrl, alt: game.title }] : []}
        meta={
          <>
            {game.developer && <StatPill icon="👤" label={game.developer} />}
            {game.tags?.map((tag) => (
              <StatPill key={tag} icon="#" label={tag} />
            ))}
            {game.platforms?.map((p) => (
              <StatPill key={p} icon="🎮" label={p} />
            ))}
          </>
        }
      />
      <div className="max-w-3xl mx-auto p-6 space-y-12">
        <FadeIn>
          <ArticleBody blocks={blocks} />
        </FadeIn>
        <FadeIn>
          <ProsCons pros={[]} cons={[]} />
        </FadeIn>
        <FadeIn>
          <Section title="User Reviews">
            <p className="text-text-muted">No reviews yet.</p>
          </Section>
        </FadeIn>
        <FadeIn>
          <Section title="Score" className="flex justify-center">
            <CircularScore value={game.score ?? 0} />
          </Section>
        </FadeIn>
      </div>
    </main>
  );
}
