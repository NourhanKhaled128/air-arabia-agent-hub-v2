"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, Search, User, Clock } from "lucide-react";

interface AuditLogRow {
  id: number;
  action: string;
  entity: string;
  userName: string;
  createdAt: Date;
}

interface Props {
  logs: AuditLogRow[];
}

export default function AuditLogTable({ logs }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return logs;

    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q)
    );
  }, [query, logs]);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3">
        <Search size={18} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none"
          placeholder="Search audit logs..."
        />
      </div>

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left">Action</th>
            <th className="px-6 py-4 text-left">User</th>
            <th className="px-6 py-4 text-left">Module</th>
            <th className="px-6 py-4 text-left">Time</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                No audit log entries yet.
              </td>
            </tr>
          )}

          {filtered.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="flex items-center gap-2 px-6 py-5">
                <ShieldCheck className="text-red-700" size={18} />
                {log.action} {log.entity}
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  {log.userName}
                </div>
              </td>

              <td className="px-6 py-5">{log.entity}</td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
