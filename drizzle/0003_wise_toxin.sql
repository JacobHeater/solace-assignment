CREATE TABLE IF NOT EXISTS "advocate_tags" (
	"advocate_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "advocate_tags_advocate_id_tag_id_pk" PRIMARY KEY("advocate_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "tag_types_title_unique" UNIQUE NULLS NOT DISTINCT("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_type_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "tags_title_unique" UNIQUE NULLS NOT DISTINCT("title")
);

DO $$ BEGIN
 ALTER TABLE "advocate_tags" ADD CONSTRAINT "advocate_tags_advocate_id_advocates_id_fk" FOREIGN KEY ("advocate_id") REFERENCES "public"."advocates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advocate_tags" ADD CONSTRAINT "advocate_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_tag_type_id_tag_types_id_fk" FOREIGN KEY ("tag_type_id") REFERENCES "public"."tag_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

/* Migrate Existing Specialty Data */
DO $$ BEGIN

INSERT INTO tag_types (title, description)
VALUES ('Specialty', 'Describes a specialty')
ON CONFLICT DO NOTHING;

WITH tagType AS (
	SELECT id FROM tag_types WHERE title = 'Specialty' LIMIT 1
)
INSERT INTO tags (tag_type_id, title, description)
SELECT tagType.id, specialties.title, specialties.description
FROM specialties
CROSS JOIN tagType
ON CONFLICT DO NOTHING;

WITH specialtyTags AS (
	SELECT t.id as tag_id, s.id AS specialty_id
	FROM tags t
	JOIN tag_types tt on tt.id = t.tag_type_id
	JOIN specialties s on s.title = t.title
	WHERE tt.title = 'Specialty'
)
INSERT INTO advocate_tags (tag_id, advocate_id)
SELECT st.tag_id, a.advocate_id
FROM advocate_specialties a
JOIN specialtyTags st ON a.specialty_id = st.specialty_id
JOIN advocates adv ON adv.id = a.advocate_id
ON CONFLICT DO NOTHING;

END $$;
--> statement-breakpoint

--> statement-breakpoint
DROP TABLE "advocate_specialties";--> statement-breakpoint
DROP TABLE "specialties";--> statement-breakpoint
