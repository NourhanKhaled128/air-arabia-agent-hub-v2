"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { getSidebarIcon } from "@/lib/sidebar-icons";
import { matchesAllWords } from "@/lib/search-utils";
import CopyButton from "@/components/CopyButton";

export interface ImportantLinkItem {
  id: number;
  title: string;
  url: string;
  description: string | null;
  icon: string;
}

interface Props {
  links: ImportantLinkItem[];
}

export default function ImportantLinksFull({ links }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return links;
    return links.filter((link) =>
      matchesAllWords([link.title, link.description ?? "", link.url], query)
    );
  }, [links, query]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search important links…"
          className="w-full rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface py-3.5 pl-11 pr-4 text-gray-900 dark:text-slate-100 shadow-sm outline-none focus:border-red-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-200">
            No links match &quot;{query}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((link) => {
            const Icon = getSidebarIcon(link.icon);

            return (
              <div
                key={link.id}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 shadow-sm transition hover:border-red-300 hover:shadow-md"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-brand/10 text-red-700 dark:text-brand">
                    <Icon size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900 dark:text-slate-100">{link.title}</h3>
                    {link.description && (
                      <p className="mt-1 truncate text-sm text-gray-500 dark:text-slate-400">
                        {link.description}
                      </p>
                    )}
                  </div>

                  <ExternalLink size={16} className="shrink-0 text-gray-400 dark:text-slate-500" />
                </a>

                <CopyButton text={link.url} compact />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
