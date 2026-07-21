import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import QuizResultsTable from "@/components/admin/quiz/QuizResultsTable";
import { getQuizForEdit, getAttemptsForQuiz, getAttemptReportText } from "@/lib/quiz-service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuizResultsPage({ params }: Props) {
  const { id } = await params;
  const quizId = Number(id);
  if (!Number.isInteger(quizId)) notFound();

  const [quiz, attempts] = await Promise.all([
    getQuizForEdit(quizId),
    getAttemptsForQuiz(quizId),
  ]);
  if (!quiz) notFound();

  const submitted = attempts.filter((a) => a.status === "Submitted");
  const reportEntries = await Promise.all(
    submitted.map(async (a) => [a.id, await getAttemptReportText(a.id)] as const)
  );
  const reportTexts: Record<number, string> = {};
  for (const [attemptId, text] of reportEntries) {
    if (text) reportTexts[attemptId] = text;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Results: ${quiz.title}`}
        description={`${attempts.length} attempt${attempts.length === 1 ? "" : "s"} — ${submitted.length} submitted`}
        breadcrumbs={[{ label: "Quizzes", href: "/admin/quizzes" }, { label: "Results" }]}
      />

      <QuizResultsTable quizId={quiz.id} attempts={attempts} reportTexts={reportTexts} />
    </div>
  );
}
