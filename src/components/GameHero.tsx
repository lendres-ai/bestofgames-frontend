import Image from 'next/image';

interface GameHeroProps {
  title: string;
  developer?: string | null;
  tags?: string[];
  platforms?: string[];
  score?: number | null;
  heroUrl?: string | null;
}

export default function GameHero({
  title,
  developer,
  tags = [],
  platforms = [],
  score,
  heroUrl,
}: GameHeroProps) {
  const starCount = Math.round(score ?? 0);
  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          {heroUrl && (
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <Image
                className="w-full h-auto"
                src={heroUrl}
                alt=""
                width={640}
                height={480}
              />
            </div>
          )}

          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {title}
            </h1>
            {developer && (
              <p className="mt-1 text-gray-600 dark:text-gray-300">by {developer}</p>
            )}
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < starCount ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-600'}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                {(score ?? 0).toFixed(1)}
              </p>
            </div>
            {platforms.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
