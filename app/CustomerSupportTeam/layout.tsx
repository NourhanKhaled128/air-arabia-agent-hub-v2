import { Suspense } from "react";
import CustomerSupportSidebar from "@/components/customer-support-team/CustomerSupportSidebar";
import Header from "@/components/Header";
import PortalMain from "@/components/PortalMain";
import { SidebarPrefsProvider } from "@/components/SidebarPrefsProvider";
import { getArticlesForSearch } from "@/lib/article-service";
import { getCategoryBySlug, getCategoryFolders } from "@/lib/category-service";
import { getVisibleImportantLinks } from "@/lib/important-link-service";

const CATEGORY_SLUG = "customer-support-team";

interface Props {
  children: React.ReactNode;
}

export default async function CustomerSupportTeamLayout({ children }: Props) {
  const category = await getCategoryBySlug(CATEGORY_SLUG);

  const [allFolders, allArticles, importantLinks] = await Promise.all([
    category ? getCategoryFolders(category.id) : Promise.resolve([]),
    getArticlesForSearch(),
    getVisibleImportantLinks(),
  ]);

  const folders = allFolders.filter((f) => f.visible);
  const articles = allArticles.filter((a) => a.category === "Customer Support Team");

  return (
    <SidebarPrefsProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-background">

        <Suspense fallback={null}>
          <CustomerSupportSidebar folders={folders} importantLinks={importantLinks} />
        </Suspense>

        <PortalMain>

          <Header articles={articles} basePath="/CustomerSupportTeam" />

          <div className="mt-4 space-y-8 sm:mt-8">

            {children}

          </div>

        </PortalMain>

      </div>
    </SidebarPrefsProvider>
  );
}
