import Image from 'next/image';
import Link from 'next/link';
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
  return (
    <article className="group">
      <Link
        href={`/${locale}/games/${slug}`}
        className="block"
        aria-label={`${dict.home.read_review}: ${title}`}
      >
        <div className="relative overflow-hidden rounded-3xl border bg-white/60 shadow-md ring-1 ring-black/5 transition hover:shadow-xl dark:bg-gray-900/60">
          <div className="relative">
            <Image
              src={image}
              alt={`${title} cover art`}
              width={1600}
              height={900}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 sm:p-8">
              <h2 className="line-clamp-1 text-2xl font-bold text-white sm:text-3xl">
                {title}
              </h2>
              <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-white/85">
                {summary}
              </p>
            </div>

            <span
              aria-label={
                typeof score === 'number'
                  ? dict.common.score_label.replace('{score}', score.toFixed(1))
                  : dict.common.unscored
              }
              className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${scoreClasses(
                score
              )}`}
            >
              {typeof score === 'number' ? score.toFixed(1) : '–'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-[var(--space-4)] sm:p-[var(--space-5)]">
            {tags.slice(0, 4).map((t) => (
              <Link
                key={t}
                href={`/${locale}/tags/${encodeURIComponent(t.toLowerCase())}`}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                {t}
              </Link>
            ))}
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition group-hover:translate-x-0.5 dark:text-sky-400">
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

