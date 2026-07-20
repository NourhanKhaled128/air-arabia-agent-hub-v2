"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, CornerDownLeft } from "lucide-react";
import { adminMenuGroups } from "@/components/AdminSidebar";

interface SearchableArticle {
  id: number;
  title: string;
  category: string;
}

interface Props {
  articles: SearchableArticle[];
}

interface PaletteResult {
  key: string;
  label: string;
  subtitle: string;
  href: string;
}

const pageResults: PaletteResult[] = adminMenuGroups.flatMap((group) =>
  group.items.map((item) => ({
    key: `page-${item.href}`,
    label: item.title,
    subtitle: group.label,
    href: item.href,
  }))
);

export default function AdminCommandPalette({ articles }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function openPalette() {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) return false;
          setQuery("");
          setActiveIndex(0);
          return true;
        });
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("admin:open-command-palette", openPalette);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("admin:open-command-palette", openPalette);
    };
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo<PaletteResult[]>(() => {
    const q = query.trim().toLowerCase();

    const articleResults: PaletteResult[] = articles.map((a) => ({
      key: `article-${a.id}`,
      label: a.title,
      subtitle: a.category || "Article",
      href: `/admin/articles/${a.id}`,
    }));

    const all = [...pageResults, ...articleResults];

    if (!q) return pageResults.slice(0, 8);

    return all.filter((r) => r.label.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)).slice(0, 20);
  }, [query, articles]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-24">
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0"
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-surface shadow-2xl">

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-border-subtle px-5 py-4">
          <Search size={18} className="text-slate-400" />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[activeIndex]) {
                go(results[activeIndex].href);
              }
            }}
            placeholder="Jump to a page or article..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
          />

          <kbd className="rounded-md border border-slate-200 dark:border-border-subtle px-1.5 py-0.5 text-xs text-slate-400">
            Esc
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No matches for &quot;{query}&quot;.
            </p>
          ) : (
            results.map((r, index) => (
              <button
                key={r.key}
                onClick={() => go(r.href)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition ${
                  index === activeIndex
                    ? "bg-red-50 dark:bg-red-950/40 text-brand"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="flex items-center gap-3 truncate">
                  <FileText size={16} className="shrink-0 text-slate-400" />
                  <span className="truncate font-medium">{r.label}</span>
                </span>

                <span className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                  {r.subtitle}
                  {index === activeIndex && <CornerDownLeft size={12} />}
                </span>
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
