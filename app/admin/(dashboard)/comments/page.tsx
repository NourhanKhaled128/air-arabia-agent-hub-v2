import {
  MessageCircle,
  Search,
  Check,
  Trash2,
} from "lucide-react";

const comments = [
  {
    id: 1,
    article: "Refund Policy",
    author: "Ahmed Hassan",
    comment: "Need clarification about vouchers.",
    date: "06 Jul 2026",
  },
  {
    id: 2,
    article: "Payments",
    author: "Sara Ali",
    comment: "Procedure works correctly.",
    date: "05 Jul 2026",
  },
];

export default function CommentsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Comments
        </h1>

      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3">

          <Search size={18}/>

          <input
            className="w-full outline-none"
            placeholder="Search comments..."
          />

        </div>

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">Article</th>

              <th className="px-6 py-4 text-left">Author</th>

              <th className="px-6 py-4 text-left">Comment</th>

              <th className="px-6 py-4 text-left">Date</th>

              <th className="px-6 py-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {comments.map((comment) => (

              <tr key={comment.id} className="border-t">

                <td className="px-6 py-5">
                  {comment.article}
                </td>

                <td className="px-6 py-5">
                  {comment.author}
                </td>

                <td className="px-6 py-5">
                  {comment.comment}
                </td>

                <td className="px-6 py-5">
                  {comment.date}
                </td>

                <td className="px-6 py-5">

                  <div className="flex gap-2">

                    <button className="rounded-lg border p-2">
                      <Check size={18}/>
                    </button>

                    <button className="rounded-lg border p-2">
                      <Trash2 size={18}/>
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}