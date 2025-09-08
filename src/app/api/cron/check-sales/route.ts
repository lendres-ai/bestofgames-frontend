import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { games, priceSnapshots, pushSubscriptions, sentNotifications, subscriptionGames } from '@/lib/schema';
import { and, desc, eq, gt, inArray, sql } from 'drizzle-orm';
import { sendPush } from '@/lib/push';

// Simple helper to require a secret header
function authorize(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader === `Bearer ${expected}`) return true;

  // Fallback for manual/local triggering with a custom header
  const provided = req.headers.get('x-cron-secret');
  return provided === expected;
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Strategy: find latest on-sale snapshots per game/store in the last 24h
  const since = sql`now() - interval '24 hours'`;
  const onSale = await db
    .select({
      gameId: priceSnapshots.gameId,
      store: priceSnapshots.store,
      priceFinal: priceSnapshots.priceFinal,
      discountPercent: priceSnapshots.discountPercent,
      fetchedAt: priceSnapshots.fetchedAt,
    })
    .from(priceSnapshots)
    .where(and(eq(priceSnapshots.isOnSale, true), gt(priceSnapshots.fetchedAt, since)))
    .orderBy(desc(priceSnapshots.fetchedAt));

  if (onSale.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  // Collect all gameIds
  const gameIds = Array.from(new Set(onSale.map((s) => s.gameId)));
  if (gameIds.length === 0) return NextResponse.json({ ok: true, sent: 0 });

  // Find subscriptions interested in these games
  const subsForGames = await db
    .select({ subscriptionId: subscriptionGames.subscriptionId, gameId: subscriptionGames.gameId })
    .from(subscriptionGames)
    .where(inArray(subscriptionGames.gameId, gameIds));

  if (subsForGames.length === 0) return NextResponse.json({ ok: true, sent: 0 });

  // Map subscriptionId -> rows
  const subscriptionIds = Array.from(new Set(subsForGames.map((r) => r.subscriptionId)));
  const subs = await db
    .select({ id: pushSubscriptions.id, endpoint: pushSubscriptions.endpoint, p256dh: pushSubscriptions.p256dh, auth: pushSubscriptions.auth })
    .from(pushSubscriptions)
    .where(inArray(pushSubscriptions.id, subscriptionIds));

  const gameInfo = await db
    .select({ id: games.id, slug: games.slug, title: games.title, heroUrl: games.heroUrl })
    .from(games)
    .where(inArray(games.id, gameIds));
  const gameIdToInfo = new Map(gameInfo.map((g) => [g.id, g] as const));

  let sentCount = 0;

  // Send for each (subscription, game) pair using the latest snapshot data
  for (const row of subsForGames) {
    const sub = subs.find((s) => s.id === row.subscriptionId);
    if (!sub) continue;
    const game = gameIdToInfo.get(row.gameId);
    if (!game) continue;
    const latest = onSale.find((s) => s.gameId === row.gameId);
    if (!latest) continue;

    // Dedupe key: gameId-store-priceFinal
    const dedupeKey = `${row.gameId}:${latest.store}:${latest.priceFinal ?? ''}`;
    const already = await db
      .select({ id: sentNotifications.id })
      .from(sentNotifications)
      .where(and(
        eq(sentNotifications.subscriptionId, row.subscriptionId),
        eq(sentNotifications.gameId, row.gameId),
        eq(sentNotifications.store, latest.store),
        eq(sentNotifications.dedupeKey, dedupeKey),
      ));
    if (already.length > 0) continue;

    try {
      await sendPush(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        {
          title: `${game.title} is on sale` ,
          body: latest.discountPercent != null ? `-${latest.discountPercent}%` : 'On sale now',
          icon: game.heroUrl ?? '/logo.png',
          url: `/games/${game.slug}`,
          tag: dedupeKey,
        },
      );
      await db.insert(sentNotifications).values({ subscriptionId: row.subscriptionId, gameId: row.gameId, store: latest.store, dedupeKey });
      sentCount += 1;
    } catch (e: unknown) {
      // Clean up gone subscriptions
      let status = 0;
      if (typeof e === 'object' && e !== null) {
        const maybe = e as { statusCode?: number; status?: number };
        status = maybe.statusCode ?? maybe.status ?? 0;
      }
      if (status === 404 || status === 410) {
        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, row.subscriptionId));
      }
    }
  }

  return NextResponse.json({ ok: true, sent: sentCount });
}


