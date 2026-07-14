import { Suspense } from "react";
import CustomerSupportSidebar from "@/components/customer-support-team/CustomerSupportSidebar";
import Header from "@/components/Header";
import PortalMain from "@/components/PortalMain";
import { SidebarPrefsProvider } from "@/components/SidebarPrefsProvider";
import { getArticlesForSearch } from "@/lib/article-service";
import { getVisibleCategoriesForSidebar } from "@/lib/category-service";
import { getVisibleImportantLinks } from "@/lib/important-link-service";
import { CUSTOMER_SUPPORT_TEAM_GROUP } from "@/lib/customer-support-team";

interface Props {
  children: React.ReactNode;
}

export default async function CustomerSupportTeamLayout({ children }: Props) {
  const [allCategories, allArticles, importantLinks] = await Promise.all([
    getVisibleCategoriesForSidebar(),
    getArticlesForSearch(),
    getVisibleImportantLinks(),
  ]);

  const categories = allCategories.filter((c) => c.group === CUSTOMER_SUPPORT_TEAM_GROUP);
  const categoryNames = new Set(categories.map((c) => c.name));
  const articles = allArticles.filter((a) => categoryNames.has(a.category));

  return (
    <SidebarPrefsProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-background">

        <Suspense fallback={null}>
          <CustomerSupportSidebar categories={categories} importantLinks={importantLinks} />
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
