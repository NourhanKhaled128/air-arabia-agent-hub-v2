import Link from "next/link";
import { ClipboardCheck, Plus, ListChecks, Users, Percent } from "lucide-react";
import { getAllQuizzesForAdmin } from "@/lib/quiz-service";
import QuizzesTable from "@/components/admin/quiz/QuizzesTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";

export default async function QuizzesAdminPage() {
  const quizzes = await getAllQuizzesForAdmin();

  const total = quizzes.length;
  const published = quizzes.filter((q) => q.status === "Published").length;
  const totalAttempts = quizzes.reduce((sum, q) => sum + q.attemptCount, 0);
  const scored = quizzes.filter((q) => q.avgScore != null);
  const overallAvg =
    scored.length > 0
      ? Math.round(scored.reduce((sum, q) => sum + (q.avgScore ?? 0), 0) / scored.length)
      : null;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Quizzes"
        description="Create and publish timed multiple-choice quizzes for the training program, and review trainee results."
        actions={
          <Link
            href="/admin/quizzes/new"
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            New Quiz
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard title="Total Quizzes" value={total} icon={ClipboardCheck} />
        <AdminStatCard title="Published" value={published} icon={ListChecks} color="text-emerald-700" />
        <AdminStatCard title="Total Attempts" value={totalAttempts} icon={Users} color="text-blue-700" />
        <AdminStatCard
          title="Overall Avg. Score"
          value={overallAvg != null ? `${overallAvg}%` : "-"}
          icon={Percent}
          color="text-amber-700"
        />
      </div>

      <QuizzesTable quizzes={quizzes} />
    </div>
  );
}
