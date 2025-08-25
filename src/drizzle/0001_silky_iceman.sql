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
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_opinions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"opinion_text" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_game_id_unique";--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "score" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "introduction" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "gameplay_features" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "conclusion" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "game_images" ADD CONSTRAINT "game_images_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_pros_cons" ADD CONSTRAINT "review_pros_cons_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_opinions" ADD CONSTRAINT "user_opinions_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "pros";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "cons";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "body_markdown";