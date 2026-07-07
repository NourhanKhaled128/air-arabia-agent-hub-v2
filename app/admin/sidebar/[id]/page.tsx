import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import SidebarLinkForm from "@/components/admin/sidebar/SidebarLinkForm";
import { getSidebarLinkById } from "@/lib/sidebar-service";
import { updateSidebarLinkAction } from "@/app/admin/actions/sidebar-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSidebarLinkPage({ params }: Props) {
  const { id } = await params;
  const linkId = Number(id);

  if (!Number.isInteger(linkId)) {
    notFound();
  }

  const link = await getSidebarLinkById(linkId);

  if (!link) {
    notFound();
  }

  const boundUpdate = updateSidebarLinkAction.bind(null, linkId);

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Edit Sidebar Link" />

      <AdminFormCard title="Link Details">
        <SidebarLinkForm
          action={boundUpdate}
          submitLabel="Save Changes"
          link={link}
        />
      </AdminFormCard>
    </div>
  );
}
