import Link from "next/link";

interface Props {
  article: any;
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="block bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
    >
      <div className="flex justify-between">

        <div>

          <h2 className="text-3xl font-bold">
            {article.title}
          </h2>

          <p className="text-gray-600 mt-4">
            {article.description}
          </p>

        </div>

        <span className="bg-red-100 text-red-700 px-5 py-2 rounded-full font-semibold h-fit">
          {article.category}
        </span>

      </div>

      <hr className="my-6" />

      <div className="flex justify-between text-gray-500">

        <span>
          Updated: {article.lastUpdated}
        </span>

        <span className="text-red-600 font-bold">
          Read →
        </span>

      </div>

    </Link>
  );
}