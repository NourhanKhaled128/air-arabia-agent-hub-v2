import { MessageCircle, Clock3, CheckCircle2 } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import CommentsTable from "@/components/admin/comment/CommentsTable";
import { getComments } from "@/lib/comment-service";

export default async function CommentsPage() {
  const comments = await getComments();

  const pending = comments.filter((c) => c.status === "Pending").length;
  const approved = comments.filter((c) => c.status === "Approved").length;

  const rows = comments.map((c) => ({
    id: c.id,
    articleTitle: c.article.title,
    authorName: c.authorName,
    content: c.content,
    status: c.status,
    createdAt: c.createdAt,
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Comments"
        description="Notes champions leave on knowledge articles for other champions."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard title="Total" value={comments.length} icon={MessageCircle} />
        <AdminStatCard title="Pending" value={pending} icon={Clock3} color="text-amber-700" />
        <AdminStatCard title="Approved" value={approved} icon={CheckCircle2} color="text-emerald-700" />
      </div>

      <CommentsTable comments={rows} />
    </div>
  );
}
