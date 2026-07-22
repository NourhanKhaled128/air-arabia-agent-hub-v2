import Link from "next/link";
import { getCategoryBadgeClasses } from "@/lib/helpers";

interface Props {
  article: {
    slug: string;
    title: string;
    description: string;
    category: string;
    updatedAt: Date;
  };
  basePath?: string;
  isNew?: boolean;
}

export default function ArticleCard({ article, basePath = "/Knowledge", isNew = false }: Props) {
  return (
    <Link
      href={`${basePath}/${article.slug}`}
      className="block bg-white dark:bg-surface rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
    >
      <div className="flex justify-between">

        <div>

          <h2 className="flex items-center gap-2 text-3xl font-bold">
            {article.title}
            {isNew && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                Updated
              </span>
            )}
          </h2>

          <p className="text-gray-600 dark:text-slate-400 mt-4">
            {article.description}
          </p>

        </div>

        <span className={`px-5 py-2 rounded-full font-semibold h-fit ${getCategoryBadgeClasses(article.category)}`}>
          {article.category}
        </span>

      </div>

      <hr className="my-6 border-gray-200 dark:border-border-subtle" />

      <div className="flex justify-between text-gray-500 dark:text-slate-400">

        <span>
          Updated: {article.updatedAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <span className="text-red-600 font-bold">
          Read →
        </span>

      </div>

    </Link>
  );
}
