ALTER TABLE "game_images" DROP CONSTRAINT "game_images_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "game_platforms" DROP CONSTRAINT "game_platforms_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "game_platforms" DROP CONSTRAINT "game_platforms_platform_id_platforms_id_fk";
--> statement-breakpoint
ALTER TABLE "review_pros_cons" DROP CONSTRAINT "review_pros_cons_review_id_reviews_id_fk";
--> statement-breakpoint
ALTER TABLE "review_tags" DROP CONSTRAINT "review_tags_review_id_reviews_id_fk";
--> statement-breakpoint
ALTER TABLE "review_tags" DROP CONSTRAINT "review_tags_tag_id_tags_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "game_images" ADD CONSTRAINT "game_images_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_pros_cons" ADD CONSTRAINT "review_pros_cons_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;