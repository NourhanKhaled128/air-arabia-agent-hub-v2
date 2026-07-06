"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye } from "lucide-react";

interface Column {
  key: string;
  label: string;
}

interface AdminDataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  editBasePath?: string;
}

export default function AdminDataTable({
  columns,
  data,
  editBasePath,
}: AdminDataTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-slate-50">

          <tr>

            {columns.map((column) => (

              <th
                key={column.key}
                className="px-6 py-4 text-left"
              >
                {column.label}
              </th>

            ))}

            <th className="px-6 py-4 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((row) => (

            <tr
              key={row.id}
              className="border-t"
            >

              {columns.map((column) => (

                <td
                  key={column.key}
                  className="px-6 py-5"
                >
                  {row[column.key]}
                </td>

              ))}

              <td className="px-6 py-5">

                <div className="flex gap-2">

                  <button className="rounded-lg border p-2 hover:bg-slate-50">

                    <Eye size={18} />

                  </button>

                  {editBasePath && (

                    <Link
                      href={`${editBasePath}/${row.id}`}
                      className="rounded-lg border p-2 hover:bg-slate-50"
                    >
                      <Pencil size={18} />
                    </Link>

                  )}

                  <button className="rounded-lg border p-2 hover:bg-red-50">

                    <Trash2 size={18} />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}