-- Convert text columns to jsonb while preserving existing data as English
ALTER TABLE "games" ALTER COLUMN "summary" SET DATA TYPE jsonb USING CASE WHEN "summary" IS NOT NULL THEN jsonb_build_object('en', "summary") ELSE NULL END;--> statement-breakpoint
ALTER TABLE "review_pros_cons" ALTER COLUMN "text" SET DATA TYPE jsonb USING jsonb_build_object('en', "text");--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "title" SET DATA TYPE jsonb USING jsonb_build_object('en', "title");--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "description" SET DATA TYPE jsonb USING jsonb_build_object('en', "description");--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "introduction" SET DATA TYPE jsonb USING jsonb_build_object('en', "introduction");--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "gameplay_features" SET DATA TYPE jsonb USING jsonb_build_object('en', "gameplay_features");--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "conclusion" SET DATA TYPE jsonb USING jsonb_build_object('en', "conclusion");--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "user_opinion" SET DATA TYPE jsonb USING CASE WHEN "user_opinion" IS NOT NULL THEN jsonb_build_object('en', "user_opinion") ELSE NULL END;
