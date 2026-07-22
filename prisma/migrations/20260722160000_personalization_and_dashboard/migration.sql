-- AlterTable
ALTER TABLE "public"."PortalUser" ADD COLUMN "notificationsSeenAt" TIMESTAMP(3),
ADD COLUMN "announcementsSeenAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Announcement" ADD COLUMN "teamId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Announcement" ADD CONSTRAINT "Announcement_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."Quiz" ADD COLUMN "teamId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Quiz" ADD CONSTRAINT "Quiz_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."ArticleBookmark" (
    "id" SERIAL NOT NULL,
    "portalUserId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBookmark_portalUserId_articleId_key" ON "public"."ArticleBookmark"("portalUserId", "articleId");

-- AddForeignKey
ALTER TABLE "public"."ArticleBookmark" ADD CONSTRAINT "ArticleBookmark_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "public"."PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleBookmark" ADD CONSTRAINT "ArticleBookmark_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
