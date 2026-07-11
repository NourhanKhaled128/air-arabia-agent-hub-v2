import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminGlobalSearch from "@/components/admin/AdminGlobalSearch";
import { getAllArticles } from "@/lib/article-service";
import { getCategories } from "@/lib/category-service";
import { getAnnouncements } from "@/lib/announcement-service";

export default async function AdminSearchPage() {
  const [articles, categories, announcements] = await Promise.all([
    getAllArticles(),
    getCategories(),
    getAnnouncements(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Global Search" />

      <AdminGlobalSearch
        articles={articles.map((a) => ({ id: a.id, title: a.title, category: a.category, status: a.status }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        announcements={announcements.map((a) => ({ id: a.id, title: a.title, status: a.status }))}
      />
    </div>
  );
}
