'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';
import { scoreClasses } from '@/lib/ui-helpers';
import { type Locale, type Dictionary } from '@/lib/dictionaries';

interface FeaturedGameCardProps {
  slug: string;
  title: string;
  summary?: string | null;
  image: string;
  score?: number | null;
  tags?: string[];
  locale: Locale;
  dict: Dictionary;
}

export default function FeaturedGameCard({
  slug,
  title,
  summary,
  image,
  score,
  tags = [],
  locale,
  dict,
}: FeaturedGameCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // 3D tilt effect (max 8 degrees)
    const rotateX = (y - 0.5) * -16;
    const rotateY = (x - 0.5) * 16;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlarePosition({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform('');
  }, []);

  // Determine if score is high (8+) for pulsing glow
  const isHighScore = typeof score === 'number' && score >= 8;

  return (
    <article className="group">
      <Link
        href={`/${locale}/games/${slug}`}
        className="block"
        aria-label={`${dict.home.read_review}: ${title}`}
        data-umami-event="Featured Game Click" data-umami-event-game={slug}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform, transition: transform ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out' }}
          className={`featured-card relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-lg ring-1 ring-white/10 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl dark:border-white/10 dark:bg-gray-900/40 ${isHighScore ? 'high-score-glow' : ''}`}
        >
          {/* Glare effect */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
            }}
          />

          <div className="relative">
            <Image
              src={image}
              alt={`${title} cover art`}
              width={1600}
              height={900}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="h-[320px] w-full object-cover"
              referrerPolicy="no-referrer"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 sm:p-8">
              <h2 className="line-clamp-1 text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
                {title}
              </h2>
              <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-white/90">
                {summary}
              </p>
            </div>

            {/* Score badge with pulse for high scores */}
            <span
              aria-label={
                typeof score === 'number'
                  ? dict.common.score_label.replace('{score}', score.toFixed(1))
                  : dict.common.unscored
              }
              className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-semibold shadow-lg backdrop-blur-md ${scoreClasses(score)} ${isHighScore ? 'score-pulse' : ''}`}
            >
              {typeof score === 'number' ? score.toFixed(1) : '–'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/30 p-[var(--space-4)] backdrop-blur-sm dark:bg-gray-900/30 sm:p-[var(--space-5)]">
            {tags.slice(0, 4).map((t) => (
              <Link
                key={t}
                href={`/${locale}/tags/${encodeURIComponent(t.toLowerCase())}`}
                className="rounded-full border border-gray-200/50 bg-white/60 px-2.5 py-1 text-[11px] font-medium text-gray-800 backdrop-blur-sm transition hover:bg-white dark:border-gray-700/50 dark:bg-gray-800/60 dark:text-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                {t}
              </Link>
            ))}
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition group-hover:translate-x-1 dark:text-sky-400">
              {dict.home.read_review}
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
