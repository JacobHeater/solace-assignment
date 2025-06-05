CREATE TABLE IF NOT EXISTS "advocate_specialties" (
	"id" serial PRIMARY KEY NOT NULL,
	"advocate_id" integer NOT NULL,
	"specialty_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "advocate_specialties_advocate_id_specialty_id_unique" UNIQUE NULLS NOT DISTINCT("advocate_id","specialty_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "specialties" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "specialties_title_unique" UNIQUE("title")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advocate_specialties" ADD CONSTRAINT "advocate_specialties_advocate_id_advocates_id_fk" FOREIGN KEY ("advocate_id") REFERENCES "public"."advocates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advocate_specialties" ADD CONSTRAINT "advocate_specialties_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
INSERT INTO specialties (title, description)
SELECT
  DISTINCT specialty AS title,
  '' AS description
FROM advocates a,
LATERAL jsonb_array_elements_text((a.specialties #>> '{}')::jsonb) AS specialty;
--> statement-breakpoint
INSERT INTO advocate_specialties (advocate_id, specialty_id)
SELECT
  a.id AS advocate_id,
  s.id AS specialty_id
FROM advocates a
CROSS JOIN LATERAL jsonb_array_elements_text((a.specialties #>> '{}')::jsonb) AS specialty
JOIN specialties s ON s.title = specialty;
--> statement-breakpoint
ALTER TABLE "advocates" DROP COLUMN IF EXISTS "specialties";
--> statement-breakpoint