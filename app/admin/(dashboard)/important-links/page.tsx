import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import ImportantLinksManager from "@/components/admin/important-links/ImportantLinksManager";
import { getImportantLinks } from "@/lib/important-link-service";
import { Link2, Eye } from "lucide-react";

export default async function ImportantLinksPage() {
  const links = await getImportantLinks();

  const visibleCount = links.filter((l) => l.visible).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Important Links"
        description="Curate the important links shown to agents in the sidebar and on the home page. Drag to reorder."
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

      <ImportantLinksManager links={links} />
    </div>
  );
}
