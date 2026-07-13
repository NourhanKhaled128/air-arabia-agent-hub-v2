"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { findMatchSnippet, matchesAllWords } from "@/lib/search-utils";
import { getCategoryBadgeClasses } from "@/lib/helpers";

export interface SearchableArticle {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  overview: string;
  keywords: { value: string }[];
  scenarios: { situation: string }[];
  procedures: { content: string }[];
  dispositions: { content: string }[];
  escalations: { content: string }[];
  notes: { content: string }[];
}

interface Props {
  results: SearchableArticle[];
  query: string;
  onClose: () => void;
}

function ArticleSnippet({ article, query }: { article: SearchableArticle; query: string }) {
  const titleMatches = matchesAllWords([article.title], query);

  const match = titleMatches
    ? null
    : findMatchSnippet(
        [
          { source: "description", text: article.description },
          { source: "overview", text: article.overview },
          ...article.keywords.map((k) => ({ source: "keyword", text: k.value })),
          ...article.scenarios.map((s) => ({ source: "scenario", text: s.situation })),
          ...article.procedures.map((p) => ({ source: "procedure", text: p.content })),
          ...article.dispositions.map((d) => ({ source: "disposition", text: d.content })),
          ...article.escalations.map((e) => ({ source: "escalation", text: e.content })),
          ...article.notes.map((n) => ({ source: "note", text: n.content })),
        ],
        query
      );

  if (!match) {
    return <p className="mt-2 text-sm text-gray-600">{article.description}</p>;
  }

  const { snippet, ranges } = match;
  const parts: ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range, i) => {
    if (range.start < cursor) return;
    parts.push(snippet.slice(cursor, range.start));
    parts.push(
      <mark key={i} className="rounded bg-yellow-200 px-0.5 text-gray-900">
        {snippet.slice(range.start, range.start + range.len)}
      </mark>
    );
    cursor = range.start + range.len;
  });
  parts.push(snippet.slice(cursor));

  return <p className="mt-2 text-sm text-gray-600">{parts}</p>;
}

function ResultGroup({
  label,
  results,
  query,
  onClose,
}: {
  label: string;
  results: SearchableArticle[];
  query: string;
  onClose: () => void;
}) {
  if (results.length === 0) return null;

  return (
    <div>
      <p className="sticky top-0 bg-gray-50 dark:bg-background px-5 py-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">
        {label}
      </p>

      {results.map((article) => (
        <Link
          key={article.id}
          href={`/Knowledge/${article.slug}`}
          onClick={onClose}
          className="block border-b border-gray-100 p-5 transition hover:bg-red-50"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-black">
              {article.title}
            </h3>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadgeClasses(article.category)}`}>
              {article.category}
            </span>
          </div>

          <ArticleSnippet article={article} query={query} />
        </Link>
      ))}
    </div>
  );
}

export default function SearchDropdown({
  results,
  query,
  onClose,
}: Props) {
  if (results.length === 0) {
    return (
      <div className="absolute left-0 right-0 top-16 z-50 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <p className="text-center text-gray-500">
          No results found.
        </p>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-16 z-50 max-h-96 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <ResultGroup label="Knowledge Base" results={results.slice(0, 6)} query={query} onClose={onClose} />
    </div>
  );
}