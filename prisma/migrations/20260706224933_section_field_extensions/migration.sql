-- AlterTable
ALTER TABLE "public"."Disposition" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "public"."Escalation" ADD COLUMN     "condition" TEXT,
ADD COLUMN     "department" TEXT;

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Information';

-- AlterTable
ALTER TABLE "public"."Reference" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Internal SOP';
