import ImageCarousel from './ImageCarousel';
import CircularScore from './CircularScore';
import StatPill from './StatPill';

interface HeroProps {
  title: string;
  subtitle?: string;
  tags?: string[];
  images: string[];
  releaseDate?: string | null;
  publisher?: string | null;
  rating?: string | null;
  score?: number | null;
}

export default function Hero({
  title,
  subtitle,
  tags = [],
  images,
  releaseDate,
  publisher,
  rating,
  score,
}: HeroProps) {
  return (
    <section className="relative text-text">
      <ImageCarousel images={images} alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 to-bg/30" />
      {score !== null && score !== undefined && (
        <div className="absolute right-4 top-4">
          <CircularScore value={score} size={80} />
        </div>
      )}
      <div className="absolute bottom-4 left-4 space-y-3">
        <h1 className="text-3xl font-bold leading-tight">{title}</h1>
        {subtitle && <p className="text-text-muted">{subtitle}</p>}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 text-xs">
          {releaseDate && (
            <StatPill
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M6.75 3v2.25m10.5-2.25V5.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75z" />
                  <path d="M3 10.5h18" />
                </svg>
              }
              label={releaseDate}
            />
          )}
          {publisher && (
            <StatPill
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 3a6.75 6.75 0 1 1 0 13.5 6.75 6.75 0 0 1 0-13.5z" />
                </svg>
              }
              label={publisher}
            />
          )}
          {rating && (
            <StatPill
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              }
              label={rating}
            />
          )}
        </div>
      </div>
    </section>
  );
}
