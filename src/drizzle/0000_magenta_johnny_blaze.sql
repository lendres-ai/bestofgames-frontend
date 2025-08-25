CREATE TYPE "public"."pro_con" AS ENUM('pro', 'con');--> statement-breakpoint
CREATE TABLE "game_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"sort_order" integer
);
--> statement-breakpoint
CREATE TABLE "game_platforms" (
	"game_id" uuid NOT NULL,
	"platform_id" uuid NOT NULL,
	CONSTRAINT "game_platforms_game_id_platform_id_pk" PRIMARY KEY("game_id","platform_id")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
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
CREATE TABLE "platforms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "platforms_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "review_pros_cons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"text" text NOT NULL,
	"type" "pro_con" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_tags" (
	"review_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "review_tags_review_id_tag_id_pk" PRIMARY KEY("review_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"introduction" text NOT NULL,
	"gameplay_features" text NOT NULL,
	"conclusion" text NOT NULL,
	"user_opinion" text,
	"score" numeric(3, 1) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"published_at" timestamp with time zone DEFAULT now(),
	"is_published" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "game_images" ADD CONSTRAINT "game_images_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_pros_cons" ADD CONSTRAINT "review_pros_cons_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;