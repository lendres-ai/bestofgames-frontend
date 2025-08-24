CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"release_date" timestamp with time zone,
	"hero_url" text,
	"trailer_url" text,
	"developer" text,
	"publisher" text,
	CONSTRAINT "games_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid,
	"score" numeric(3, 1),
	"pros" text[],
	"cons" text[],
	"body_markdown" text,
	"published_at" timestamp with time zone DEFAULT now(),
	"is_published" boolean DEFAULT true,
	CONSTRAINT "reviews_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;