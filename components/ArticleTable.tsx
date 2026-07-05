"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye } from "lucide-react";
import { articles } from "@/Data/articles";

export default function ArticleTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Title
            </th>

            <th className="px-6 py-4 text-left">
              Category
            </th>

            <th className="px-6 py-4 text-left">
              Updated
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {articles.map((article) => (

            <tr
              key={article.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-6 py-5 font-semibold">

                {article.title}

              </td>

              <td className="px-6 py-5">

                {article.category}

              </td>

              <td className="px-6 py-5">

                {article.lastUpdated}

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-center gap-3">

                  <Link
                    href={`/knowledge/${article.slug}`}
                    className="rounded-lg bg-blue-100 p-2 text-blue-700"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="rounded-lg bg-yellow-100 p-2 text-yellow-700"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    className="rounded-lg bg-red-100 p-2 text-red-700"
                  >
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