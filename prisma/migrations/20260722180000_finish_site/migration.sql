-- AlterTable
ALTER TABLE "public"."PortalUser" ADD COLUMN "hasSeenOnboarding" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Announcement" ADD COLUMN "isPlatformUpdate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."ContentSuggestion" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "portalUserId" INTEGER,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentSuggestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ContentSuggestion" ADD CONSTRAINT "ContentSuggestion_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentSuggestion" ADD CONSTRAINT "ContentSuggestion_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "public"."PortalUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."SearchMiss" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchMiss_pkey" PRIMARY KEY ("id")
);
