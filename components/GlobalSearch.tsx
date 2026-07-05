"use client";

import { useMemo, useState } from "react";
import { articles } from "@/Data/articles";
import SearchResults from "./SearchResults";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;

    const q = query.toLowerCase();

    return articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.content.some((step) =>
          step.toLowerCase().includes(q)
        )
      );
    });
  }, [query]);

  return (
    <div className="space-y-8">

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search procedures..."
        className="w-full rounded-2xl border border-gray-300 bg-white px-6 py-4 text-lg text-black outline-none focus:border-red-600"
      />

      <SearchResults results={filtered} />

    </div>
  );
}