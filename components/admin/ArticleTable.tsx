import Link from "next/link";

interface Article {
  id: number;
  title: string;
  category: string;
  status: string;
  author: string;
  updatedAt: Date;
}

interface Props {
  articles: Article[];
}

export default function ArticleTable({
  articles,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-5 text-left">
              Title
            </th>

            <th className="p-5 text-left">
              Category
            </th>

            <th className="p-5 text-left">
              Status
            </th>

            <th className="p-5 text-left">
              Author
            </th>

            <th className="p-5 text-left">
              Updated
            </th>

            <th className="p-5 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {articles.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="p-12 text-center text-gray-500"
              >
                No Articles Found
              </td>

            </tr>

          ) : (

            articles.map((article) => (

              <tr
                key={article.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >

                <td className="p-5 font-medium">
                  {article.title}
                </td>

                <td className="p-5">
                  {article.category}
                </td>

                <td className="p-5">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium
                    ${
                      article.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : article.status === "Archived"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {article.status}
                  </span>

                </td>

                <td className="p-5">
                  {article.author}
                </td>

                <td className="p-5">
                  {new Date(
                    article.updatedAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-5">

                  <div className="flex justify-center gap-2">

                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </Link>

                    <button
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}