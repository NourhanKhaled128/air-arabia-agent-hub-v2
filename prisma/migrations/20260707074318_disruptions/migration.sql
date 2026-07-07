-- CreateTable
CREATE TABLE "public"."Disruption" (
    "id" SERIAL NOT NULL,
    "airportCode" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'Medium',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disruption_pkey" PRIMARY KEY ("id")
);
