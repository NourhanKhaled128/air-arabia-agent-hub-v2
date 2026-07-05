import Link from "next/link";
import { articles } from "@/Data/articles";

export default function FavoriteArticles() {

  const favorites = articles.slice(0,4);

  return (

    <section className="h-[390px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          ⭐ Favorite Articles

        </h2>

        <Link
          href="/Knowledge"
          className="text-sm font-semibold text-red-700"
        >
          View All
        </Link>

      </div>

      <div className="space-y-4 overflow-y-auto h-[280px]">

        {favorites.map(article => (

          <Link
            key={article.id}
            href={`/knowledge/${article.slug}`}
            className="block rounded-2xl border border-gray-100 p-4 transition hover:bg-red-50"
          >

            <h3 className="font-semibold">

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