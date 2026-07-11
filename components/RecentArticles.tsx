import Link from "next/link";
import { getAllArticles } from "@/lib/article-service";

export default async function RecentArticles() {

  const articles = await getAllArticles({ publishedOnly: true });
  const recent = articles.slice(0, 5);

  return (

    <section className="h-[420px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Recently Updated

        </h2>

        <Link
          href="/Knowledge"
          className="text-sm font-semibold text-red-700"
        >
          View All
        </Link>

      </div>

      <div className="space-y-4 overflow-y-auto h-[310px]">

        {recent.map((article) => (

          <Link
            key={article.id}
            href={`/Knowledge/${article.slug}`}
            className="block rounded-xl border border-gray-100 p-4 transition hover:bg-red-50"
          >

            <h3 className="font-semibold text-black">

              {article.title}

            </h3>

            <p className="mt-2 text-sm text-gray-500">

              {article.category}

            </p>

          </Link>

        ))}

      </div>

    </section>

  );

}
