CREATE TABLE IF NOT EXISTS "templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" text,
	"body" text NOT NULL,
	"attachments" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"template_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_templates" ADD CONSTRAINT "user_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_templates" ADD CONSTRAINT "user_templates_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
