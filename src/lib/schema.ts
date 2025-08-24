import { pgTable, uuid, text, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
	id: uuid('id').defaultRandom().primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	summary: text('summary'),
	releaseDate: timestamp('release_date', { withTimezone: true }),
	heroUrl: text('hero_url'),
	trailerUrl: text('trailer_url'),
	developer: text('developer'),
	publisher: text('publisher'),
});

export const reviews = pgTable('reviews', {
	id: uuid('id').defaultRandom().primaryKey(),
	gameId: uuid('game_id').references(() => games.id).unique(),
	score: numeric('score', { precision: 3, scale: 1 }),
	pros: text('pros').array(),
	cons: text('cons').array(),
	bodyMd: text('body_markdown'),
	publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
	isPublished: boolean('is_published').default(true),
});


