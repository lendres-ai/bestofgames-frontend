import Image from 'next/image';

interface ParagraphBlock {
  type: 'paragraph';
  content: string;
}

interface ImageBlock {
  type: 'image';
  src: string;
  alt?: string;
  caption?: string;
}

export type ArticleBlock = ParagraphBlock | ImageBlock;

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

export default function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <article className="space-y-6 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === 'image') {
          return (
            <figure key={i} className="overflow-hidden rounded-lg">
              <Image
                src={block.src}
                alt={block.alt ?? ''}
                width={800}
                height={450}
                loading="lazy"
                className="w-full h-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
              />
              {block.caption && (
                <figcaption className="mt-2 text-center text-sm text-text-muted">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        return <p key={i}>{block.content}</p>;
      })}
    </article>
  );
}
