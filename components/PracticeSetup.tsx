"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { getCategoryBadgeClasses } from "@/lib/helpers";
import type { PracticeScenario } from "@/components/PracticeDeck";

interface ArticleGroup {
  slug: string;
  title: string;
}

interface CategoryGroup {
  name: string;
  articles: ArticleGroup[];
}

interface Props {
  scenarios: PracticeScenario[];
  onStart: (selectedArticleSlugs: Set<string>) => void;
}

function CategoryCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300"
    />
  );
}

export default function PracticeSetup({ scenarios, onStart }: Props) {
  const categories = useMemo<CategoryGroup[]>(() => {
    const byCategory = new Map<string, Map<string, string>>();
    for (const s of scenarios) {
      if (!byCategory.has(s.category)) byCategory.set(s.category, new Map());
      byCategory.get(s.category)!.set(s.articleSlug, s.articleTitle);
    }
    return Array.from(byCategory.entries())
      .map(([name, articles]) => ({
        name,
        articles: Array.from(articles.entries())
          .map(([slug, title]) => ({ slug, title }))
          .sort((a, b) => a.title.localeCompare(b.title)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [scenarios]);

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(scenarios.map((s) => s.articleSlug))
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const totalArticles = useMemo(
    () => categories.reduce((n, c) => n + c.articles.length, 0),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories
      .map((category) => {
        const categoryMatches = category.name.toLowerCase().includes(q);
        const articles = categoryMatches
          ? category.articles
          : category.articles.filter((a) => a.title.toLowerCase().includes(q));
        return { ...category, articles };
      })
      .filter((category) => category.articles.length > 0);
  }, [categories, search]);

  function toggleCategory(category: CategoryGroup) {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = category.articles.every((a) => next.has(a.slug));
      for (const a of category.articles) {
        if (allSelected) next.delete(a.slug);
        else next.add(a.slug);
      }
      return next;
    });
  }

  function toggleArticle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleExpanded(category: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === totalArticles ? new Set() : new Set(scenarios.map((s) => s.articleSlug))));
  }

  const selectedCount = scenarios.filter((s) => selected.has(s.articleSlug)).length;
  const allSelected = selected.size === totalArticles;
  const searching = search.trim() !== "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hubs or articles..."
            className="w-full rounded-xl border border-gray-300 dark:border-border-subtle bg-white dark:bg-surface py-2.5 pl-9 pr-4 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="whitespace-nowrap rounded-xl border border-gray-300 dark:border-border-subtle px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>

      {filteredCategories.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">No hubs or articles match &quot;{search}&quot;.</p>
      ) : (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface shadow-sm divide-y divide-gray-100 dark:divide-border-subtle">
          {filteredCategories.map((category) => {
            const selectedInCategory = category.articles.filter((a) => selected.has(a.slug)).length;
            const checked = selectedInCategory === category.articles.length;
            const indeterminate = selectedInCategory > 0 && !checked;
            const isExpanded = searching || expanded.has(category.name);

            return (
              <div key={category.name} className="p-4">
                <div className="flex items-center gap-3">
                  <CategoryCheckbox
                    checked={checked}
                    indeterminate={indeterminate}
                    onChange={() => toggleCategory(category)}
                  />
                  <button
                    type="button"
                    onClick={() => toggleExpanded(category.name)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadgeClasses(category.name)}`}>
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      {selectedInCategory}/{category.articles.length} articles
                    </span>
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 ml-7 space-y-2">
                    {category.articles.map((article) => (
                      <label key={article.slug} className="flex items-center gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={selected.has(article.slug)}
                          onChange={() => toggleArticle(article.slug)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-gray-700 dark:text-slate-300">{article.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {selectedCount} scenario{selectedCount === 1 ? "" : "s"} selected
        </p>
        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={() => onStart(selected)}
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start practice
        </button>
      </div>
    </div>
  );
}
