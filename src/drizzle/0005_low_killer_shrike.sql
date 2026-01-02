CREATE TABLE "hero_bandit_stats" (
	"game_id" uuid PRIMARY KEY NOT NULL,
	"impressions_10d" integer DEFAULT 0 NOT NULL,
	"clicks_10d" integer DEFAULT 0 NOT NULL,
	"prior_alpha" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"prior_beta" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "hero_bandit_stats" ADD CONSTRAINT "hero_bandit_stats_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;