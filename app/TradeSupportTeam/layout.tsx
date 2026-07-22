import { Suspense } from "react";
import TradeSupportSidebar from "@/components/trade-support-team/TradeSupportSidebar";
import Header from "@/components/Header";
import PortalMain from "@/components/PortalMain";
import { SidebarPrefsProvider } from "@/components/SidebarPrefsProvider";
import { getArticlesForSearch } from "@/lib/article-service";
import { getVisibleCategoriesForSidebar } from "@/lib/category-service";
import { getVisibleImportantLinks } from "@/lib/important-link-service";
import { TRADE_SUPPORT_TEAM_GROUP } from "@/lib/trade-support-team";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getDecisionTreesForSearch } from "@/lib/decision-tree-service";

interface Props {
  children: React.ReactNode;
}

export default async function TradeSupportTeamLayout({ children }: Props) {
  const [allCategories, allArticles, importantLinks, portalUser, decisionTrees] = await Promise.all([
    getVisibleCategoriesForSidebar(),
    getArticlesForSearch(),
    getVisibleImportantLinks(),
    getCurrentPortalUser(),
    getDecisionTreesForSearch(),
  ]);

  const categories = allCategories.filter((c) => c.group === TRADE_SUPPORT_TEAM_GROUP);
  const categoryNames = new Set(categories.map((c) => c.name));
  const articles = allArticles.filter((a) => categoryNames.has(a.category));

  return (
    <SidebarPrefsProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-background">

        <Suspense fallback={null}>
          <TradeSupportSidebar categories={categories} importantLinks={importantLinks} />
        </Suspense>

        <PortalMain>

          <Header articles={articles} decisionTrees={decisionTrees} basePath="/TradeSupportTeam" portalUserName={portalUser?.name ?? null} />

          <div className="mt-4 space-y-8 sm:mt-8">

            {children}

          </div>

        </PortalMain>

      </div>
    </SidebarPrefsProvider>
  );
}
