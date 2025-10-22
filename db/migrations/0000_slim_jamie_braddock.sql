CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"type" text NOT NULL,
	"url" text,
	"file_name" text,
	"file_size" integer,
	"content_type" text,
	"storage_key" text
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"country" varchar(2) NOT NULL,
	"legal_form" text,
	"address" text,
	"registry" text,
	"e_delivery_address" text,
	"primary_contact_name" text,
	"primary_contact_email" text,
	"primary_contact_phone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "gender_balance_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"role" text NOT NULL,
	"women" integer NOT NULL,
	"men" integer NOT NULL,
	"total" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_measures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"name" text NOT NULL,
	"planned_result" text,
	"indicator" text,
	"indicator_value" text,
	"indicator_unit" text,
	"year" text
);
--> statement-breakpoint
CREATE TABLE "submission_meta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"reasons_for_underrepresentation" text,
	"submitter_name" text,
	"submitter_title" text,
	"submitter_phone" text,
	"submitter_email" text
);
--> statement-breakpoint
CREATE TABLE "submission_organs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"organ_type" text NOT NULL,
	"last_election_date" date,
	"planned_election_date" date
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_code" text NOT NULL,
	"name_at_submission" text NOT NULL,
	"country" varchar(2) NOT NULL,
	"legal_form" text,
	"address" text,
	"registry" text,
	"e_delivery_address" text,
	"reporting_from" date,
	"reporting_to" date,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"notes" text,
	"consent" boolean NOT NULL,
	"consent_text" text NOT NULL,
	"requirements_applied" boolean NOT NULL,
	"requirements_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gender_balance_rows" ADD CONSTRAINT "gender_balance_rows_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_measures" ADD CONSTRAINT "submission_measures_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_meta" ADD CONSTRAINT "submission_meta_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_organs" ADD CONSTRAINT "submission_organs_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_company_code_companies_code_fk" FOREIGN KEY ("company_code") REFERENCES "public"."companies"("code") ON DELETE no action ON UPDATE no action;