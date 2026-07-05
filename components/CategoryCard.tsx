import Link from "next/link";

interface Props {
  title: string;
  count: number;
}

export default function CategoryCard({
  title,
  count,
}: Props) {
  return (
    <Link
      href={`/category/${encodeURIComponent(title)}`}
      className="group rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100"
    >
      <div className="text-5xl mb-6">📂</div>

      <h2 className="text-2xl font-bold text-black group-hover:text-red-600">
        {title}
      </h2>

      <p className="mt-3 text-gray-500">
        {count} Articles
      </p>

      <div className="mt-8 text-red-600 font-semibold">
        Browse →
      </div>
    </Link>
  );
}