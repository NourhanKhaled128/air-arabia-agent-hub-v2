"use client";

import Link from "next/link";

export interface SearchableArticle {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  overview: string;
}

interface Props {
  results: SearchableArticle[];
  onClose: () => void;
}

export default function SearchDropdown({
  results,
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

      {results.slice(0, 8).map((article) => (

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

            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

              {article.category}

            </span>

          </div>

          <p className="mt-2 text-sm text-gray-600">

            {article.description}

          </p>

        </Link>

      ))}

    </div>
  );
}