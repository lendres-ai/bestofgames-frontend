'use client';

import ImageCarousel from './ImageCarousel';
import StatPill from './StatPill';
import CircularScore from './CircularScore';

interface HeroProps {
  title: string;
  subtitle?: string | null;
  tags?: string[];
  meta?: {
    releaseDate?: string | null;
    publisher?: string | null;
    rating?: string | null;
  };
  images: { src: string; alt: string }[];
  score?: number | null;
}

export default function Hero({
  title,
  subtitle,
  tags = [],
  meta = {},
  images,
  score,
}: HeroProps) {
  return (
    <section className="relative h-96 w-full">
      <ImageCarousel images={images} />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 to-bg/20" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-text">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{title}</h1>
          {subtitle && <p className="text-text-muted">{subtitle}</p>}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-bg/60 px-2 py-1 text-xs text-text"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {(meta.releaseDate || meta.publisher || meta.rating) && (
          <div className="flex flex-wrap gap-2">
            {meta.releaseDate && (
              <StatPill icon={<span aria-hidden>📅</span>} label={meta.releaseDate} />
            )}
            {meta.publisher && (
              <StatPill icon={<span aria-hidden>🏢</span>} label={meta.publisher} />
            )}
            {meta.rating && (
              <StatPill icon={<span aria-hidden>⭐</span>} label={meta.rating} />
            )}
          </div>
        )}
      </div>
      {typeof score === 'number' && (
        <div className="absolute bottom-6 right-6">
          <CircularScore value={score} size={80} />
        </div>
      )}
    </section>
  );
}

