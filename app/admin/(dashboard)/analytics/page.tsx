import {
  Users,
  BookOpen,
  Folder,
  GraduationCap,
  Eye,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { getDashboardStats } from "@/lib/dashboard-service";
import { getTotalArticleViews } from "@/lib/article-service";
import { getUsers } from "@/lib/user-service";

export default async function AnalyticsPage() {
  const [stats, totalViews, users] = await Promise.all([
    getDashboardStats(),
    getTotalArticleViews(),
    getUsers(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Analytics"
        description="Real usage counts pulled directly from the database."
      />

      <div className="grid gap-6 md:grid-cols-5">
        <AdminStatCard title="Admin Users" value={users.length} icon={Users} />
        <AdminStatCard title="Articles" value={stats.articles} icon={BookOpen} color="text-blue-700" />
        <AdminStatCard title="Categories" value={stats.categories} icon={Folder} color="text-violet-700" />
        <AdminStatCard title="Training Courses" value={stats.courses} icon={GraduationCap} color="text-emerald-700" />
        <AdminStatCard title="Article Views" value={totalViews} icon={Eye} color="text-amber-700" />
      </div>

      <div className="rounded-3xl bg-white dark:bg-surface p-20 text-center shadow-sm text-slate-500 dark:text-slate-400">
        Charts will be added here.
      </div>
    </div>
  );
}
