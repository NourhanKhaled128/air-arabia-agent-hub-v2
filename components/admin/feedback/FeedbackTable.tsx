"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import FeedbackRowActions from "./FeedbackRowActions";
import { deleteManyFeedbackAction } from "@/app/admin/actions/feedback-actions";

interface FeedbackItem {
  id: number;
  articleTitle: string;
  authorName: string;
  helpful: boolean;
  message: string;
  status: string;
  createdAt: Date;
}

interface Props {
  feedback: FeedbackItem[];
}

export default function FeedbackTable({ feedback }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "article", label: "Article" },
        { key: "author", label: "Champion" },
        { key: "helpful", label: "Helpful?" },
        { key: "message", label: "Message" },
        { key: "status", label: "Status" },
      ]}
      data={feedback}
      searchPlaceholder="Search feedback..."
      searchFn={(item, query) => {
        const q = query.toLowerCase();
        return (
          item.articleTitle.toLowerCase().includes(q) ||
          item.authorName.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "New", label: "New" },
            { value: "Reviewed", label: "Reviewed" },
          ],
        },
      ]}
      filterFn={(item, values) => {
        if (values.status && item.status !== values.status) return false;
        return true;
      }}
      onDeleteMany={deleteManyFeedbackAction}
      emptyMessage="No feedback yet."
      renderRow={(item) => (
        <>
          <td className="px-6 py-5 font-semibold">{item.articleTitle}</td>
          <td className="px-6 py-5">{item.authorName}</td>
          <td className="px-6 py-5">
            <AdminBadge color={item.helpful ? "green" : "red"}>
              {item.helpful ? "Helpful" : "Not helpful"}
            </AdminBadge>
          </td>
          <td className="px-6 py-5 max-w-md text-slate-600">{item.message || "-"}</td>
          <td className="px-6 py-5">
            <AdminBadge color={item.status === "Reviewed" ? "blue" : "yellow"}>
              {item.status}
            </AdminBadge>
          </td>
          <td className="px-6 py-5">
            <FeedbackRowActions id={item.id} status={item.status} />
          </td>
        </>
      )}
    />
  );
}
