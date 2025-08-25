import Image from 'next/image';
import FadeIn from './FadeIn';

export type ArticleBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'image'; src: string; alt?: string; caption?: string };

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

export default function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="space-y-4 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === 'paragraph') {
          return (
            <FadeIn key={i}>
              <p>{block.content}</p>
            </FadeIn>
          );
        }
        return (
          <FadeIn key={i}>
            <figure className="my-6 overflow-hidden rounded-lg">
              <Image
                src={block.src}
                alt={block.alt || ''}
                width={800}
                height={450}
                loading="lazy"
                className="w-full h-auto transition-transform duration-300 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
              />
              {block.caption && (
                <figcaption className="mt-2 text-center text-sm text-text-muted">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          </FadeIn>
        );
      })}
    </div>
  );
}
