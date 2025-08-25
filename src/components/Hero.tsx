import StatPill from './StatPill';
import ImageCarousel from './ImageCarousel';
import FadeIn from './FadeIn';

interface ImageData {
  src: string;
  alt?: string;
}

interface HeroProps {
  title: string;
  subtitle?: string | null;
  tags?: string[];
  images?: ImageData[];
  releaseDate?: string | null;
  publisher?: string | null;
  rating?: number | null;
}

export default function Hero({
  title,
  subtitle,
  tags = [],
  images = [],
  releaseDate,
  publisher,
  rating,
}: HeroProps) {
  return (
    <section className="relative">
      <ImageCarousel images={images} />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-text">
        <FadeIn>
          <h1 className="text-3xl font-bold drop-shadow-lg">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-text-muted drop-shadow">{subtitle}</p>
          )}
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-xs rounded-full bg-surface/70 backdrop-blur text-text"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {releaseDate && (
              <StatPill
                label={releaseDate}
                icon={
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              />
            )}
            {publisher && (
              <StatPill
                label={publisher}
                icon={
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3h18v18H3z" />
                    <path d="M16 21V9H8v12" />
                    <path d="M8 13h8" />
                  </svg>
                }
              />
            )}
            {rating != null && (
              <StatPill
                label={`${rating.toFixed(1)}/10`}
                icon={
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                }
              />
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
