"use client";

import { useMemo, useState } from "react";
import { Menu, Search } from "lucide-react";
import SearchDropdown, { type SearchableArticle } from "./SearchDropdown";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";

interface Props {
  articles: SearchableArticle[];
}

export default function Header({ articles }: Props) {

  const { toggleMobileOpen } = useSidebarPrefs();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [query, setQuery] = useState("");

  const results = useMemo(() => {

    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return articles.filter(article =>

      article.title.toLowerCase().includes(q) ||

      article.description.toLowerCase().includes(q) ||

      article.category.toLowerCase().includes(q) ||

      article.overview.toLowerCase().includes(q) ||

      article.keywords.some(k => k.value.toLowerCase().includes(q)) ||

      article.scenarios.some(s => s.situation.toLowerCase().includes(q)) ||

      article.procedures.some(p => p.content.toLowerCase().includes(q)) ||

      article.dispositions.some(d => d.content.toLowerCase().includes(q)) ||

      article.escalations.some(e => e.content.toLowerCase().includes(q)) ||

      article.notes.some(n => n.content.toLowerCase().includes(q))

    );

  }, [query, articles]);

  return (

    <header className="flex flex-col gap-4 rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface px-4 py-4 shadow-sm sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-center gap-3">

        <button
          onClick={toggleMobileOpen}
          className="rounded-xl border border-gray-200 dark:border-border-subtle p-2 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 sm:text-3xl">

            Welcome back, Nourhan 👋

          </h1>

          <p className="mt-2 text-gray-500 dark:text-slate-400">

            {today}

          </p>

        </div>

      </div>

      <div className="flex items-center gap-3 sm:gap-5">

        <div className="relative w-full sm:w-72 lg:w-96">

          <Search
            size={18}
            className="absolute left-4 top-4 text-gray-400 dark:text-slate-500"
          />

          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search procedures..."
            className="w-full rounded-xl border border-gray-300 dark:border-border-subtle py-3 pl-12 pr-4 outline-none focus:border-brand"
          />

          {query && (

            <SearchDropdown

              results={results}

              query={query}

              onClose={()=>setQuery("")}

            />

          )}

        </div>

        <ThemeToggle />

        <NotificationBell />

        <div className="flex items-center gap-3 rounded-xl bg-gray-100 dark:bg-background px-4 py-2">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">

            N

          </div>

          <div className="hidden sm:block">

            <p className="font-semibold">

              Nourhan Khaled

            </p>

            <p className="text-sm text-gray-500 dark:text-slate-400">

              Reservations Agent

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}