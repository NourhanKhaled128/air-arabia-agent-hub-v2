"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import AnnouncementRowActions from "./AnnouncementRowActions";
import { deleteManyAnnouncementsAction } from "@/app/admin/actions/announcement-actions";

type BadgeColor = "red" | "green" | "blue" | "yellow" | "gray";

const statusColor: Record<string, BadgeColor> = {
  Published: "green",
  Scheduled: "yellow",
  Draft: "gray",
};

const priorityColor: Record<string, BadgeColor> = {
  Critical: "red",
  High: "yellow",
  Medium: "blue",
  Low: "gray",
};

function formatDate(date: Date | null) {
  if (!date) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  status: string;
  audience: string | null;
  publishDate: Date | null;
  expiryDate: Date | null;
}

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementsTable({ announcements }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "title", label: "Title" },
        { key: "priority", label: "Priority" },
        { key: "status", label: "Status" },
        { key: "audience", label: "Audience" },
        { key: "publish", label: "Publish" },
        { key: "expiry", label: "Expiry" },
      ]}
      data={announcements}
      searchPlaceholder="Search announcements..."
      searchFn={(item, query) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          (item.audience ?? "").toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "Published", label: "Published" },
            { value: "Scheduled", label: "Scheduled" },
            { value: "Draft", label: "Draft" },
          ],
        },
        {
          key: "priority",
          label: "Priority",
          options: [
            { value: "Critical", label: "Critical" },
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" },
          ],
        },
      ]}
      filterFn={(item, values) => {
        if (values.status && item.status !== values.status) return false;
        if (values.priority && item.priority !== values.priority) return false;
        return true;
      }}
      onDeleteMany={deleteManyAnnouncementsAction}
      emptyMessage="No announcements yet."
      renderRow={(item) => (
        <>
          <td className="px-6 py-5 font-semibold">{item.title}</td>

          <td className="px-6 py-5">
            <AdminBadge color={priorityColor[item.priority] ?? "blue"}>
              {item.priority}
            </AdminBadge>
          </td>

          <td className="px-6 py-5">
            <AdminBadge color={statusColor[item.status] ?? "gray"}>
              {item.status}
            </AdminBadge>
          </td>

          <td className="px-6 py-5">{item.audience ?? "-"}</td>
          <td className="px-6 py-5">{formatDate(item.publishDate)}</td>
          <td className="px-6 py-5">{formatDate(item.expiryDate)}</td>

          <td className="px-6 py-5">
            <AnnouncementRowActions id={item.id} />
          </td>
        </>
      )}
    />
  );
}
