"use client";

import { ImageIcon, FileText } from "lucide-react";
import AdminListTable from "@/components/admin/AdminListTable";
import MediaRowActions from "./MediaRowActions";
import { deleteManyMediaFilesAction } from "@/app/admin/actions/media-actions";
import { formatFileSize, formatRelativeTime } from "@/lib/format";

interface MediaFile {
  id: number;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

interface Props {
  files: MediaFile[];
}

export default function MediaTable({ files }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "name", label: "File" },
        { key: "type", label: "Type" },
        { key: "size", label: "Size" },
        { key: "uploaded", label: "Uploaded" },
      ]}
      data={files}
      searchPlaceholder="Search media..."
      searchFn={(file, query) => file.name.toLowerCase().includes(query.toLowerCase())}
      filters={[
        {
          key: "type",
          label: "Type",
          options: [
            { value: "image", label: "Images" },
            { value: "other", label: "Other Files" },
          ],
        },
      ]}
      filterFn={(file, values) => {
        const isImage = file.mimeType.startsWith("image/");
        if (values.type === "image" && !isImage) return false;
        if (values.type === "other" && isImage) return false;
        return true;
      }}
      onDeleteMany={deleteManyMediaFilesAction}
      emptyMessage="No files uploaded yet."
      renderRow={(file) => {
        const isImage = file.mimeType.startsWith("image/");

        return (
          <>
            <td className="px-6 py-5">
              <span className="flex items-center gap-3">
                {isImage ? (
                  <ImageIcon className="text-red-700" size={20} />
                ) : (
                  <FileText className="text-blue-700" size={20} />
                )}
                {file.name}
              </span>
            </td>

            <td className="px-6 py-5">{isImage ? "Image" : file.mimeType}</td>
            <td className="px-6 py-5">{formatFileSize(file.size)}</td>
            <td className="px-6 py-5">{formatRelativeTime(file.uploadedAt)}</td>

            <td className="px-6 py-5">
              <MediaRowActions id={file.id} url={file.url} />
            </td>
          </>
        );
      }}
    />
  );
}
