CREATE TABLE IF NOT EXISTS "user_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"campaign_table_name" text NOT NULL,
	CONSTRAINT "user_campaigns_campaign_table_name_unique" UNIQUE("campaign_table_name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_campaigns" ADD CONSTRAINT "user_campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
