import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { games, reviews } from '@/lib/schema';
import { inArray, eq, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slugsParam = searchParams.get('slugs');
  if (!slugsParam) {
    return new Response(JSON.stringify({ error: 'Missing slugs parameter' }), { status: 400 });
  }
  const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean);
  if (slugs.length === 0) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const coverImageSubquery = sql<string>`(
    select gi.url
    from game_images as gi
    where gi.game_id = ${games.id}
    order by gi.sort_order nulls last, gi.id
    limit 1
  )`;

  const rows = await db
    .select({
      slug: games.slug,
      title: games.title,
      heroUrl: games.heroUrl,
      images: coverImageSubquery,
      score: reviews.score,
      releaseDate: games.releaseDate,
    })
    .from(games)
    .leftJoin(reviews, eq(reviews.gameId, games.id))
    .where(inArray(games.slug, slugs));

  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

