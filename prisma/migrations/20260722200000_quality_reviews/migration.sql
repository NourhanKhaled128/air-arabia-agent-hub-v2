-- CreateTable
CREATE TABLE "public"."QualityReview" (
    "id" SERIAL NOT NULL,
    "portalUserId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QualityReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."QualityReview" ADD CONSTRAINT "QualityReview_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "public"."PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
