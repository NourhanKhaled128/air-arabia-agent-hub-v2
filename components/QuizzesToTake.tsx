import Link from "next/link";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getUnattemptedQuizzes } from "@/lib/quiz-service";

export default async function QuizzesToTake() {
  const user = await getCurrentPortalUser();
  if (!user) return null;

  const quizzes = await getUnattemptedQuizzes(user.email, user.teamId);
  if (quizzes.length === 0) return null;

  return (
    <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-slate-100">
        <ClipboardCheck size={18} />
        Quizzes You Haven&apos;t Taken Yet
      </h2>
      <ul className="space-y-2">
        {quizzes.slice(0, 3).map((quiz) => (
          <li key={quiz.id}>
            <Link
              href={`/Quizzes/${quiz.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-border-subtle p-3 font-medium text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-surface-muted"
            >
              {quiz.title}
              <ArrowRight size={16} />
            </Link>
          </li>
        ))}
      </ul>
      {quizzes.length > 3 && (
        <Link href="/Quizzes" className="mt-3 block text-sm font-semibold text-red-700 dark:text-brand hover:underline">
          View all {quizzes.length} →
        </Link>
      )}
    </section>
  );
}
