-- CreateTable
-- A staged content edit for an Article or DecisionTree that applies itself
-- automatically once effectiveDate arrives, via the daily cron at
-- app/api/cron/apply-scheduled-changes. "payload" mirrors the exact JSON body the
-- entity's own PUT route already accepts.
CREATE TABLE "public"."ScheduledChange" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "payload" JSONB NOT NULL,
    "failureReason" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedAt" TIMESTAMP(3),

    CONSTRAINT "ScheduledChange_pkey" PRIMARY KEY ("id")
);
