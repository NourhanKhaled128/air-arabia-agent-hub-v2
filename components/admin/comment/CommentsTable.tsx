"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import CommentRowActions from "./CommentRowActions";
import { deleteManyCommentsAction } from "@/app/admin/actions/comment-actions";

interface Comment {
  id: number;
  articleTitle: string;
  authorName: string;
  content: string;
  status: string;
  createdAt: Date;
}

interface Props {
  comments: Comment[];
}

export default function CommentsTable({ comments }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "article", label: "Article" },
        { key: "author", label: "Author" },
        { key: "content", label: "Comment" },
        { key: "status", label: "Status" },
      ]}
      data={comments}
      searchPlaceholder="Search comments..."
      searchFn={(item, query) => {
        const q = query.toLowerCase();
        return (
          item.articleTitle.toLowerCase().includes(q) ||
          item.authorName.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "Pending", label: "Pending" },
            { value: "Approved", label: "Approved" },
          ],
        },
      ]}
      filterFn={(item, values) => {
        if (values.status && item.status !== values.status) return false;
        return true;
      }}
      onDeleteMany={deleteManyCommentsAction}
      emptyMessage="No comments yet."
      renderRow={(comment) => (
        <>
          <td className="px-6 py-5 font-semibold">{comment.articleTitle}</td>
          <td className="px-6 py-5">{comment.authorName}</td>
          <td className="px-6 py-5 max-w-md text-slate-600">{comment.content}</td>
          <td className="px-6 py-5">
            <AdminBadge color={comment.status === "Approved" ? "green" : "yellow"}>
              {comment.status}
            </AdminBadge>
          </td>
          <td className="px-6 py-5">
            <CommentRowActions id={comment.id} status={comment.status} />
          </td>
        </>
      )}
    />
  );
}
