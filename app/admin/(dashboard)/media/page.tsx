import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MediaUploadForm from "@/components/admin/media/MediaUploadForm";
import MediaTable from "@/components/admin/media/MediaTable";
import { getMediaFiles } from "@/lib/media-service";

export default async function MediaLibraryPage() {
  const files = await getMediaFiles();

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Media Library"
        description="Upload and manage images and documents."
      />

      <MediaUploadForm />

      <MediaTable files={files} />

    </div>
  );
}
