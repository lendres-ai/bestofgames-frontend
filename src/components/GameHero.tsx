import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { CalendarDays, Gamepad2 } from 'lucide-react';
import WishlistButton from './WishlistButton';

interface GameHeroProps {
  title: string;
  developer?: string | null;
  tags?: string[];
  releaseDate?: string | null;
  platforms?: string[];
  score?: number | null; // 0..10
  heroUrl?: string | null;
  images?: string[];
  slug?: string;
}

export default function GameHero({
  title,
  developer,
  tags = [],
  releaseDate,
  platforms = [],
  score,
  heroUrl,
  images = [],
  slug,
}: GameHeroProps) {
  const cover = images[0] || heroUrl || 'https://placehold.co/2000x1500.png';

  const normalized = useMemo(() => {
    const s = typeof score === 'number' ? Math.max(0, Math.min(10, score)) : 0;
    return {
      value10: s,
      value5: s / 2,
      pct: Math.round((s / 10) * 100),
    };
  }, [score]);

  return (
    <section className="relative isolate">
      {/* Soft background gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-600/15 via-sky-400/10 to-transparent" />

      <div className="mx-auto max-w-screen-xl px-4 py-10 md:py-16 2xl:px-0">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Media */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:border-white/5">
            <Image
              src={cover}
              alt={title}
              width={1280}
              height={720}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority
            />
            {/* Overlay label */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 sm:p-6">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {title}
              </h1>
              {(developer || releaseDate) && (
                <p className="mt-1 text-sm text-white/80">
                  {[developer ? `by ${developer}` : null, releaseDate || null]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Score card */}
              <div className="rounded-3xl border bg-white/60 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-gray-900/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Critic Score</span>
                  </div>
                  <span className="font-mono text-3xl font-semibold">
                    {typeof score === 'number' ? score.toFixed(1) : '–'}
                  </span>
                </div>

                

                {/* Progress bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden>
                  <div className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500" style={{ width: `${normalized.pct}%` }} />
                </div>
              </div>

              {/* Tags */}
              {!!tags.length && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Link
                      key={t}
                      href={`/tags/${encodeURIComponent(t.toLowerCase())}`}
                      className="rounded-full border border-transparent bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}

              {/* Platforms */}
              {!!platforms.length && (
                <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {platforms.map((p) => (
                    <div key={p} className="inline-flex items-center gap-2 rounded-xl border bg-white/60 px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-gray-900/60">
                      <Gamepad2 className="h-4 w-4" />
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA area (optional, hidden if you don't need it) */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#main"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Read full review
              </a>
              {slug ? <WishlistButton slug={slug} /> : null}
              {releaseDate && (
                <div className="inline-flex items-center gap-2 rounded-2xl border bg-white/60 px-4 py-2 text-sm shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-gray-900/60">
                  <CalendarDays className="h-4 w-4" /> {releaseDate}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
