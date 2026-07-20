import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import ImportantLinkForm from "@/components/admin/important-links/ImportantLinkForm";
import { getImportantLinkById } from "@/lib/important-link-service";
import { updateImportantLinkAction } from "@/app/admin/actions/important-link-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditImportantLinkPage({ params }: Props) {
  const { id } = await params;
  const linkId = Number(id);

  if (!Number.isInteger(linkId)) {
    notFound();
  }

  const link = await getImportantLinkById(linkId);

  if (!link) {
    notFound();
  }

  const boundUpdate = updateImportantLinkAction.bind(null, linkId);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Edit Important Link"
        breadcrumbs={[{ label: "Important Links", href: "/admin/important-links" }, { label: link.title }]}
      />

      <AdminFormCard title="Link Details">
        <ImportantLinkForm
          action={boundUpdate}
          submitLabel="Save Changes"
          link={link}
        />
      </AdminFormCard>
    </div>
  );
}
