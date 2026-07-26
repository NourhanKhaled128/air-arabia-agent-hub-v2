"use client";

import AdminBadge from "@/components/admin/AdminBadge";
import ScheduledChangeRowActions from "./ScheduledChangeRowActions";

interface ScheduledChangeRow {
  id: number;
  entityType: string;
  entityId: number;
  label: string;
  effectiveDate: Date;
  status: string;
  failureReason: string | null;
  createdBy: string;
}

interface Props {
  changes: ScheduledChangeRow[];
}

const STATUS_COLOR: Record<string, "yellow" | "green" | "red" | "gray"> = {
  Pending: "yellow",
  Applied: "green",
  Failed: "red",
  Cancelled: "gray",
};

export default function ScheduledChangesTable({ changes }: Props) {
  if (changes.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
        No scheduled changes yet — use &quot;Schedule for later&quot; on an article or decision tree edit to stage one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-sm">
            <th className="px-6 py-4">Label</th>
            <th className="px-6 py-4">Entity</th>
            <th className="px-6 py-4">Effective date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Scheduled by</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {changes.map((change) => (
            <tr key={change.id} className="border-t align-top">
              <td className="px-6 py-5 font-semibold">
                {change.label}
                {change.status === "Failed" && change.failureReason && (
                  <p className="mt-1 text-xs font-normal text-red-600">{change.failureReason}</p>
                )}
              </td>
              <td className="px-6 py-5 text-sm text-slate-600">
                {change.entityType} #{change.entityId}
              </td>
              <td className="px-6 py-5 text-sm">{new Date(change.effectiveDate).toLocaleString()}</td>
              <td className="px-6 py-5">
                <AdminBadge color={STATUS_COLOR[change.status] ?? "gray"}>{change.status}</AdminBadge>
              </td>
              <td className="px-6 py-5 text-sm text-slate-600">{change.createdBy}</td>
              <td className="px-6 py-5">
                <ScheduledChangeRowActions id={change.id} status={change.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
