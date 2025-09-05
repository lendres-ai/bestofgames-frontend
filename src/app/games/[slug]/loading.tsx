import { GameHeroSkeleton, MainArticleSkeleton } from '@/components/SkeletonLoader';

export default function Loading() {
  return (
    <>
      <GameHeroSkeleton />
      <div className="mx-auto grid gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <MainArticleSkeleton />
        <aside className="space-y-4">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-3 bg-white/60 dark:bg-gray-900/60">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}