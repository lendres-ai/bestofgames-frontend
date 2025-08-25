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


