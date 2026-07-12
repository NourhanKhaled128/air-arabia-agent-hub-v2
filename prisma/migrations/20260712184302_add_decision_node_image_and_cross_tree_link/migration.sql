-- AlterTable
ALTER TABLE "public"."DecisionNode" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "public"."DecisionOption" ADD COLUMN     "targetTreeId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."DecisionOption" ADD CONSTRAINT "DecisionOption_targetTreeId_fkey" FOREIGN KEY ("targetTreeId") REFERENCES "public"."DecisionTree"("id") ON DELETE SET NULL ON UPDATE CASCADE;
