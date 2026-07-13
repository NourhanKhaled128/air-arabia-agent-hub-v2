import Link from "next/link";
import { Eye } from "lucide-react";
import { getTrendingArticles } from "@/lib/article-service";
import { getCategoryBadgeClasses } from "@/lib/helpers";

export default async function TrendingArticles() {

  const trending = await getTrendingArticles(4);

  return (

    <section className="h-[390px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          🔥 Trending Procedures

        </h2>

        <Link
          href="/Knowledge"
          className="text-sm font-semibold text-red-700"
        >
          View All
        </Link>

      </div>

      <div className="space-y-4 overflow-y-auto h-[280px]">

        {trending.map(article => (

          <Link
            key={article.id}
            href={`/Knowledge/${article.slug}`}
            className="block rounded-2xl border border-gray-100 p-4 transition hover:bg-red-50"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold">

                {article.title}

              </h3>

              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                <Eye size={14} />
                {article.viewCount}
              </span>

            </div>

            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadgeClasses(article.category)}`}>
              {article.category}
            </span>

          </Link>

        ))}

      </div>

    </section>

  );

}
