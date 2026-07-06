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

export default function ArticleTable({ articles }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-5 text-left">Title</th>

            <th className="p-5 text-left">Category</th>

            <th className="p-5 text-left">Status</th>

            <th className="p-5 text-left">Author</th>

            <th className="p-5 text-left">Updated</th>

            <th className="p-5 text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {articles.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="p-10 text-center text-gray-500"
              >
                No articles found.
              </td>

            </tr>

          ) : (

            articles.map((article) => (

              <tr
                key={article.id}
                className="border-t"
              >

                <td className="p-5 font-medium">

                  {article.title}

                </td>

                <td>{article.category}</td>

                <td>{article.status}</td>

                <td>{article.author}</td>

                <td>

                  {new Date(article.updatedAt).toLocaleDateString()}

                </td>

                <td>

                  <div className="flex justify-center gap-3">

                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                    >
                      Edit
                    </Link>

                    <button
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
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