import Link from "next/link";
import { Star } from "lucide-react";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getQualityReviewsForAgent, getAgentQualityStats } from "@/lib/quality-review-service";

export default async function QualityFeedbackWidget() {
  const user = await getCurrentPortalUser();
  if (!user) return null;

  const [reviews, stats] = await Promise.all([
    getQualityReviewsForAgent(user.id),
    getAgentQualityStats(user.id),
  ]);

  if (reviews.length === 0) return null;

  const recent = reviews.slice(0, 3);

  return (
    <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-slate-100">
          <Star size={18} />
          Quality Feedback
        </h2>
        {stats.avgRating != null && (
          <span className="rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-sm font-bold text-amber-700 dark:text-amber-400">
            Avg {stats.avgRating}/5
          </span>
        )}
      </div>

      <ul className="space-y-2">
        {recent.map((r) => (
          <li key={r.id} className="rounded-xl border border-gray-200 dark:border-border-subtle p-3">
            <span className="flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-400">
              <Star size={14} fill="currentColor" />
              {r.rating}/5
            </span>
            <p className="mt-1 truncate text-sm text-gray-700 dark:text-slate-300">{r.comment}</p>
          </li>
        ))}
      </ul>

      {reviews.length > 3 && (
        <Link
          href="/quality-feedback"
          className="mt-3 block text-sm font-semibold text-red-700 dark:text-brand hover:underline"
        >
          View all {reviews.length} →
        </Link>
      )}
    </section>
  );
}
