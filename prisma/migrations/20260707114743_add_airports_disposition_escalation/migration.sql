-- CreateTable
CREATE TABLE "public"."Airport" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "airport" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DispositionCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DispositionCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EscalationContact" (
    "id" SERIAL NOT NULL,
    "issueType" TEXT NOT NULL,
    "escalateTo" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EscalationContact_pkey" PRIMARY KEY ("id")
);
