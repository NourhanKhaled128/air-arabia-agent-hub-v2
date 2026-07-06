import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getAllArticles } from "@/lib/article-service";
import { getVisibleCategoriesForSidebar } from "@/lib/category-service";

interface Props {
  children: React.ReactNode;
}

export default async function AppLayout({
  children,
}: Props) {
  const [articles, categories] = await Promise.all([
    getAllArticles(),
    getVisibleCategoriesForSidebar(),
  ]);

  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar categories={categories} />

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