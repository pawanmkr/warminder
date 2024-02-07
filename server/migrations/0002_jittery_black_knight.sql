ALTER TABLE "user_campaigns" DROP CONSTRAINT "user_campaigns_campaign_table_name_unique";--> statement-breakpoint
ALTER TABLE "user_campaigns" ADD COLUMN "rows" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "user_campaigns" DROP COLUMN IF EXISTS "campaign_table_name";