"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search, Trash2, type LucideIcon } from "lucide-react";
import AdminBulkActionsBar from "./AdminBulkActionsBar";
import AdminPagination from "./AdminPagination";

export interface ExtraBulkAction {
  label: string;
  icon: LucideIcon;
  onAction: (ids: number[]) => Promise<void>;
}

const PAGE_SIZE = 20;

interface Column {
  key: string;
  label: string;
}

interface FilterDef {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface Props<T extends { id: number }> {
  columns: Column[];
  data: T[];
  searchPlaceholder?: string;
  searchFn: (row: T, query: string) => boolean;
  filters?: FilterDef[];
  filterFn?: (row: T, filterValues: Record<string, string>) => boolean;
  renderRow: (row: T) => ReactNode;
  onDeleteMany: (ids: number[]) => Promise<void>;
  extraBulkActions?: ExtraBulkAction[];
  emptyMessage?: string;
}

export default function AdminListTable<T extends { id: number }>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchFn,
  filters,
  filterFn,
  renderRow,
  onDeleteMany,
  extraBulkActions,
  emptyMessage = "No records found.",
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (query.trim() && !searchFn(row, query.trim())) return false;
      if (filterFn && Object.values(filterValues).some((v) => v) && !filterFn(row, filterValues)) return false;
      return true;
    });
  }, [data, query, filterValues, searchFn, filterFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const filterSignature = query + "|" + JSON.stringify(filterValues);
  const [lastFilterSignature, setLastFilterSignature] = useState(filterSignature);
  if (filterSignature !== lastFilterSignature) {
    setLastFilterSignature(filterSignature);
    setPage(1);
  }

  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const filteredIds = filtered.map((row) => row.id);
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));
  const someSelected = filteredIds.some((id) => selected.has(id));

  function toggleRow(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (allSelected) {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...filteredIds]);
    });
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected item(s) permanently?`)) return;

    setDeleting(true);
    try {
      await onDeleteMany(Array.from(selected));
      setSelected(new Set());
    } catch (error) {
      console.error(error);
      alert("Bulk delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleExtraAction(action: ExtraBulkAction) {
    if (selected.size === 0) return;

    setDeleting(true);
    try {
      await action.onAction(Array.from(selected));
      setSelected(new Set());
    } catch (error) {
      console.error(error);
      alert("Bulk action failed.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteAll() {
    if (filteredIds.length === 0) return;
    const label = query.trim() || someSelected ? "matching" : "all";
    if (!confirm(`Delete ${filteredIds.length} ${label} item(s) permanently? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      await onDeleteMany(filteredIds);
      setSelected(new Set());
    } catch (error) {
      console.error(error);
      alert("Bulk delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4"
          />
        </div>

        {filters?.map((filter) => (
          <select
            key={filter.key}
            value={filterValues[filter.key] ?? ""}
            onChange={(e) =>
              setFilterValues((prev) => ({ ...prev, [filter.key]: e.target.value }))
            }
            className="rounded-xl border border-gray-300 px-4 py-3"
          >
            <option value="">{filter.label}: All</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}

        <button
          type="button"
          disabled={filteredIds.length === 0 || deleting}
          onClick={handleDeleteAll}
          className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={16} />
          Delete All ({filteredIds.length})
        </button>
      </div>

      <AdminBulkActionsBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onDelete={handleDeleteSelected}
        deleting={deleting}
        extraActions={extraBulkActions?.map((action) => ({
          label: action.label,
          icon: action.icon,
          onClick: () => handleExtraAction(action),
        }))}
      />

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = !allSelected && someSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>

              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4">
                  {column.label}
                </th>
              ))}

              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-6 py-5">
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </td>

                {renderRow(row)}
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-10 text-center text-slate-500">
                  {data.length === 0 ? emptyMessage : "No records match your search/filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <AdminPagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
