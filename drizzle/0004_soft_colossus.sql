CREATE TABLE IF NOT EXISTS "entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_tags" (
	"entity_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "entity_tags_entity_id_tag_id_pk" PRIMARY KEY("entity_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "advocates" ADD COLUMN "entity_id" integer NULL;--> statement-breakpoint
DO $$ BEGIN

WITH advocate_subset AS (
  SELECT id AS advocate_id
  FROM advocates
  WHERE entity_id IS NULL
),
new_entities AS (
  INSERT INTO entities (created_at)
  SELECT now()
  FROM advocate_subset
  RETURNING id
),
indexed_advocates AS (
  SELECT advocate_id, ROW_NUMBER() OVER () AS rn
  FROM advocate_subset
),
indexed_entities AS (
  SELECT id AS entity_id, ROW_NUMBER() OVER () AS rn
  FROM new_entities
)
UPDATE advocates
SET entity_id = ie.entity_id
FROM indexed_advocates ia
JOIN indexed_entities ie ON ia.rn = ie.rn
WHERE advocates.id = ia.advocate_id;

INSERT INTO entity_tags (entity_id, tag_id)
SELECT ent.id, tg.id FROM advocate_tags advt
JOIN advocates adv ON advt.advocate_id = adv.id
JOIN entities ent ON adv.entity_id = ent.id
JOIN tags tg ON advt.tag_id = tg.id;

END $$
--> statement-breakpoint
ALTER TABLE advocates ALTER COLUMN entity_id SET NOT NULL; --> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_tags" ADD CONSTRAINT "entity_tags_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_tags" ADD CONSTRAINT "entity_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advocates" ADD CONSTRAINT "advocates_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "advocate_tags";--> statement-breakpoint