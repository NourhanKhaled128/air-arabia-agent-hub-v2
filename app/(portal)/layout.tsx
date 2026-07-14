import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PortalMain from "@/components/PortalMain";
import { SidebarPrefsProvider } from "@/components/SidebarPrefsProvider";
import { getArticlesForSearch } from "@/lib/article-service";
import { getVisibleCategoriesForSidebar } from "@/lib/category-service";
import { getVisibleSidebarLinksBySection } from "@/lib/sidebar-service";
import { getVisibleImportantLinks } from "@/lib/important-link-service";
import { CUSTOMER_SUPPORT_TEAM_GROUP } from "@/lib/customer-support-team";

interface Props {
  children: React.ReactNode;
}

export default async function PortalLayout({ children }: Props) {
  const [articles, allCategories, pinnedLinks, toolLinks, importantLinks] = await Promise.all([
    getArticlesForSearch(),
    getVisibleCategoriesForSidebar(),
    getVisibleSidebarLinksBySection("pinned"),
    getVisibleSidebarLinksBySection("tools"),
    getVisibleImportantLinks(),
  ]);

  // Any category in the Customer Support Team sidebar group belongs to the separated
  // section (see app/CustomerSupportTeam/), reached via the pinned sidebar link instead.
  const categories = allCategories.filter((c) => c.group !== CUSTOMER_SUPPORT_TEAM_GROUP);

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

          <Header articles={articles} />

          <div className="mt-4 space-y-8 sm:mt-8">

            {children}

          </div>

        </PortalMain>

      </div>
    </SidebarPrefsProvider>
  );
}
