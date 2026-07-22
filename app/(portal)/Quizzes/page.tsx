export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ClipboardCheck, Clock, ListChecks, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getPublishedQuizzes } from "@/lib/quiz-service";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";
import { getCurrentPortalUser } from "@/lib/portal-dal";

export default async function QuizzesPage() {
  if (!(await isSidebarLinkEnabled("/Quizzes"))) notFound();

  const user = await getCurrentPortalUser();
  const quizzes = await getPublishedQuizzes(user?.teamId ?? null);

  return (
    <>
      <PageHeader
        title="Quizzes"
        subtitle="Timed multiple-choice quizzes for the training program — enter your details, then work through the questions before time runs out."
      />

      {quizzes.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-gray-500 dark:text-slate-400">No quizzes are available right now — check back once your trainer publishes one.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/Quizzes/${quiz.id}`}
              className="group flex flex-col rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm transition hover:border-red-300 dark:hover:border-brand/60 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-brand">
                  <ClipboardCheck size={22} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">{quiz.title}</h2>
              </div>

              {quiz.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">{quiz.description}</p>
              )}

              <div className="mt-5 flex items-center gap-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {quiz.timeLimitMinutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <ListChecks size={14} />
                  {quiz.questionCount} questions
                </span>
              </div>

              <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-brand">
                Start quiz
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
