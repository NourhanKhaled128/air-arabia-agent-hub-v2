"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import SearchDropdown, { type SearchableArticle } from "./SearchDropdown";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";
import { sortByRelevance } from "@/lib/search-utils";

interface Props {
  articles: SearchableArticle[];
  basePath?: string;
}

export default function Header({ articles, basePath = "/Knowledge" }: Props) {

  const { toggleMobileOpen } = useSidebarPrefs();

  const router = useRouter();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hubFilter, setHubFilter] = useState("");

  const hubOptions = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))).sort(),
    [articles]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const results = useMemo(() => {

    if (!debouncedQuery.trim()) return [];

    const pool = hubFilter ? articles.filter((a) => a.category === hubFilter) : articles;

    return sortByRelevance(pool, debouncedQuery, (article) => [
      { text: article.title, weight: 5 },
      { text: article.keywords.map(k => k.value).join(" "), weight: 4 },
      { text: article.description, weight: 3 },
      { text: article.category, weight: 2 },
      { text: article.overview, weight: 2 },
      { text: article.scenarios.map(s => s.situation).join(" "), weight: 1 },
      { text: article.procedures.map(p => p.content).join(" "), weight: 1 },
      { text: article.dispositions.map(d => d.content).join(" "), weight: 1 },
      { text: article.escalations.map(e => e.content).join(" "), weight: 1 },
      { text: article.notes.map(n => n.content).join(" "), weight: 1 },
    ]);

  }, [debouncedQuery, articles, hubFilter]);

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

            {greeting}, Champion 👋

          </h1>

          <p className="mt-2 text-gray-500 dark:text-slate-400">

            {today}

          </p>

        </div>

      </div>

      <div className="flex items-center gap-3 sm:gap-5">

        <select
          value={hubFilter}
          onChange={(e) => setHubFilter(e.target.value)}
          title="Filter search by hub"
          className="hidden rounded-xl border border-gray-300 dark:border-border-subtle bg-white dark:bg-surface py-3 px-3 text-sm outline-none focus:border-brand sm:block"
        >
          <option value="">All Hubs</option>
          {hubOptions.map((hub) => (
            <option key={hub} value={hub}>{hub}</option>
          ))}
        </select>

        <div className="relative w-full sm:w-72 lg:w-96">

          <Search
            size={18}
            className="absolute left-4 top-4 text-gray-400 dark:text-slate-500"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("");
                e.currentTarget.blur();
              } else if (e.key === "Enter" && results[0]) {
                router.push(`${basePath}/${results[0].slug}`);
                setQuery("");
              }
            }}
            placeholder="Search procedures..."
            className="w-full rounded-xl border border-gray-300 dark:border-border-subtle py-3 pl-12 pr-16 outline-none focus:border-brand"
          />

          {!query && (
            <kbd className="pointer-events-none absolute right-4 top-3.5 hidden rounded-md border border-gray-300 dark:border-border-subtle px-1.5 py-0.5 text-xs text-gray-400 dark:text-slate-500 sm:block">
              ⌘K
            </kbd>
          )}

          {query && (

            <SearchDropdown

              results={results}

              query={query}

              onClose={()=>setQuery("")}

              basePath={basePath}

            />

          )}

        </div>

        <ThemeToggle />

        <NotificationBell />

        <div className="hidden items-center gap-3 rounded-xl bg-gray-100 dark:bg-background px-4 py-2 sm:flex">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">

            AA

          </div>

          <div>

            <p className="font-semibold">

              Air Arabia Champion Hub

            </p>

            <p className="text-sm text-gray-500 dark:text-slate-400">

              Shared shift portal

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}