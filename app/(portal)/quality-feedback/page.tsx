export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { Star } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getQualityReviewsForAgent, getAgentQualityStats } from "@/lib/quality-review-service";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";

export default async function QualityFeedbackPage() {
  if (!(await isSidebarLinkEnabled("/quality-feedback"))) notFound();

  const user = await getCurrentPortalUser();
  if (!user) redirect("/login");

  const [reviews, stats] = await Promise.all([
    getQualityReviewsForAgent(user.id),
    getAgentQualityStats(user.id),
  ]);

  return (
    <>
      <PageHeader
        title="Quality Feedback"
        subtitle={
          stats.count > 0
            ? `${stats.count} review${stats.count === 1 ? "" : "s"} · average rating ${stats.avgRating}/5`
            : "Ratings and notes left by QA/team leads about your calls."
        }
      />

      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-300">
            No quality feedback yet.
          </p>
          <p className="mt-2 text-gray-500 dark:text-slate-400">
            Reviews left by your QA/team lead will show up here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 shadow-sm"
            >
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Star size={16} fill="currentColor" />
                {r.rating}/5
              </span>
              <p className="mt-2 text-gray-800 dark:text-slate-200">{r.comment}</p>
              <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">
                {r.reviewerName} · {r.createdAt.toLocaleDateString("en-GB")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
