-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "public"."Team"("name");

-- AlterTable
ALTER TABLE "public"."PortalUser" ADD COLUMN "lastLoginAt" TIMESTAMP(3),
ADD COLUMN "teamId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."PortalUser" ADD CONSTRAINT "PortalUser_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."ArticleView" (
    "id" SERIAL NOT NULL,
    "portalUserId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleView_portalUserId_articleId_key" ON "public"."ArticleView"("portalUserId", "articleId");

-- AddForeignKey
ALTER TABLE "public"."ArticleView" ADD CONSTRAINT "ArticleView_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "public"."PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleView" ADD CONSTRAINT "ArticleView_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN "portalUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "public"."PortalUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."Feedback" ADD COLUMN "portalUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "public"."PortalUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
