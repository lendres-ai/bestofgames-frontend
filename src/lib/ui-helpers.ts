import { PLACEHOLDER_IMAGE } from './constants';

export function scoreClasses(score?: number | null) {
  if (typeof score !== 'number')
    return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  if (score >= 9)
    return 'bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-400/40 dark:text-emerald-300';
  if (score >= 8)
    return 'bg-amber-500/15  text-amber-700  ring-1 ring-amber-400/40  dark:text-amber-300';
  return 'bg-rose-500/15    text-rose-700    ring-1 ring-rose-400/40    dark:text-rose-300';
}

export function coverOf(x: {
  images?: string | string[] | null;
  heroUrl?: string | null;
}) {
  if (Array.isArray(x.images)) {
    return x.images[0] || x.heroUrl || PLACEHOLDER_IMAGE;
  }
  return x.images || x.heroUrl || PLACEHOLDER_IMAGE;
}
