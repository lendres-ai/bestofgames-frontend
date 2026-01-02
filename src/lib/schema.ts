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
  jsonb,
} from 'drizzle-orm/pg-core';
import { LocalizedField } from './i18n';

export const games = pgTable('games', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: jsonb('summary').$type<LocalizedField>(),  // Localized: { en: "...", de: "..." }
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
  title: jsonb('title').$type<LocalizedField>().notNull(),              // Localized: { en: "...", de: "..." }
  description: jsonb('description').$type<LocalizedField>().notNull(),  // Localized
  introduction: jsonb('introduction').$type<LocalizedField>().notNull(), // Localized
  gameplayFeatures: jsonb('gameplay_features').$type<LocalizedField>().notNull(), // Localized
  conclusion: jsonb('conclusion').$type<LocalizedField>().notNull(),    // Localized
  userOpinion: jsonb('user_opinion').$type<LocalizedField>(),           // Localized
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
  text: jsonb('text').$type<LocalizedField>().notNull(),  // Localized: { en: "...", de: "..." }
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

// Hero Game Bandit Stats for Thompson Sampling optimization
export const heroBanditStats = pgTable('hero_bandit_stats', {
  gameId: uuid('game_id').primaryKey().references(() => games.id, { onDelete: 'cascade' }),
  impressions10d: integer('impressions_10d').notNull().default(0),
  clicks10d: integer('clicks_10d').notNull().default(0),
  priorAlpha: numeric('prior_alpha', { precision: 5, scale: 2 }).notNull().default('1.0'),
  priorBeta: numeric('prior_beta', { precision: 5, scale: 2 }).notNull().default('1.0'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
