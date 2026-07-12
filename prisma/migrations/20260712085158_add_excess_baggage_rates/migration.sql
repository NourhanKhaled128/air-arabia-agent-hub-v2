-- CreateTable
CREATE TABLE "public"."ExcessBaggageRate" (
    "id" SERIAL NOT NULL,
    "hub" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "region" TEXT,
    "destination" TEXT NOT NULL,
    "rate" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcessBaggageRate_pkey" PRIMARY KEY ("id")
);
