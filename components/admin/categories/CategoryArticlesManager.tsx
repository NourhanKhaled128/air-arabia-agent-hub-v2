"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  moveArticleToFolderAction,
  moveManyArticlesToFolderAction,
} from "@/app/admin/actions/article-actions";

interface Folder {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  status: string;
  folderId: number | null;
}

interface Props {
  categoryId: number;
  articles: Article[];
  folders: Folder[];
}

export default function CategoryArticlesManager({ categoryId, articles, folders }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkFolder, setBulkFolder] = useState("");

  const folderName = useMemo(() => {
    const byId = new Map(folders.map((f) => [f.id, f.name]));
    return (folderId: number | null) => (folderId === null ? "Unfiled" : byId.get(folderId) ?? "Unfiled");
  }, [folders]);

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  function toggleRow(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === articles.length ? new Set() : new Set(articles.map((a) => a.id))));
  }

  function handleMove(articleId: number, value: string) {
    const folderId = value === "" ? null : Number(value);
    run(() => moveArticleToFolderAction(articleId, folderId, categoryId));
  }

  function handleBulkMove() {
    if (selected.size === 0 || bulkFolder === "") return;
    const folderId = bulkFolder === "unfiled" ? null : Number(bulkFolder);
    run(() => moveManyArticlesToFolderAction(Array.from(selected), folderId, categoryId));
    setSelected(new Set());
    setBulkFolder("");
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Articles</h2>

      {articles.length === 0 ? (
        <p className="text-slate-500">No articles in this category yet.</p>
      ) : (
        <>
          {selected.size > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
              <span className="font-semibold text-red-800">{selected.size} selected</span>

              <select
                value={bulkFolder}
                onChange={(e) => setBulkFolder(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Move to...</option>
                <option value="unfiled">Unfiled</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={bulkFolder === "" || isPending}
                onClick={handleBulkMove}
                className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              >
                Move
              </button>

              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === articles.length}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3">Article</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Folder</th>
                  <th className="px-4 py-3">Edit</th>
                </tr>
              </thead>

              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(article.id)}
                        onChange={() => toggleRow(article.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{article.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          article.status === "Published"
                            ? "bg-emerald-100 text-emerald-700"
                            : article.status === "Archived"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={article.folderId ?? ""}
                        disabled={isPending}
                        onChange={(e) => handleMove(article.id, e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        title={folderName(article.folderId)}
                      >
                        <option value="">Unfiled</option>
                        {folders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="rounded-lg border p-2 hover:bg-slate-100 inline-flex"
                      >
                        <Pencil size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
