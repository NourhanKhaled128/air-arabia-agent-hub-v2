"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Globe,
  Archive,
  Copy,
  Send,
} from "lucide-react";

import {
  deleteArticleAction,
  deleteManyArticlesAction,
  publishArticleAction,
  archiveArticleAction,
  publishManyArticlesAction,
  archiveManyArticlesAction,
  duplicateArticleAction,
  submitArticleForReviewAction,
} from "@/app/admin/actions/article-actions";
import AdminListTable from "@/components/admin/AdminListTable";

interface Article {
  id: number;
  title: string;
  category: string;
  status: string;
  author: string;
  updatedAt: Date;
}

interface Props {
  articles: Article[];
}

export default function ArticleTable({ articles }: Props) {
  const [isPending, startTransition] = useTransition();

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(articles.map((a) => a.category).filter(Boolean))).map((category) => ({
        value: category,
        label: category,
      })),
    [articles]
  );

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

  return (
    <AdminListTable
      columns={[
        { key: "title", label: "Article" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
        { key: "author", label: "Author" },
        { key: "updatedAt", label: "Updated" },
      ]}
      data={articles}
      searchPlaceholder="Search articles..."
      searchFn={(article, query) => {
        const q = query.toLowerCase();
        return (
          article.title.toLowerCase().includes(q) ||
          article.category.toLowerCase().includes(q) ||
          article.author.toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "Published", label: "Published" },
            { value: "Draft", label: "Draft" },
            { value: "Review", label: "Review" },
            { value: "Archived", label: "Archived" },
          ],
        },
        {
          key: "category",
          label: "Category",
          options: categoryOptions,
        },
      ]}
      filterFn={(article, values) => {
        if (values.status && article.status !== values.status) return false;
        if (values.category && article.category !== values.category) return false;
        return true;
      }}
      onDeleteMany={deleteManyArticlesAction}
      extraBulkActions={[
        { label: "Publish Selected", icon: Globe, onAction: publishManyArticlesAction },
        { label: "Archive Selected", icon: Archive, onAction: archiveManyArticlesAction },
      ]}
      emptyMessage="No articles yet."
      renderRow={(article) => (
        <>
          <td className="px-6 py-5 font-medium">
            {article.title}
          </td>

          <td className="px-6 py-5">
            {article.category}
          </td>

          <td className="px-6 py-5">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                article.status === "Published"
                  ? "bg-emerald-100 text-emerald-700"
                  : article.status === "Archived"
                  ? "bg-slate-200 text-slate-700"
                  : article.status === "Review"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {article.status}
            </span>
          </td>

          <td className="px-6 py-5">
            {article.author}
          </td>

          <td className="px-6 py-5">
            {new Date(article.updatedAt).toLocaleDateString()}
          </td>

          <td className="px-6 py-5">
            <div className="flex justify-center gap-2">

              <Link
                href={`/admin/articles/${article.id}`}
                className="rounded-lg border p-2 hover:bg-slate-100"
              >
                <Pencil size={18} />
              </Link>

              {article.status === "Draft" && (
                <button
                  disabled={isPending}
                  onClick={() =>
                    run(() =>
                      submitArticleForReviewAction(article.id)
                    )
                  }
                  title="Submit for Review"
                  className="rounded-lg border p-2 hover:bg-blue-50"
                >
                  <Send size={18} />
                </button>
              )}

              <button
                disabled={isPending}
                onClick={() =>
                  run(() =>
                    publishArticleAction(article.id)
                  )
                }
                title="Publish"
                className="rounded-lg border p-2 hover:bg-green-50"
              >
                <Globe size={18} />
              </button>

              <button
                disabled={isPending}
                onClick={() =>
                  run(() =>
                    archiveArticleAction(article.id)
                  )
                }
                className="rounded-lg border p-2 hover:bg-yellow-50"
              >
                <Archive size={18} />
              </button>

              <button
                disabled={isPending}
                onClick={() =>
                  run(() =>
                    duplicateArticleAction(article.id)
                  )
                }
                className="rounded-lg border p-2 hover:bg-slate-100"
              >
                <Copy size={18} />
              </button>

              <button
                disabled={isPending}
                onClick={() => {
                  if (
                    confirm(
                      "Delete this article permanently?"
                    )
                  ) {
                    run(() =>
                      deleteArticleAction(article.id)
                    );
                  }
                }}
                className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>

            </div>
          </td>
        </>
      )}
    />
  );
}
