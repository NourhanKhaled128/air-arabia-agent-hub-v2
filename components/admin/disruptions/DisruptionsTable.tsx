"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import DisruptionRowActions from "./DisruptionRowActions";
import { deleteManyDisruptionsAction } from "@/app/admin/actions/disruption-actions";

const levelStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

interface Disruption {
  id: number;
  airportCode: string;
  message: string;
  level: string;
  active: boolean;
}

interface Props {
  disruptions: Disruption[];
}

export default function DisruptionsTable({ disruptions }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "airportCode", label: "Airport" },
        { key: "message", label: "Message" },
        { key: "level", label: "Level" },
        { key: "active", label: "Active" },
      ]}
      data={disruptions}
      searchPlaceholder="Search disruptions..."
      searchFn={(item, query) => {
        const q = query.toLowerCase();
        return (
          item.airportCode.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "level",
          label: "Level",
          options: [
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" },
          ],
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
        if (values.level && item.level !== values.level) return false;
        if (values.active === "active" && !item.active) return false;
        if (values.active === "inactive" && item.active) return false;
        return true;
      }}
      onDeleteMany={deleteManyDisruptionsAction}
      emptyMessage="No alerts yet."
      renderRow={(disruption) => (
        <>
          <td className="px-6 py-5 font-bold">{disruption.airportCode}</td>
          <td className="px-6 py-5 text-slate-600">{disruption.message}</td>
          <td className="px-6 py-5">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                levelStyles[disruption.level] ?? "bg-slate-100 text-slate-700"
              }`}
            >
              {disruption.level}
            </span>
          </td>
          <td className="px-6 py-5">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                disruption.active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {disruption.active ? "Active" : "Inactive"}
            </span>
          </td>
          <td className="px-6 py-5">
            <DisruptionRowActions id={disruption.id} />
          </td>
        </>
      )}
    />
  );
}
