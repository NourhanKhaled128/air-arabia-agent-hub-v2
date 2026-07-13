import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import SidebarLinksManager from "@/components/admin/sidebar/SidebarLinksManager";
import { getSidebarLinks } from "@/lib/sidebar-service";
import { PanelLeft, Pin, Wrench, Zap } from "lucide-react";

export default async function SidebarLinksPage() {
  const links = await getSidebarLinks();

  const pinnedCount = links.filter((l) => l.section === "pinned").length;
  const toolsCount = links.filter((l) => l.section === "tools").length;
  const quickActionsCount = links.filter((l) => l.section === "quickActions").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Champion Sidebar"
        description="Manage the Pinned Knowledge, Champion Tools, and Quick Actions links shown in the champion portal. Drag to reorder within a section."
        actions={
          <AdminButton href="/admin/sidebar/new">
            + New Link
          </AdminButton>
        }
      />

      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard title="Total Links" value={links.length} icon={PanelLeft} />
        <AdminStatCard title="Pinned Knowledge" value={pinnedCount} icon={Pin} color="text-blue-700" />
        <AdminStatCard title="Champion Tools" value={toolsCount} icon={Wrench} color="text-emerald-700" />
        <AdminStatCard title="Quick Actions" value={quickActionsCount} icon={Zap} color="text-amber-700" />
      </div>

      <SidebarLinksManager links={links} />
    </div>
  );
}
