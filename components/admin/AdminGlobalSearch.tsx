"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, BookOpen, FolderOpen, Bell } from "lucide-react";

interface ArticleResult {
  id: number;
  title: string;
  category: string;
  status: string;
}

interface CategoryResult {
  id: number;
  name: string;
  slug: string;
}

interface AnnouncementResult {
  id: number;
  title: string;
  status: string;
}

interface Props {
  articles: ArticleResult[];
  categories: CategoryResult[];
  announcements: AnnouncementResult[];
}

export default function AdminGlobalSearch({ articles, categories, announcements }: Props) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const matchedArticles = useMemo(
    () => (q ? articles.filter((a) => a.title.toLowerCase().includes(q)) : []),
    [q, articles]
  );

  const matchedCategories = useMemo(
    () => (q ? categories.filter((c) => c.name.toLowerCase().includes(q)) : []),
    [q, categories]
  );

  const matchedAnnouncements = useMemo(
    () => (q ? announcements.filter((a) => a.title.toLowerCase().includes(q)) : []),
    [q, announcements]
  );

  const hasResults =
    matchedArticles.length > 0 || matchedCategories.length > 0 || matchedAnnouncements.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white dark:bg-surface p-8 shadow-sm">
        <div className="flex items-center gap-4 rounded-xl border border-slate-300 dark:border-border-subtle px-5 py-4">
          <Search className="text-slate-500" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none"
            placeholder="Search articles, categories, announcements..."
          />
        </div>
      </div>

      {q === "" ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white dark:bg-surface p-8 shadow-sm">
            <BookOpen className="mb-4 text-red-700" />
            <h2 className="font-bold text-xl">Articles</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              {articles.length} published and draft articles.
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-surface p-8 shadow-sm">
            <FolderOpen className="mb-4 text-blue-700" />
            <h2 className="font-bold text-xl">Categories</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              {categories.length} categories.
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-surface p-8 shadow-sm">
            <Bell className="mb-4 text-amber-600" />
            <h2 className="font-bold text-xl">Announcements</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              {announcements.length} announcements.
            </p>
          </div>
        </div>
      ) : !hasResults ? (
        <div className="rounded-3xl bg-white dark:bg-surface p-10 text-center text-slate-500 dark:text-slate-400 shadow-sm">
          No results for &quot;{query}&quot;.
        </div>
      ) : (
        <div className="space-y-6">
          {matchedArticles.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-surface p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold">
                <BookOpen size={18} className="text-red-700" /> Articles
              </h3>
              <ul className="space-y-2">
                {matchedArticles.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-border-subtle px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <span>{a.title}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{a.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {matchedCategories.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-surface p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold">
                <FolderOpen size={18} className="text-blue-700" /> Categories
              </h3>
              <ul className="space-y-2">
                {matchedCategories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href="/admin/categories"
                      className="block rounded-xl border border-slate-100 dark:border-border-subtle px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {matchedAnnouncements.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-surface p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold">
                <Bell size={18} className="text-amber-600" /> Announcements
              </h3>
              <ul className="space-y-2">
                {matchedAnnouncements.map((a) => (
                  <li key={a.id}>
                    <Link
                      href="/admin/announcements"
                      className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-border-subtle px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <span>{a.title}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{a.status}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
