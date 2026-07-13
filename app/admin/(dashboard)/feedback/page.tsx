import { MessageSquare, ThumbsUp, ThumbsDown, Clock3 } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import FeedbackTable from "@/components/admin/feedback/FeedbackTable";
import { getFeedback } from "@/lib/feedback-service";

export default async function FeedbackPage() {
  const feedback = await getFeedback();

  const helpful = feedback.filter((f) => f.helpful).length;
  const notHelpful = feedback.filter((f) => !f.helpful).length;
  const pending = feedback.filter((f) => f.status === "New").length;

  const rows = feedback.map((f) => ({
    id: f.id,
    articleTitle: f.article.title,
    authorName: f.authorName ?? "Anonymous",
    helpful: f.helpful,
    message: f.message ?? "",
    status: f.status,
    createdAt: f.createdAt,
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Feedback"
        description={'"Was this helpful?" responses champions leave on knowledge articles.'}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard title="Total" value={feedback.length} icon={MessageSquare} />
        <AdminStatCard title="Helpful" value={helpful} icon={ThumbsUp} color="text-emerald-700" />
        <AdminStatCard title="Not Helpful" value={notHelpful} icon={ThumbsDown} color="text-red-700" />
        <AdminStatCard title="Unreviewed" value={pending} icon={Clock3} color="text-amber-700" />
      </div>

      <FeedbackTable feedback={rows} />
    </div>
  );
}
