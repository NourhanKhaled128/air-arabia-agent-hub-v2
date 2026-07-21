import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import QuizResultsTable from "@/components/admin/quiz/QuizResultsTable";
import { getQuizForEdit, getAttemptsForQuiz } from "@/lib/quiz-service";

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

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Results: ${quiz.title}`}
        description={`${attempts.length} submission${attempts.length === 1 ? "" : "s"}`}
        breadcrumbs={[{ label: "Quizzes", href: "/admin/quizzes" }, { label: "Results" }]}
      />

      <QuizResultsTable quizId={quiz.id} quizTitle={quiz.title} attempts={attempts} />
    </div>
  );
}
