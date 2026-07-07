import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import SidebarLinkRowActions from "@/components/admin/sidebar/SidebarLinkRowActions";
import { getSidebarLinks } from "@/lib/sidebar-service";
import { getSidebarIcon } from "@/lib/sidebar-icons";
import { PanelLeft, Pin, Wrench, Zap } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  pinned: "Pinned Knowledge",
  tools: "Agent Tools",
  quickActions: "Quick Actions",
};

export default async function SidebarLinksPage() {
  const links = await getSidebarLinks();

  const pinnedCount = links.filter((l) => l.section === "pinned").length;
  const toolsCount = links.filter((l) => l.section === "tools").length;
  const quickActionsCount = links.filter((l) => l.section === "quickActions").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Agent Sidebar"
        description="Manage the Pinned Knowledge, Agent Tools, and Quick Actions links shown in the agent portal."
        actions={
          <AdminButton href="/admin/sidebar/new">
            + New Link
          </AdminButton>
        }
      />

      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard title="Total Links" value={links.length} icon={PanelLeft} />
        <AdminStatCard title="Pinned Knowledge" value={pinnedCount} icon={Pin} color="text-blue-700" />
        <AdminStatCard title="Agent Tools" value={toolsCount} icon={Wrench} color="text-emerald-700" />
        <AdminStatCard title="Quick Actions" value={quickActionsCount} icon={Zap} color="text-amber-700" />
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Label</th>
              <th className="px-6 py-4">Href</th>
              <th className="px-6 py-4">Section</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Visible</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {links.map((link) => {
              const Icon = getSidebarIcon(link.icon);

              return (
                <tr key={link.id} className="border-t">
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-2 font-semibold">
                      <Icon size={18} className="text-slate-500" />
                      {link.label}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-slate-600">{link.href}</td>

                  <td className="px-6 py-5 text-slate-600">
                    {SECTION_LABELS[link.section] ?? link.section}
                  </td>

                  <td className="px-6 py-5 text-slate-600">{link.order}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        link.visible
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {link.visible ? "Visible" : "Hidden"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <SidebarLinkRowActions id={link.id} />
                  </td>
                </tr>
              );
            })}

            {links.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  No sidebar links yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
