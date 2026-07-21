import AdminPageHeader from "@/components/admin/AdminPageHeader";
import QuizForm from "@/components/admin/quiz/QuizForm";

export default function NewQuizPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New Quiz"
        breadcrumbs={[{ label: "Quizzes", href: "/admin/quizzes" }, { label: "New Quiz" }]}
      />

      <QuizForm />
    </div>
  );
}
