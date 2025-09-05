interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      aria-label="Loading..."
      role="status"
    />
  );
}

export function ReviewCardSkeleton() {
  return (
    <li className="group">
      <div className="block overflow-hidden rounded-3xl border bg-white/60 shadow-sm ring-1 ring-black/5 dark:bg-gray-900/60">
        <div className="relative">
          <Skeleton className="h-40 w-full" />
          <div className="absolute right-4 top-4">
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
        <div className="p-[var(--space-4)]">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </li>
  );
}

export function FeaturedGameSkeleton() {
  return (
    <article className="group">
      <div className="block">
        <div className="relative overflow-hidden rounded-3xl border bg-white/60 shadow-md ring-1 ring-black/5 dark:bg-gray-900/60">
          <div className="relative">
            <Skeleton className="h-[320px] w-full" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 sm:p-8">
              <Skeleton className="h-8 w-3/4 mb-2 bg-gray-300" />
              <Skeleton className="h-4 w-full bg-gray-300" />
              <Skeleton className="h-4 w-2/3 mt-1 bg-gray-300" />
            </div>
            <div className="absolute right-5 top-5">
              <Skeleton className="h-6 w-12 rounded-full bg-gray-300" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-[var(--space-4)] sm:p-[var(--space-5)]">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <div className="ml-auto">
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function GameHeroSkeleton() {
  return (
    <section className="relative">
      <div className="relative">
        <Skeleton className="h-[50vh] min-h-[400px] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-screen-xl">
            <Skeleton className="h-10 w-3/4 mb-4 bg-gray-300" />
            <Skeleton className="h-5 w-1/2 mb-2 bg-gray-300" />
            <Skeleton className="h-5 w-1/3 mb-6 bg-gray-300" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-gray-300" />
              <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
              <Skeleton className="h-6 w-14 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MainArticleSkeleton() {
  return (
    <article className="prose prose-lg max-w-none">
      <Skeleton className="h-8 w-2/3 mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="my-8">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div>
          <Skeleton className="h-6 w-16 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <div>
          <Skeleton className="h-6 w-16 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default Skeleton;