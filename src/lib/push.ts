import webPush from 'web-push';
import { db } from '@/lib/db';
import { games, pushSubscriptions, subscriptionGames } from '@/lib/schema';
import { and, eq, inArray } from 'drizzle-orm';

// Configure VAPID once
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? 'mailto:admin@bestof.games';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY && VAPID_SUBJECT) {
  try {
    webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch {
    // ignore misconfiguration at import-time; will throw on send
  }
}

export async function sendPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: Record<string, unknown>,
) {
  return webPush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
    },
    JSON.stringify(payload),
  );
}

export type ClientSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
};

export async function upsertSubscription(input: ClientSubscription) {
  const existing = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, input.endpoint));
  if (existing.length > 0) {
    await db
      .update(pushSubscriptions)
      .set({ p256dh: input.keys.p256dh, auth: input.keys.auth, userAgent: input.userAgent })
      .where(eq(pushSubscriptions.id, existing[0].id));
    return existing[0].id;
  }
  const inserted = await db
    .insert(pushSubscriptions)
    .values({ endpoint: input.endpoint, p256dh: input.keys.p256dh, auth: input.keys.auth, userAgent: input.userAgent })
    .returning({ id: pushSubscriptions.id });
  return inserted[0].id;
}

export async function deleteSubscriptionByEndpoint(endpoint: string) {
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
}

export async function syncSubscriptionSlugs(endpoint: string, slugs: string[]) {
  // Resolve endpoint -> subscriptionId
  const sub = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
  if (sub.length === 0) return;
  const subscriptionId = sub[0].id;

  // Resolve slugs -> gameIds
  if (slugs.length === 0) {
    await db.delete(subscriptionGames).where(eq(subscriptionGames.subscriptionId, subscriptionId));
    return;
  }
  const rows = await db
    .select({ id: games.id, slug: games.slug })
    .from(games)
    .where(inArray(games.slug, slugs));
  const gameIds = new Set(rows.map((r) => r.id));

  // Fetch current mappings
  const current = await db
    .select({ gameId: subscriptionGames.gameId })
    .from(subscriptionGames)
    .where(eq(subscriptionGames.subscriptionId, subscriptionId));
  const currentSet = new Set(current.map((r) => r.gameId));

  // Determine additions and deletions
  const toAdd = Array.from(gameIds).filter((id) => !currentSet.has(id));
  const toRemove = Array.from(currentSet).filter((id) => !gameIds.has(id));

  if (toAdd.length > 0) {
    await db.insert(subscriptionGames).values(toAdd.map((gameId) => ({ subscriptionId, gameId })));
  }
  if (toRemove.length > 0) {
    await db
      .delete(subscriptionGames)
      .where(and(eq(subscriptionGames.subscriptionId, subscriptionId), inArray(subscriptionGames.gameId, toRemove)));
  }
}


