ALTER TABLE "advocates" ADD COLUMN "specialties" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "advocates" DROP COLUMN IF EXISTS "payload";