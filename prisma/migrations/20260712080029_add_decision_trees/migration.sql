-- CreateTable
CREATE TABLE "public"."DecisionTree" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "topic" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "author" TEXT NOT NULL,
    "sourceArticleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DecisionTree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DecisionNode" (
    "id" SERIAL NOT NULL,
    "treeId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "DecisionNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DecisionOption" (
    "id" SERIAL NOT NULL,
    "nodeId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "targetNodeId" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DecisionOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DecisionTree_slug_key" ON "public"."DecisionTree"("slug");

-- AddForeignKey
ALTER TABLE "public"."DecisionTree" ADD CONSTRAINT "DecisionTree_sourceArticleId_fkey" FOREIGN KEY ("sourceArticleId") REFERENCES "public"."Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DecisionNode" ADD CONSTRAINT "DecisionNode_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "public"."DecisionTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DecisionOption" ADD CONSTRAINT "DecisionOption_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "public"."DecisionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
