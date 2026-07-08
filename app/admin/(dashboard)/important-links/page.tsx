import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminListTable from "@/components/admin/AdminListTable";
import ImportantLinkRowActions from "@/components/admin/important-links/ImportantLinkRowActions";
import { getImportantLinks } from "@/lib/important-link-service";
import { deleteManyImportantLinksAction } from "@/app/admin/actions/important-link-actions";
import { getSidebarIcon } from "@/lib/sidebar-icons";
import { Link2, Eye } from "lucide-react";

export default async function ImportantLinksPage() {
  const links = await getImportantLinks();

  const visibleCount = links.filter((l) => l.visible).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Important Links"
        description="Curate the important links shown to agents in the sidebar and on the home page."
        actions={
          <AdminButton href="/admin/important-links/new">
            + New Link
          </AdminButton>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminStatCard title="Total Links" value={links.length} icon={Link2} />
        <AdminStatCard title="Visible" value={visibleCount} icon={Eye} color="text-emerald-700" />
      </div>

      <AdminListTable
        columns={[
          { key: "title", label: "Title" },
          { key: "url", label: "URL" },
          { key: "order", label: "Order" },
          { key: "visible", label: "Visible" },
        ]}
        data={links}
        searchPlaceholder="Search important links..."
        searchFn={(link, query) => {
          const q = query.toLowerCase();
          return (
            link.title.toLowerCase().includes(q) ||
            link.url.toLowerCase().includes(q) ||
            (link.description ?? "").toLowerCase().includes(q)
          );
        }}
        filters={[
          {
            key: "visible",
            label: "Visibility",
            options: [
              { value: "visible", label: "Visible" },
              { value: "hidden", label: "Hidden" },
            ],
          },
        ]}
        filterFn={(link, values) => {
          if (values.visible === "visible" && !link.visible) return false;
          if (values.visible === "hidden" && link.visible) return false;
          return true;
        }}
        onDeleteMany={deleteManyImportantLinksAction}
        emptyMessage="No important links yet."
        renderRow={(link) => {
          const Icon = getSidebarIcon(link.icon);

          return (
            <>
              <td className="px-6 py-5">
                <span className="flex items-center gap-2 font-semibold">
                  <Icon size={18} className="text-slate-500" />
                  {link.title}
                </span>
              </td>

              <td className="px-6 py-5 text-slate-600">{link.url}</td>
              <td className="px-6 py-5 text-slate-600">{link.order}</td>

              <td className="px-6 py-5">
                <AdminBadge color={link.visible ? "green" : "gray"}>
                  {link.visible ? "Visible" : "Hidden"}
                </AdminBadge>
              </td>

              <td className="px-6 py-5">
                <ImportantLinkRowActions id={link.id} />
              </td>
            </>
          );
        }}
      />
    </div>
  );
}
