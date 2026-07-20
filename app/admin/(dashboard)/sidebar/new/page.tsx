import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import SidebarLinkForm from "@/components/admin/sidebar/SidebarLinkForm";
import { createSidebarLinkAction } from "@/app/admin/actions/sidebar-actions";

export default function NewSidebarLinkPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New Sidebar Link"
        breadcrumbs={[{ label: "Sidebar Links", href: "/admin/sidebar" }, { label: "New Sidebar Link" }]}
      />

      <AdminFormCard title="Link Details">
        <SidebarLinkForm action={createSidebarLinkAction} />
      </AdminFormCard>
    </div>
  );
}
