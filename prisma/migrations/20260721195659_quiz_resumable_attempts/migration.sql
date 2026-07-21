-- AlterTable
ALTER TABLE "public"."QuizAttempt" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'InProgress',
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "totalPoints" DROP NOT NULL,
ALTER COLUMN "percentage" DROP NOT NULL,
ALTER COLUMN "passed" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP DEFAULT,
ALTER COLUMN "timeTakenSeconds" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuizAnswer_attemptId_questionId_key" ON "public"."QuizAnswer"("attemptId", "questionId");
