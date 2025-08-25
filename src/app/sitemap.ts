import { db } from '@/lib/db';
import { games } from '@/lib/schema';

export default async function sitemap() {
  const base = 'https://bestof.games';
  const rows = await db.select({ slug: games.slug }).from(games);
  return [
    { url: `${base}/`, lastModified: new Date() },
    ...rows.map(r => ({ url: `${base}/games/${r.slug}`, lastModified: new Date() })),
  ];
}