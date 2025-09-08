import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  boolean,
  primaryKey,
  pgEnum,
  integer,
  index,
} from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary'),
  releaseDate: timestamp('release_date', { withTimezone: true }),
  heroUrl: text('hero_url'),
  trailerUrl: text('trailer_url'),
  developer: text('developer'),
  publisher: text('publisher'),
  steamAppId: integer('steam_appid').unique(),
});

export const platforms = pgTable('platforms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
});

export const gamePlatforms = pgTable(
  'game_platforms',
  {
    gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
    platformId: uuid('platform_id').references(() => platforms.id, { onDelete: 'cascade' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.gameId, t.platformId] }),
  }),
);

export const gameImages = pgTable('game_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  caption: text('caption'),
  sortOrder: integer('sort_order'),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  introduction: text('introduction').notNull(),
  gameplayFeatures: text('gameplay_features').notNull(),
  conclusion: text('conclusion').notNull(),
  userOpinion: text('user_opinion'),
  score: numeric('score', { precision: 3, scale: 1 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
  isPublished: boolean('is_published').default(true),
});

export const proConEnum = pgEnum('pro_con', ['pro', 'con']);

export const reviewProsCons = pgTable('review_pros_cons', {
  id: uuid('id').defaultRandom().primaryKey(),
  reviewId: uuid('review_id').references(() => reviews.id, { onDelete: 'cascade' }).notNull(),
  text: text('text').notNull(),
  type: proConEnum('type').notNull(),
});

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
});

export const reviewTags = pgTable(
  'review_tags',
  {
    reviewId: uuid('review_id').references(() => reviews.id, { onDelete: 'cascade' }).notNull(),
    tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.reviewId, t.tagId] }),
  }),
);

// removed user_opinions table in favor of reviews.userOpinion


// Web Push subscriptions stored per-browser/device, identified by endpoint
export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  userAgent: text('user_agent'),
});

// Mapping of which games a given subscription wants alerts for
export const subscriptionGames = pgTable(
  'subscription_games',
  {
    subscriptionId: uuid('subscription_id').references(() => pushSubscriptions.id, { onDelete: 'cascade' }).notNull(),
    gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.subscriptionId, t.gameId] }),
  }),
);

// Price snapshots from external stores (e.g., Steam)
export const priceSnapshots = pgTable(
  'price_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
    store: text('store').notNull(), // e.g. 'steam'
    currency: text('currency'),
    priceInitial: integer('price_initial'), // in minor units (e.g. cents)
    priceFinal: integer('price_final'), // in minor units
    discountPercent: integer('discount_percent'),
    isOnSale: boolean('is_on_sale').default(false).notNull(),
    fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byGameStoreFetched: index('idx_price_snapshots_game_store_fetched').on(t.gameId, t.store, t.fetchedAt),
  }),
);

// Track sent notifications to avoid duplicates
export const sentNotifications = pgTable(
  'sent_notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    subscriptionId: uuid('subscription_id').references(() => pushSubscriptions.id, { onDelete: 'cascade' }).notNull(),
    gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
    store: text('store').notNull(),
    dedupeKey: text('dedupe_key'),
    sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    bySubGameStore: index('idx_sent_notifications_sub_game_store').on(t.subscriptionId, t.gameId, t.store),
  }),
);

