import Image from 'next/image';
import Link from 'next/link';
import { scoreClasses } from '@/lib/ui-helpers';

export type ReviewCardProps = {
  slug: string;
  title: string;
  image: string;
  score?: number | null;
  releaseDate?: Date | string | null;
};

export default function ReviewCard({
  slug,
  title,
  image,
  score,
  releaseDate,
}: ReviewCardProps) {
  return (
    <li className="group">
      <Link
        href={`/games/${slug}`}
        className="block overflow-hidden rounded-3xl border bg-white/60 shadow-sm ring-1 ring-black/5 transition hover:shadow-lg dark:bg-gray-900/60"
      >
        <div className="relative">
          <Image
            src={image}
            alt={`${title} cover art`}
            width={1200}
            height={675}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span
            aria-label={typeof score === 'number' ? `Score ${score.toFixed(1)} out of 10` : 'Unscored'}
            className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${scoreClasses(
              score,
            )}`}
          >
            {typeof score === 'number' ? score.toFixed(1) : '–'}
          </span>
        </div>
        <div className="p-[var(--space-4)]">
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <p
            className={`mt-1 h-5 text-sm ${
              releaseDate ? 'text-gray-600 dark:text-gray-300' : 'invisible'
            }`}
          >
            {releaseDate
              ? new Date(releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'placeholder'}
          </p>
        </div>
      </Link>
    </li>
  );
}

