import Link from "next/link";
import { articles } from "@/Data/articles";

export default function RecentArticles() {
  const latest = [...articles].slice(0, 5);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg h-[470px]">
      <h2 className="mb-6 text-2xl font-bold text-red-700">
        Recently Updated
      </h2>

      <div className="space-y-4">
        {latest.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="flex items-center justify-between rounded-xl border p-4 transition hover:border-red-600 hover:bg-red-50"
          >
            <div>
              <h3 className="font-bold">{article.title}</h3>
              <p className="text-sm text-gray-500">
                {article.lastUpdated}
              </p>
            </div>

            <span className="text-red-600">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}