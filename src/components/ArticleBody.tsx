import Image from 'next/image';

export type ArticleBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

export default function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="prose prose-invert max-w-none">
      {blocks.map((block, i) =>
        block.type === 'paragraph' ? (
          <p key={i}>{block.content}</p>
        ) : (
          <figure
            key={i}
            className="my-6 overflow-hidden rounded-lg transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <Image
              src={block.src}
              alt={block.alt}
              width={800}
              height={450}
              loading="lazy"
              className="h-auto w-full"
            />
            {block.caption && (
              <figcaption className="mt-2 text-center text-sm text-text-muted">
                {block.caption}
              </figcaption>
            )}
          </figure>
        )
      )}
    </div>
  );
}

