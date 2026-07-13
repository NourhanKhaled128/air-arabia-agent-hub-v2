"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import DispositionRowActions from "./DispositionRowActions";
import { deleteManyDispositionCodesAction } from "@/app/admin/actions/disposition-actions";

interface Disposition {
  id: number;
  code: string;
  label: string;
  description: string | null;
  category: string | null;
  active: boolean;
}

interface Props {
  dispositions: Disposition[];
}

export default function DispositionCodesTable({ dispositions }: Props) {
  const categoryOptions = Array.from(
    new Set(dispositions.map((d) => d.category).filter((c): c is string => Boolean(c)))
  )
    .sort()
    .map((category) => ({ value: category, label: category }));

  return (
    <AdminListTable
      columns={[
        { key: "category", label: "Category" },
        { key: "code", label: "Code" },
        { key: "label", label: "Label" },
        { key: "description", label: "Description" },
        { key: "status", label: "Status" },
      ]}
      data={dispositions}
      searchPlaceholder="Search disposition codes..."
      searchFn={(item, query) => {
        const q = query.toLowerCase();
        return (
          item.code.toLowerCase().includes(q) ||
          item.label.toLowerCase().includes(q) ||
          (item.category ?? "").toLowerCase().includes(q) ||
          (item.description ?? "").toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "category",
          label: "Category",
          options: categoryOptions,
        },
        {
          key: "active",
          label: "Status",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
      ]}
      filterFn={(item, values) => {
        if (values.category && item.category !== values.category) return false;
        if (values.active === "active" && !item.active) return false;
        if (values.active === "inactive" && item.active) return false;
        return true;
      }}
      onDeleteMany={deleteManyDispositionCodesAction}
      emptyMessage="No disposition codes yet."
      renderRow={(disposition) => (
        <>
          <td className="px-6 py-5 text-slate-500">{disposition.category ?? "-"}</td>
          <td className="px-6 py-5 font-semibold">{disposition.code}</td>
          <td className="px-6 py-5">{disposition.label}</td>
          <td className="px-6 py-5 text-slate-500">{disposition.description ?? "-"}</td>
          <td className="px-6 py-5">
            <AdminBadge color={disposition.active ? "green" : "gray"}>
              {disposition.active ? "Active" : "Inactive"}
            </AdminBadge>
          </td>
          <td className="px-6 py-5">
            <DispositionRowActions id={disposition.id} />
          </td>
        </>
      )}
    />
  );
}
