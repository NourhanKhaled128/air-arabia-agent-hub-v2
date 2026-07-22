import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import QuizForm from "@/components/admin/quiz/QuizForm";
import { getQuizForEdit } from "@/lib/quiz-service";
import { getTeams } from "@/lib/team-service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditQuizPage({ params }: Props) {
  const { id } = await params;
  const quizId = Number(id);
  if (!Number.isInteger(quizId)) notFound();

  const [quiz, teams] = await Promise.all([getQuizForEdit(quizId), getTeams()]);
  if (!quiz) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Edit: ${quiz.title}`}
        breadcrumbs={[{ label: "Quizzes", href: "/admin/quizzes" }, { label: "Edit" }]}
      />

      <QuizForm
        quizId={quiz.id}
        teams={teams}
        initial={{
          title: quiz.title,
          description: quiz.description ?? "",
          timeLimitMinutes: quiz.timeLimitMinutes,
          passingScore: quiz.passingScore,
          showAnswers: quiz.showAnswers,
          status: quiz.status,
          order: quiz.order,
          teamId: quiz.teamId,
          questions: quiz.questions.map((q) => ({
            clientKey: q.id,
            text: q.text,
            points: q.points,
            choices: q.choices.map((c) => ({
              clientKey: c.id,
              text: c.text,
              isCorrect: c.isCorrect,
            })),
          })),
        }}
      />
    </div>
  );
}
