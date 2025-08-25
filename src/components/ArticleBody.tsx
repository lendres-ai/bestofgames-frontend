import Image from 'next/image';
import FadeIn from './FadeIn';

interface ParagraphBlock {
  type: 'paragraph';
  content: string;
}

interface ImageBlock {
  type: 'image';
  content: string; // image url
  caption?: string;
}

export type ArticleBlock = ParagraphBlock | ImageBlock;

export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose prose-invert max-w-none">
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
            <figure className="my-8 overflow-hidden rounded-md transition-transform duration-300 ease-out hover:scale-[1.02] motion-reduce:transition-none">
              <Image
                src={block.content}
                alt={block.caption ?? ''}
                width={800}
                height={450}
                loading="lazy"
                className="w-full object-cover"
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
