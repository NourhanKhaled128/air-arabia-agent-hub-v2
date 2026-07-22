import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PortalMain from "@/components/PortalMain";
import { SidebarPrefsProvider } from "@/components/SidebarPrefsProvider";
import { getArticlesForSearch } from "@/lib/article-service";
import { getVisibleCategoriesForSidebar } from "@/lib/category-service";
import { getVisibleSidebarLinksBySection } from "@/lib/sidebar-service";
import { getVisibleImportantLinks } from "@/lib/important-link-service";
import { CUSTOMER_SUPPORT_TEAM_GROUP } from "@/lib/customer-support-team";
import { TRADE_SUPPORT_TEAM_GROUP } from "@/lib/trade-support-team";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getDecisionTreesForSearch } from "@/lib/decision-tree-service";

interface Props {
  children: React.ReactNode;
}

export default async function PortalLayout({ children }: Props) {
  const [articles, allCategories, pinnedLinks, toolLinks, importantLinks, portalUser, decisionTrees] = await Promise.all([
    getArticlesForSearch(),
    getVisibleCategoriesForSidebar(),
    getVisibleSidebarLinksBySection("pinned"),
    getVisibleSidebarLinksBySection("tools"),
    getVisibleImportantLinks(),
    getCurrentPortalUser(),
    getDecisionTreesForSearch(),
  ]);

  // Any category in the Customer Support Team or Trade Support Team sidebar group
  // belongs to its own separated section (see app/CustomerSupportTeam/ and
  // app/TradeSupportTeam/), reached via the pinned sidebar link instead.
  const categories = allCategories.filter(
    (c) => c.group !== CUSTOMER_SUPPORT_TEAM_GROUP && c.group !== TRADE_SUPPORT_TEAM_GROUP
  );

  return (
    <SidebarPrefsProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-background">

        <Sidebar
          categories={categories}
          pinnedLinks={pinnedLinks}
          toolLinks={toolLinks}
          importantLinks={importantLinks}
        />

        <PortalMain>

          <Header articles={articles} decisionTrees={decisionTrees} portalUserName={portalUser?.name ?? null} />

          <div className="mt-4 space-y-8 sm:mt-8">

            {children}

          </div>

        </PortalMain>

      </div>
    </SidebarPrefsProvider>
  );
}
