import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PortalMain from "@/components/PortalMain";
import { SidebarPrefsProvider } from "@/components/SidebarPrefsProvider";
import { getArticlesForSearch } from "@/lib/article-service";
import { getVisibleCategoriesForSidebar } from "@/lib/category-service";
import { getVisibleSidebarLinksBySection } from "@/lib/sidebar-service";

interface Props {
  children: React.ReactNode;
}

export default async function PortalLayout({ children }: Props) {
  const [articles, categories, pinnedLinks, toolLinks] = await Promise.all([
    getArticlesForSearch(),
    getVisibleCategoriesForSidebar(),
    getVisibleSidebarLinksBySection("pinned"),
    getVisibleSidebarLinksBySection("tools"),
  ]);

  return (
    <SidebarPrefsProvider>
      <div className="min-h-screen bg-gray-100">

        <Sidebar
          categories={categories}
          pinnedLinks={pinnedLinks}
          toolLinks={toolLinks}
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
