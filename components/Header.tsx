"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, LogOut } from "lucide-react";
import SearchDropdown, { type SearchableArticle } from "./SearchDropdown";
import SimpleSearchDropdown, { type SimpleSearchResult } from "./SimpleSearchDropdown";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";
import { sortByRelevance } from "@/lib/search-utils";
import { portalLogoutAction } from "@/app/actions/portal-auth";
import { logSearchMissAction } from "@/app/actions/search";
import { GLOSSARY_ENTRIES } from "@/lib/glossary-data";
import { QUICK_REFERENCE_HUBS } from "@/lib/quick-reference-data";

export interface DecisionTreeSearchItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  nodesText: string;
}

type SearchScope = "articles" | "trees" | "glossary" | "quickref";

const SCOPE_LABELS: Record<SearchScope, string> = {
  articles: "Articles",
  trees: "Decision Trees",
  glossary: "Glossary",
  quickref: "Quick Reference",
};

interface Props {
  articles: SearchableArticle[];
  decisionTrees?: DecisionTreeSearchItem[];
  basePath?: string;
  portalUserName?: string | null;
}

export default function Header({
  articles,
  decisionTrees = [],
  basePath = "/Knowledge",
  portalUserName,
}: Props) {

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
  const [scope, setScope] = useState<SearchScope>("articles");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const RECENT_SEARCHES_KEY = "airarabia_recent_searches";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    }
  }, []);

  function saveRecentSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors (e.g. private browsing quota)
      }
      return next;
    });
  }

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

  const treeResults = useMemo<SimpleSearchResult[]>(() => {
    if (!debouncedQuery.trim() || scope !== "trees") return [];

    return sortByRelevance(decisionTrees, debouncedQuery, (tree) => [
      { text: tree.title, weight: 5 },
      { text: tree.description, weight: 3 },
      { text: tree.nodesText, weight: 1 },
    ]).map((tree) => ({
      key: `tree-${tree.id}`,
      title: tree.title,
      excerpt: tree.description,
      href: `/decision-trees/${tree.slug}`,
    }));
  }, [debouncedQuery, decisionTrees, scope]);

  const glossaryResults = useMemo<SimpleSearchResult[]>(() => {
    if (!debouncedQuery.trim() || scope !== "glossary") return [];

    return sortByRelevance(GLOSSARY_ENTRIES, debouncedQuery, (entry) => [
      { text: entry.term, weight: 5 },
      { text: entry.definition, weight: 2 },
      { text: entry.category, weight: 1 },
    ]).map((entry) => ({
      key: entry.term,
      title: entry.term,
      excerpt: entry.definition,
      href: "/glossary",
    }));
  }, [debouncedQuery, scope]);

  const quickRefFacts = useMemo(
    () =>
      QUICK_REFERENCE_HUBS.flatMap((hub) =>
        hub.facts.map((fact) => ({ hub: hub.hub, label: fact.label, value: fact.value }))
      ),
    []
  );

  const quickRefResults = useMemo<SimpleSearchResult[]>(() => {
    if (!debouncedQuery.trim() || scope !== "quickref") return [];

    return sortByRelevance(quickRefFacts, debouncedQuery, (fact) => [
      { text: fact.label, weight: 4 },
      { text: fact.value, weight: 2 },
      { text: fact.hub, weight: 1 },
    ]).map((fact, i) => ({
      key: `${fact.hub}-${fact.label}-${i}`,
      title: fact.label,
      excerpt: `${fact.value} (${fact.hub})`,
      href: "/quick-reference",
    }));
  }, [debouncedQuery, scope, quickRefFacts]);

  const nonArticleResults =
    scope === "trees" ? treeResults : scope === "glossary" ? glossaryResults : scope === "quickref" ? quickRefResults : [];

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

            {greeting}, {portalUserName ? portalUserName.split(" ")[0] : "Champion"} 👋

          </h1>

          <p className="mt-2 text-gray-500 dark:text-slate-400">

            {today} · <Link href="/sitemap" className="underline hover:text-red-700 dark:hover:text-brand">Site Index</Link>

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

          <div className="mb-2 flex flex-wrap gap-1.5">
            {(Object.keys(SCOPE_LABELS) as SearchScope[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  scope === s
                    ? "bg-red-700 text-white"
                    : "border border-gray-300 dark:border-border-subtle text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-surface-muted"
                }`}
              >
                {SCOPE_LABELS[s]}
              </button>
            ))}
          </div>

          <Search
            size={18}
            className="absolute left-4 top-[3.25rem] text-gray-400 dark:text-slate-500"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => {
              setSearchFocused(false);
              if (query.trim()) {
                saveRecentSearch(query);
                if (scope === "articles" && results.length === 0) {
                  logSearchMissAction(query).catch(() => {});
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("");
                e.currentTarget.blur();
              } else if (e.key === "Enter" && scope === "articles" && results[0]) {
                saveRecentSearch(query);
                router.push(`${basePath}/${results[0].slug}`);
                setQuery("");
              } else if (e.key === "Enter" && scope !== "articles" && nonArticleResults[0]) {
                saveRecentSearch(query);
                router.push(nonArticleResults[0].href);
                setQuery("");
              }
            }}
            placeholder="Search procedures..."
            className="w-full rounded-xl border border-gray-300 dark:border-border-subtle py-3 pl-12 pr-16 outline-none focus:border-brand"
          />

          {!query && (
            <kbd className="pointer-events-none absolute right-4 top-[3.6rem] hidden rounded-md border border-gray-300 dark:border-border-subtle px-1.5 py-0.5 text-xs text-gray-400 dark:text-slate-500 sm:block">
              ⌘K
            </kbd>
          )}

          {query && scope === "articles" && (
            <SearchDropdown
              results={results}
              query={query}
              onClose={() => setQuery("")}
              basePath={basePath}
            />
          )}

          {query && scope !== "articles" && (
            <SimpleSearchDropdown results={nonArticleResults} onClose={() => setQuery("")} />
          )}

          {!query && searchFocused && recentSearches.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-3 shadow-lg">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
                Recent searches
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(term);
                    }}
                    className="rounded-full border border-gray-300 dark:border-border-subtle px-3 py-1.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
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

              {portalUserName ? (
                <Link href="/account" className="hover:underline">
                  {portalUserName}
                </Link>
              ) : (
                "Air Arabia Champion Hub"
              )}

            </p>

            <p className="text-sm text-gray-500 dark:text-slate-400">

              Shared shift portal

            </p>

          </div>

          <form action={portalLogoutAction}>
            <button
              type="submit"
              title="Logout"
              className="rounded-lg p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-surface-muted"
            >
              <LogOut size={18} />
            </button>
          </form>

        </div>

      </div>

    </header>

  );

}