import Link from "next/link";
import { FolderOpen, Plus, Pencil, Trash2, Layers3 } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Reservations",
    description: "Booking creation, modification and cancellation procedures.",
    articles: 124,
    color: "bg-red-100 text-red-700",
  },
  {
    id: 2,
    name: "Payments",
    description: "Payments, vouchers, refunds and ADM policies.",
    articles: 67,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    name: "Baggage",
    description: "Checked baggage, cabin baggage and excess baggage.",
    articles: 39,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 4,
    name: "Airport Services",
    description: "Check-in, boarding, SSRs and airport operations.",
    articles: 58,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 5,
    name: "Policies",
    description: "Commercial, operational and customer service policies.",
    articles: 91,
    color: "bg-violet-100 text-violet-700",
  },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Categories
          </h1>

          <p className="mt-3 text-slate-500">
            Organize your knowledge base with categories and subcategories.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
          <Plus size={18} />
          New Category
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <FolderOpen className="mb-4 text-red-700" />
          <p className="text-sm text-slate-500">Categories</p>
          <h2 className="mt-2 text-3xl font-bold">5</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Layers3 className="mb-4 text-blue-700" />
          <p className="text-sm text-slate-500">Articles</p>
          <h2 className="mt-2 text-3xl font-bold">379</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Published</p>
          <h2 className="mt-2 text-3xl font-bold">352</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Drafts</p>
          <h2 className="mt-2 text-3xl font-bold">27</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Articles</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${category.color}`}
                  >
                    {category.name}
                  </span>
                </td>

                <td className="px-6 py-5 text-slate-600">
                  {category.description}
                </td>

                <td className="px-6 py-5 font-semibold">
                  {category.articles}
                </td>

                <td className="px-6 py-5">
                  <div className="flex gap-3">
                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <Trash2 size={18} />
                    </button>

                    <Link
                      href="/admin/articles"
                      className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      View Articles
                    </Link>
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