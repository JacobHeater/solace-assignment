DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advocates' AND column_name = 'specialties') THEN
        ALTER TABLE "advocates" ADD COLUMN "specialties" jsonb DEFAULT '[]'::jsonb NOT NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advocates' AND column_name = 'payload') THEN
        UPDATE "advocates" SET "specialties" = "payload";
    END IF;
END $$;--> statement-breakpoint
ALTER TABLE "advocates" DROP COLUMN IF EXISTS "payload";