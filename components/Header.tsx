"use client";

import { useMemo, useState } from "react";
import { articles } from "@/Data/articles";
import SearchDropdown from "./SearchDropdown";

export default function Header() {

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [query, setQuery] = useState("");

  const results = useMemo(() => {

    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return articles.filter(article =>

      article.title.toLowerCase().includes(q) ||

      article.category.toLowerCase().includes(q) ||

      article.description.toLowerCase().includes(q) ||

      article.content.some(step =>
        step.toLowerCase().includes(q)
      )

    );

  }, [query]);

  return (

    <header className="mb-8 flex items-center justify-between rounded-3xl border border-gray-200 bg-white px-8 py-6 shadow-[0_10px_35px_rgba(0,0,0,0.08)]">

      <div>

        <h1 className="text-3xl font-bold text-black">
          Welcome back, Nourhan 👋
        </h1>

        <p className="mt-2 text-gray-700">
          {today}
        </p>

      </div>

      <div className="flex items-center gap-5">

        <button className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl hover:bg-red-50">

          🔔

          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-600"></span>

        </button>

        <div className="relative w-96">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search knowledge..."
            className="w-full rounded-xl border border-gray-300 px-5 py-3 text-black outline-none focus:border-red-600"
          />

          {query && (

            <SearchDropdown
              results={results}
              onClose={() => setQuery("")}
            />

          )}

        </div>

        <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-2">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 font-bold text-white">

            N

          </div>

          <div>

            <p className="font-semibold text-black">
              Nourhan Khaled
            </p>

            <p className="text-sm text-gray-700">
              Reservations Agent
            </p>

          </div>

        </div>

      </div>

    </header>

  );

}