import { GraduationCap, Trophy, TrendingUp } from "lucide-react";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getAgentQuizStats } from "@/lib/quiz-service";

export default async function YourQuizProgress() {
  const user = await getCurrentPortalUser();
  if (!user) return null;

  const stats = await getAgentQuizStats(user.email);

  const cards = [
    {
      title: "Quizzes Completed",
      value: stats.completed,
      subtitle: "Submitted",
      icon: GraduationCap,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Passed",
      value: stats.passed,
      subtitle: `of ${stats.completed}`,
      icon: Trophy,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Average Score",
      value: stats.avgPercentage != null ? `${stats.avgPercentage}%` : "—",
      subtitle: "Across all quizzes",
      icon: TrendingUp,
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">Your Progress</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-slate-400">{item.title}</p>
                  <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-slate-100">{item.value}</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{item.subtitle}</p>
                </div>

                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color}`}>
                  <Icon size={30} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
