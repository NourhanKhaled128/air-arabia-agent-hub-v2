import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getArticlesForSearch } from "@/lib/article-service";
import { getVisibleCategoriesForSidebar } from "@/lib/category-service";
import { getVisibleSidebarLinksBySection } from "@/lib/sidebar-service";

interface Props {
  children: React.ReactNode;
}

export default async function AppLayout({
  children,
}: Props) {
  const [articles, categories, pinnedLinks, toolLinks] = await Promise.all([
    getArticlesForSearch(),
    getVisibleCategoriesForSidebar(),
    getVisibleSidebarLinksBySection("pinned"),
    getVisibleSidebarLinksBySection("tools"),
  ]);

  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar
        categories={categories}
        pinnedLinks={pinnedLinks}
        toolLinks={toolLinks}
      />

      <main className="ml-72">

        <div className="px-8 py-6">

          <Header articles={articles} />

          <div className="mt-8 space-y-8">

            {children}

          </div>

        </div>

      </main>

    </div>
  );
}