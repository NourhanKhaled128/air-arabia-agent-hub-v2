"use client";

import { Fragment, useMemo, useState } from "react";
import { ShieldCheck, Search, User, Clock, ChevronDown, ChevronRight } from "lucide-react";

interface AuditLogRow {
  id: number;
  action: string;
  entity: string;
  userName: string;
  createdAt: Date;
  // Typed loosely (not Record<string, unknown>) so this matches Prisma's JsonValue
  // shape for AuditLog.before/after without callers needing to cast.
  before?: unknown;
  after?: unknown;
}

interface Props {
  logs: AuditLogRow[];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/** Changed fields only — unchanged keys are noise in a diff view. */
function diffFields(
  beforeValue: unknown,
  afterValue: unknown
): { field: string; before: unknown; after: unknown }[] {
  const before = asRecord(beforeValue);
  const after = asRecord(afterValue);
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

  return Array.from(keys)
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
    .map((field) => ({ field, before: before[field], after: after[field] }));
}

function formatDiffValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value.length > 0 ? value : "(empty)";
  return String(value);
}

export default function AuditLogTable({ logs }: Props) {
  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const entityOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.entity))).sort(),
    [logs]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return logs.filter((log) => {
      if (entityFilter && log.entity !== entityFilter) return false;
      if (!q) return true;

      return (
        log.action.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q)
      );
    });
  }, [query, entityFilter, logs]);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-[200px] items-center gap-3 rounded-xl border px-4 py-3">
          <Search size={18} />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none"
            placeholder="Search audit logs..."
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none"
        >
          <option value="">All modules</option>
          {entityOptions.map((entity) => (
            <option key={entity} value={entity}>
              {entity}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left">Action</th>
            <th className="px-6 py-4 text-left">User</th>
            <th className="px-6 py-4 text-left">Module</th>
            <th className="px-6 py-4 text-left">Time</th>
            <th className="px-6 py-4 text-left"></th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                No audit log entries yet.
              </td>
            </tr>
          )}

          {filtered.map((log) => {
            const changes = diffFields(log.before, log.after);
            const hasDiff = changes.length > 0;
            const expanded = expandedId === log.id;

            return (
              <Fragment key={log.id}>
                <tr className="border-t">
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

                  <td className="px-6 py-5 text-right">
                    {hasDiff && (
                      <button
                        onClick={() => setExpandedId(expanded ? null : log.id)}
                        className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-brand"
                      >
                        {expanded ? "Hide" : "View"} changes
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    )}
                  </td>
                </tr>

                {expanded && hasDiff && (
                  <tr className="border-t bg-slate-50">
                    <td colSpan={5} className="px-6 py-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="py-1 pr-4">Field</th>
                            <th className="py-1 pr-4">Before</th>
                            <th className="py-1">After</th>
                          </tr>
                        </thead>
                        <tbody>
                          {changes.map((change) => (
                            <tr key={change.field} className="border-t border-slate-200">
                              <td className="py-2 pr-4 font-semibold text-slate-700">
                                {change.field}
                              </td>
                              <td className="py-2 pr-4 text-red-700 line-through decoration-red-400">
                                {formatDiffValue(change.before)}
                              </td>
                              <td className="py-2 text-emerald-700">
                                {formatDiffValue(change.after)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}
