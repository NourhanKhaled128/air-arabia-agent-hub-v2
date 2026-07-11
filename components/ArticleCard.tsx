import Link from "next/link";

interface Props {
  article: {
    slug: string;
    title: string;
    description: string;
    category: string;
    updatedAt: Date;
  };
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/Knowledge/${article.slug}`}
      className="block bg-white dark:bg-surface rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
    >
      <div className="flex justify-between">

        <div>

          <h2 className="text-3xl font-bold">
            {article.title}
          </h2>

          <p className="text-gray-600 dark:text-slate-400 mt-4">
            {article.description}
          </p>

        </div>

        <span className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-brand px-5 py-2 rounded-full font-semibold h-fit">
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
