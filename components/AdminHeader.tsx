"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminSearchableArticle {
  id: number;
  title: string;
  category: string;
  status: string;
}

interface Props {
  articles: AdminSearchableArticle[];
  user?: {
    name: string;
    role: string;
  } | null;
}

export default function AdminHeader({ articles, user }: Props) {
  const { toggleMobileOpen } = useSidebarPrefs();

  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q)
    );
  }, [query, articles]);

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-surface px-4 py-4 shadow-sm sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-center gap-3">

        <button
          onClick={toggleMobileOpen}
          className="rounded-xl border border-slate-200 dark:border-border-subtle p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-muted lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Air Arabia CMS
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Knowledge Management System
          </p>
        </div>

      </div>

      <div className="flex items-center gap-3 sm:gap-6">

        <div className="relative w-full sm:w-64 lg:w-80">

          <Search
            className="absolute left-4 top-3.5 text-slate-400"
            size={18}
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-xl border border-slate-300 dark:border-border-subtle py-3 pl-11 pr-4 outline-none focus:border-brand"
          />

          {query && (
            <div className="absolute left-0 right-0 top-14 z-50 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-surface shadow-2xl">
              {results.length === 0 ? (
                <p className="p-5 text-center text-slate-500 dark:text-slate-400">
                  No results found.
                </p>
              ) : (
                results.slice(0, 8).map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/articles/${article.id}`}
                    onClick={() => setQuery("")}
                    className="block border-b border-slate-100 dark:border-border-subtle p-4 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {article.title}
                      </span>

                      <span className="rounded-full bg-red-100 dark:bg-red-950/40 px-3 py-1 text-xs font-semibold text-brand">
                        {article.category}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

        </div>

        <button
          onClick={() => window.dispatchEvent(new Event("admin:open-command-palette"))}
          title="Jump to a page or article (Ctrl+K)"
          className="hidden items-center gap-2 rounded-xl border border-slate-200 dark:border-border-subtle px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-surface-muted sm:flex"
        >
          <span className="text-sm">Jump to...</span>
          <kbd className="rounded-md border border-slate-200 dark:border-border-subtle px-1.5 py-0.5 text-xs">
            Ctrl K
          </kbd>
        </button>

        <ThemeToggle />

        <button className="relative rounded-full bg-slate-100 dark:bg-background p-3 transition hover:bg-red-50 dark:hover:bg-red-950/40">
          <Bell size={20} />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-600"></span>
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-background px-4 py-2">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>

          <div className="hidden sm:block">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {user?.name ?? "Not signed in"}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user?.role ?? ""}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}
