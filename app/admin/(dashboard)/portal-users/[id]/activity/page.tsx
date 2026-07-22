import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import QualityReviewSection from "@/components/admin/quality/QualityReviewSection";
import { getPortalUserById } from "@/lib/portal-user-service";
import { getAttemptsByEmail } from "@/lib/quiz-service";
import { getCommentsByPortalUser } from "@/lib/comment-service";
import { getFeedbackByPortalUser } from "@/lib/feedback-service";
import { getQualityReviewsForAgent } from "@/lib/quality-review-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PortalUserActivityPage({ params }: Props) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId)) notFound();

  const agent = await getPortalUserById(userId);
  if (!agent) notFound();

  const [quizAttempts, comments, feedback, qualityReviews, admin] = await Promise.all([
    getAttemptsByEmail(agent.email),
    getCommentsByPortalUser(agent.id),
    getFeedbackByPortalUser(agent.id),
    getQualityReviewsForAgent(agent.id),
    getCurrentAdminUser(),
  ]);

  const canManageQuality = admin?.role.permissions.includes("manage_quality") ?? false;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Activity: ${agent.name}`}
        description={agent.email}
        breadcrumbs={[{ label: "Agent Accounts", href: "/admin/portal-users" }, { label: "Activity" }]}
      />

      <QualityReviewSection
        portalUserId={agent.id}
        reviews={qualityReviews}
        canManage={canManageQuality}
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Quiz History ({quizAttempts.length})</h2>
        {quizAttempts.length === 0 ? (
          <p className="text-slate-500">No quiz attempts yet.</p>
        ) : (
          <ul className="space-y-2">
            {quizAttempts.map((a, i) => (
              <li
                key={`${a.quizId}-${i}`}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div>
                  <p className="font-semibold">{a.quizTitle}</p>
                  {a.submittedAt && (
                    <p className="text-sm text-slate-500">
                      {new Date(a.submittedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <span className={`font-bold ${a.passed ? "text-emerald-600" : "text-red-600"}`}>
                  {Math.round(a.percentage)}% · {a.passed ? "Passed" : "Failed"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Comments ({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="text-slate-500">No comments yet.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((c) => (
              <li key={c.id} className="rounded-xl border p-3">
                <p className="text-sm text-slate-500">
                  {c.article.title} · {c.createdAt.toLocaleString()} · {c.status}
                </p>
                <p className="mt-1">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Feedback ({feedback.length})</h2>
        {feedback.length === 0 ? (
          <p className="text-slate-500">No feedback yet.</p>
        ) : (
          <ul className="space-y-2">
            {feedback.map((f) => (
              <li key={f.id} className="rounded-xl border p-3">
                <p className="text-sm text-slate-500">
                  {f.article.title} · {f.createdAt.toLocaleString()} ·{" "}
                  {f.helpful ? "Helpful" : "Not helpful"}
                </p>
                {f.message && <p className="mt-1">{f.message}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
