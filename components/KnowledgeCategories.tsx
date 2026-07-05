import Link from "next/link";
import { categories } from "@/Data/categories";

export default function KnowledgeCategories() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {categories.map((category) => (
        <Link
          href={category.route}
          key={category.id}
          className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-600 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">

            <span className="text-4xl">
              {category.icon}
            </span>

            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {category.articles}
            </span>

          </div>

          <h2 className="mt-6 text-2xl font-bold text-black group-hover:text-red-700">
            {category.title}
          </h2>

          <p className="mt-3 text-gray-700">
            {category.description}
          </p>

        </Link>
      ))}
    </div>
  );
}