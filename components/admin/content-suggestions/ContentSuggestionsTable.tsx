"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import ContentSuggestionRowActions from "./ContentSuggestionRowActions";
import { deleteManyContentSuggestionsAction } from "@/app/admin/actions/content-suggestion-actions";

interface Suggestion {
  id: number;
  description: string;
  status: string;
  createdAt: Date;
  article: { title: string };
  portalUser: { name: string; email: string } | null;
}

interface Props {
  suggestions: Suggestion[];
}

export default function ContentSuggestionsTable({ suggestions }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "article", label: "Article" },
        { key: "agent", label: "Agent" },
        { key: "description", label: "Suggestion" },
        { key: "status", label: "Status" },
      ]}
      data={suggestions}
      searchPlaceholder="Search suggestions..."
      searchFn={(item, query) => {
        const q = query.toLowerCase();
        return (
          item.article.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.portalUser?.name.toLowerCase().includes(q) ?? false)
        );
      }}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "New", label: "New" },
            { value: "Resolved", label: "Resolved" },
          ],
        },
      ]}
      filterFn={(item, values) => {
        if (values.status && item.status !== values.status) return false;
        return true;
      }}
      onDeleteMany={deleteManyContentSuggestionsAction}
      emptyMessage="No content suggestions yet."
      renderRow={(item) => (
        <>
          <td className="px-6 py-5 font-semibold">{item.article.title}</td>
          <td className="px-6 py-5 text-slate-600">{item.portalUser?.name ?? "—"}</td>
          <td className="px-6 py-5 max-w-md text-slate-600">{item.description}</td>
          <td className="px-6 py-5">
            <AdminBadge color={item.status === "New" ? "blue" : "green"}>{item.status}</AdminBadge>
          </td>
          <td className="px-6 py-5">
            <ContentSuggestionRowActions id={item.id} status={item.status} />
          </td>
        </>
      )}
    />
  );
}
