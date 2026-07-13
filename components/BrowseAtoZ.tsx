import Link from "next/link";
import { getAllArticles } from "@/lib/article-service";
import { getCategoryBadgeClasses } from "@/lib/helpers";

export default async function BrowseAtoZ() {

  const articles = await getAllArticles({ publishedOnly: true });
  const alphabetical = [...articles]
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, 4);

  return (

    <section className="h-[390px] rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          🔤 Browse A–Z

        </h2>

        <Link
          href="/Knowledge"
          className="text-sm font-semibold text-red-700"
        >
          View All
        </Link>

      </div>

      <div className="space-y-4 overflow-y-auto h-[280px]">

        {alphabetical.map(article => (

          <Link
            key={article.id}
            href={`/Knowledge/${article.slug}`}
            className="block rounded-2xl border border-gray-100 dark:border-border-subtle p-4 transition hover:bg-red-50 dark:hover:bg-red-950/40"
          >

            <h3 className="font-semibold">

              {article.title}

            </h3>

            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadgeClasses(article.category)}`}>
              {article.category}
            </span>

          </Link>

        ))}

      </div>

    </section>

  );

}
