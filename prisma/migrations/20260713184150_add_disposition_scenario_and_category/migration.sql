-- AlterTable
ALTER TABLE "public"."Disposition" ADD COLUMN     "category" TEXT,
ADD COLUMN     "scenario" TEXT;

-- AlterTable
ALTER TABLE "public"."DispositionCode" ADD COLUMN     "scenario" TEXT;
