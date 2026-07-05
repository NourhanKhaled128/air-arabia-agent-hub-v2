"use client";

import { useMemo, useState } from "react";
import { Bell, Search } from "lucide-react";
import { articles } from "@/Data/articles";
import SearchDropdown from "./SearchDropdown";

export default function Header() {

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

      article.content.some(step =>
        step.toLowerCase().includes(q)
      )

    );

  }, [query]);

  return (

    <header className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white px-8 py-5 shadow-sm">

      <div>

        <h1 className="text-3xl font-bold text-gray-900">

          Welcome back, Nourhan 👋

        </h1>

        <p className="mt-2 text-gray-500">

          {today}

        </p>

      </div>

      <div className="flex items-center gap-5">

        <div className="relative w-96">

          <Search
            size={18}
            className="absolute left-4 top-4 text-gray-400"
          />

          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search procedures..."
            className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-red-700"
          />

          {query && (

            <SearchDropdown

              results={results}

              onClose={()=>setQuery("")}

            />

          )}

        </div>

        <button className="relative rounded-full bg-gray-100 p-3 transition hover:bg-red-50">

          <Bell size={22} />

          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-600"></span>

        </button>

        <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-2">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 font-bold text-white">

            N

          </div>

          <div>

            <p className="font-semibold">

              Nourhan Khaled

            </p>

            <p className="text-sm text-gray-500">

              Reservations Agent

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}