import AdminPageHeader from "@/components/admin/AdminPageHeader";
import QuizForm from "@/components/admin/quiz/QuizForm";
import { getTeams } from "@/lib/team-service";

export default async function NewQuizPage() {
  const teams = await getTeams();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New Quiz"
        breadcrumbs={[{ label: "Quizzes", href: "/admin/quizzes" }, { label: "New Quiz" }]}
      />

      <QuizForm teams={teams} />
    </div>
  );
}
